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
    // Create a button element
    button = document.createElement('button')
    button.innerText = 'Summarize'
    button.style.position = 'fixed'
    button.style.top = '10px'
    button.style.right = '10px'
    button.style.zIndex = '9999'

    // Attach click event to the button
    button.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'summarizeText', text: selectedText })
      removeButton()
    })

    // Append the button to the document body
    document.body.appendChild(button)

    // Add a click event listener to the document to remove the button if clicked outside
    document.addEventListener('click', handleDocumentClick)
  }

  function handleDocumentClick(event) {
    // Check if the click target is not the button
    if (button && !button.contains(event.target)) {
      removeButton()
    }
  }

  function removeButton() {
    // Remove the button and event listener
    if (button) {
      button.remove()
      button = null
      document.removeEventListener('click', handleDocumentClick)
    }
  }

})()
