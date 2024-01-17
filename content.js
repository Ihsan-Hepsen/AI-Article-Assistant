(() => {
  document.addEventListener('mouseup', handleSelectionChange)
  console.log("content.js loaded")

  let debounceTimer
  let button

  function handleSelectionChange() {
    clearTimeout(debounceTimer)

    debounceTimer = setTimeout(() => {
      const selectedText = window.getSelection().toString().trim()
      if (selectedText) {
        createFloatingButton(selectedText)
      } else {
        console.log("Extension context invalidated. Cannot send a message.")
      }
    }, 250)
  }

  function createFloatingButton(selectedText) {
    button = document.createElement('button')
    button.innerText = 'Summarize'
    button.style.position = 'fixed'
    button.style.top = '10px'
    button.style.right = '10px'
    button.style.zIndex = '9999'

    button.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'summarizeText', text: selectedText })
      removeButton()
    })

    document.body.appendChild(button)
    document.addEventListener('click', handleDocumentClick)
  }

  function handleDocumentClick(event) {
    if (button && !button.contains(event.target)) {
      removeButton()
    }
  }

  function removeButton() {
    if (button) {
      button.remove()
      button = null
      document.removeEventListener('click', handleDocumentClick)
    }
  }

})()
