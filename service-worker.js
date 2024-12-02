const API_URL = "https://api.openai.com/v1/chat/completions"

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: 'openSidePanel',
            title: 'Open side panel',
            contexts: ['action']
        })
        chrome.contextMenus.create({
            id: "main",
            title: "AI Actions",
            contexts: ["selection"]
        })
        chrome.contextMenus.create({
            id: "summary",
            title: "Summarize",
            parentId: "main",
            contexts: ["selection"]
        })
        chrome.contextMenus.create({
            id: "key-points",
            title: "Key Points",
            parentId: "main",
            contexts: ["selection"]
        })
        chrome.contextMenus.create({
            id: "elaborate",
            title: "Elaborate",
            parentId: "main",
            contexts: ["selection"]
        })
    })
})

// chrome.contextMenus.onClicked.addListener(handleAITextOperations)
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'openSidePanel') {
        chrome.sidePanel.open({ windowId: tab.windowId })
    } else {
        handleAITextOperations(info, tab)
    }
})

async function handleAITextOperations(data, tab) {
    const text = data.selectionText
    const content = loadCorrespondingContent(data.menuItemId)
    chrome.sidePanel.open({ windowId: tab.windowId })

    if (text && content) {
        const API_KEY = await getAPIKey()

        try {
            chrome.runtime.sendMessage({ action: 'show-skeleton' })

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: [
                        { role: "system", content: "You are a helpful assistant." },
                        { role: "user", content: `${content}: ${text}` }
                    ],
                })
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`API Error: ${response.status} - ${errorText}`)
            }

            const summary = await response.json()
            const generatedText = summary.choices[0]?.message?.content
            console.log("\n\nGenerated text:")
            console.log(generatedText)
            console.log("\n\n")

            if (!generatedText) {
                throw new Error("No generated text found in the response.")
            }

            console.log(`\n\n${generatedText}\n\n`)

            chrome.runtime.sendMessage({
                action: 'updateSidePanel',
                summary: generatedText
            })
        } catch (error) {
            console.error("Error occurred while sending the request to OpenAI API.", error)
            chrome.runtime.sendMessage({ action: 'show-result-alert-box' })
        } finally {
            chrome.runtime.sendMessage({ action: 'hide-skeleton' })
        }
    } else {
        console.error("Cannot perform actions for empty or null text.")
        chrome.runtime.sendMessage({ action: 'show-result-alert-box' })
    }
}



function loadCorrespondingContent(menuItemId) {
    switch (menuItemId) {
        case 'summary':
            return 'Give me a well-crafted summary for the following text:'
        case 'key-points':
            return 'Generate three key points in bullets summarizing the main content of the given text:'
        case 'elaborate':
            return 'Elaborate on the provided text by providing a detailed and expanded explanation, exploring the context, underlying concepts, and any additional relevant information:'
        default:
            return 'Give me a well-crafted summary for the following text:'
    }
}


function showLoadingSkeleton() {
    chrome.runtime.sendMessage({ action: 'show-skeleton' })
}

function hideLoadingSkeleton() {
    chrome.runtime.sendMessage({ action: 'hide-skeleton' })
}


async function getAPIKey() {
    try {
        const { 'api-key': apiKey } = await chrome.storage.local.get('api-key')
        return apiKey
    } catch (error) {
        console.error('Error retrieving data:', error)
    }
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "test-api-key") {
        const apiKey = request.key
        const API_URL = "https://api.openai.com/v1/chat/completions"

        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: "This is a test." }
                ],
                max_tokens: 5
            })
        })
            .then(async (response) => {
                const status = response.status
                if (status === 401 || status === 429 || status === 403) {
                    sendResponse({ isValid: false })
                    console.error("API Key is invalid or rate-limited.")
                } else if (status >= 200 && status < 300) {
                    const data = await response
                    sendResponse({ isValid: true, data })
                    console.log("API Key is valid")
                } else {
                    sendResponse({ isValid: false })
                    console.error("Unexpected error occurred:", await response.text())
                }
            })
            .catch((error) => {
                sendResponse({ isValid: false })
                console.error("Failed to reach OpenAI API:", error)
            })

        return true
    }
})
