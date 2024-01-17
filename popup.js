document.addEventListener('DOMContentLoaded', function () {
    var button = document.getElementById('myButton')
    button.addEventListener('click', function () {
        // Implement your logic here when the button is clicked
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'doSomething' })
        })
    })
})
