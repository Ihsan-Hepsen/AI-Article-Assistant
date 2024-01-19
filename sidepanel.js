chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'updateSidePanel') {
        // Update the HTML content of the side panel
        document.getElementById('p-content').innerText = request.summary
    }
})