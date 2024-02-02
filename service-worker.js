chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'openSidePanel',
        title: 'Open side panel',
        contexts: ['action']
    })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'openSidePanel') {
        chrome.sidePanel.open({ windowId: tab.windowId })
    }
})

chrome.contextMenus.create({
    id: "ai-actions",
    title: "AI Actions",
    id: "main",
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

chrome.contextMenus.onClicked.addListener(handleAITextOperations)


async function handleAITextOperations(data, tab) {
    const text = data.selectionText
    const content = loadCorrespondingContent(data.menuItemId)
    chrome.sidePanel.open({ windowId: tab.windowId })
    if (text && content) {
        const API_URL = "https://api.openai.com/v1/chat/completions"
        const API_KEY = await getAPIKey()
        try {
            chrome.runtime.sendMessage({ action: 'show-skeleton' })
            let response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo-0613",
                    messages: [{
                        role: "assistant",
                        content: `${content}: ${text}`
                    }]
                })
            })
            const summary = await response.json()
            console.log(`\n\n${summary.choices[0].message.content}\n\n`)
            chrome.runtime.sendMessage({
                action: 'updateSidePanel',
                summary: summary.choices[0].message.content
            })
            chrome.runtime.sendMessage({ action: 'hide-skeleton' })
        } catch (error) {
            console.log("Error occurred while sending the request to Open AI API.")
            console.error(`Error occurred: ${error}`)
            chrome.runtime.sendMessage({ action: 'hide-skeleton' })
        }
    } else {
        console.log("Cannot perform actions for empty or null text.")
        return
    }
}


function loadCorrespondingContent(menuItemId) {
    switch (menuItemId) {
        case 'summary':
            return 'Please give me a good summary for the following text:'
        case 'key-points':
            return 'Generate three key points in bullets summarizing the main content of the given text:'
        case 'elaborate':
            return 'Elaborate on the provided text by providing a detailed and expanded explanation, exploring the context, underlying concepts, and any additional relevant information:'
        default:
            return 'Please give me a good summary for the following text:'
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
