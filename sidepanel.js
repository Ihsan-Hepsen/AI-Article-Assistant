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
