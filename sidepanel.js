chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'updateSidePanel') {
        document.getElementById('p-content').innerText = request.summary
    }
})