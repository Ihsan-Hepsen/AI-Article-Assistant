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

chrome.contextMenus.onClicked.addListener(summarize)



async function summarize(data) {
    const text = data.selectionText
    console.log(text)
    if (text) {
        const API_URL = "https://api.openai.com/v1/chat/completions"
        const API_KEY = "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"
        try {
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
                        content: `Please give me a good summary for the following text: ${text}`
                    }]
                })
            })
            const summary = await response.json()
            console.log(`\n\n${summary.choices[0].message.content}\n\n`)
            alert(summary.choices[0].message.content)
        } catch (error) {
            console.log("Error occurred while sendingg summary request to Open AI API.")
            console.error(`Error occurred: ${error}`)
        }
    } else {
        console.error("Cannot summarize for empty or null text.")
        return
    }
}
