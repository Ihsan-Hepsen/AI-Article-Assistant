chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log('Message received:', message)
    if (message.action === 'summarizeText') {
        summarize(message.text)
        console.log('Selected Text:', message.text)
    }
})


async function summarize(text) {
    const API_URL = "https://api.openai.com/v1/chat/completions"
    const API_KEY = ""
    if (text) {
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
        } catch (error) {
            console.log("Error occurred while sendingg summary request to Open AI API.")
            console.error(`Error occurred: ${error}`)
        }
    } else {
        console.error("Cannot summarize for empty or null text.")
        return
    }
}
