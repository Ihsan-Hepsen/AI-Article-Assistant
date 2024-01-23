chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'updateSidePanel') {
        document.getElementById('p-content').innerText = request.summary
    }
})


chrome.runtime.onMessage.addListener(function (request) {
    const resSkeleton = document.getElementById('res-skeleton');
    if (request.action === 'show-skeleton') {
        resSkeleton.style.display = 'block'
        document.getElementById('p-content').innerText = ''
    } else if (request.action === 'hide-skeleton') {
        resSkeleton.style.display = 'none'
    }
})