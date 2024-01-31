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
    const form = document.getElementById('settings')
    const main = document.getElementById('main')
    const heading = document.getElementById('heading')

    heading.innerText = 'Settings'
    form.style.display = 'block'
    main.style.display = 'none'
})


document.getElementById('save-settings-btn').addEventListener('click', () => {
    const input = document.getElementById('apiKeyInput')
    let data = { 'api-key': `${input.value}` }
    chrome.storage.local.set(data, () => {
        if (chrome.runtime.lastError) {
            console.error('Error setting value:', chrome.runtime.lastError)
        } else {
            console.log('Data is saved successfully')
            const successMsg = document.getElementById('success-msg')
            successMsg.style.display = 'block'
            setTimeout(() => {
                successMsg.style.display = 'none';

                // Continue with the rest of the script
                const form = document.getElementById('settings');
                const main = document.getElementById('main');
                const heading = document.getElementById('heading');

                heading.innerText = 'Results';
                form.style.display = 'none';
                main.style.display = 'block';
            }, 1500)
        }
    })
})

document.getElementById('close-settings-btn').addEventListener('click', () => {
    const form = document.getElementById('settings')
    const main = document.getElementById('main')
    const heading = document.getElementById('heading')

    heading.innerText = 'Results'
    form.style.display = 'none'
    main.style.display = 'block'
})



