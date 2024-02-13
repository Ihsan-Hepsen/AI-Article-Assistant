async function hasKeyOnSettings() {
    const apiKEy = await getAPIKey()
    const pContent = document.getElementById('p-content')
    if (!apiKEy) {
        pContent.innerText = "Please add your API Key to settings from the top right corner before starting"
    } else {
        pContent.innerText = "Right click on any selected text to perform AI actions"
    }
}
hasKeyOnSettings()


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const copyBtn = document.getElementById('copy-btn')
    if (request.action === 'updateSidePanel') {
        document.getElementById('p-content').innerText = request.summary
        copyBtn.style.display = 'inline'
    }
})


chrome.runtime.onMessage.addListener(function (request) {
    const resSkeleton = document.getElementById('res-skeleton')
    if (request.action === 'show-skeleton') {
        resSkeleton.style.display = 'block'
        document.getElementById('p-content').innerText = ''
    } else if (request.action === 'hide-skeleton') {
        resSkeleton.style.display = 'none'
    }
})


chrome.runtime.onMessage.addListener(function (request) {
    if (request.action === "show-result-alert-box") {
        document.getElementById("result-alert-box").style.display = "block"
    }
})


document.getElementById('copy-btn').addEventListener('click', async () => {
    const copySuccessMsg = document.getElementById('copy-success')
    try {
        const text = document.getElementById("p-content").innerText
        await navigator.clipboard.writeText(text)
        copySuccessMsg.style.display = 'block'
        setTimeout(() => {
            copySuccessMsg.style.display = 'none'
        }, 2000)
    } catch (err) {
        console.error('Failed to copy: ', err)
    }
})


document.getElementById('settings-btn').addEventListener('click', () => {
    document.getElementById("alert-box").style.display = 'none'
    const form = document.getElementById('settings')
    const main = document.getElementById('main')
    const heading = document.getElementById('heading')

    heading.innerText = 'Settings'
    form.style.display = 'block'
    main.style.display = 'none'
})


document.getElementById('save-settings-btn').addEventListener('click', () => {
    const input = document.getElementById('apiKeyInput')
    const formMsg = document.getElementById('form-msg')
    const pContent = document.getElementById("p-content")

    if (input.value.length > 1) {
        testAPIKey(input.value).then(isValid => {
            if (isValid) {
                console.log("API key is valid.")

                let data = { 'api-key': `${input.value}` }
                chrome.storage.local.set(data, () => {
                    if (chrome.runtime.lastError) {
                        console.error('Error setting value:', chrome.runtime.lastError)
                    } else {
                        console.log('Data is saved successfully')
                        formMsg.innerText = 'Saved!'
                        formMsg.style.color = '#03c203'
                        formMsg.style.display = 'block'
                        setTimeout(() => {
                            document.getElementById("result-alert-box").style.display = "none"
                            formMsg.style.display = 'none'
                            const form = document.getElementById('settings')
                            const main = document.getElementById('main')
                            const heading = document.getElementById('heading')
                            heading.innerText = 'Results'
                            form.style.display = 'none'
                            main.style.display = 'block'
                        }, 1500)
                    }
                })
                pContent.innerText = "Right click on any selected text to perform AI actions"
            } else {
                displayAPIKeyErrorBox()
                console.error("API key is not valid.")
            }
        }).catch(error => {
            displayAPIKeyErrorBox()
            console.error("An error occurred:", error)
        })
    } else {
        formMsg.innerText = "API Key field cannot be left blank"
        formMsg.style.color = '#fe1637'
        formMsg.style.display = 'block'
        return
    }
})

document.getElementById('close-settings-btn').addEventListener('click', () => {
    hasKeyOnSettings()
    const form = document.getElementById('settings')
    const main = document.getElementById('main')
    const heading = document.getElementById('heading')
    const formMsg = document.getElementById('form-msg')

    formMsg.style.display = 'none'
    heading.innerText = 'Results'
    form.style.display = 'none'
    main.style.display = 'block'
})


async function getAPIKey() {
    try {
        const { 'api-key': apiKey } = await chrome.storage.local.get('api-key')
        return apiKey
    } catch (error) {
        console.error('Error retrieving data:', error)
    }
}


function testAPIKey(apiKey) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'test-api-key', key: apiKey }, function (response) {
            if (response && response.isValid) {
                console.log("API Key is valid")
                resolve(true) // API key is valid
            } else {
                console.error("API Key is invalid")
                resolve(false) // API key is not valid or other error
            }
        })
    })
}


function displayAPIKeyErrorBox() {
    const alertBox = document.getElementById("alert-box")
    alertBox.innerText = "Your API Key is not valid. Please make sure you saved your API Key correctly"
    alertBox.style.display = "block"
}
