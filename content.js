(() => {
  document.addEventListener('mouseup', handleSelectionChange)
  console.log("content.js loaded")

  let debounceTimer

  function handleSelectionChange() {
    clearTimeout(debounceTimer)

    debounceTimer = setTimeout(() => {
      const selectedText = window.getSelection().toString().trim()
      if (selectedText) {
        chrome.runtime.sendMessage({ action: 'summarizeText', text: selectedText })
      } else {
        console.log("Extension context invalidated. Cannot send message.")
      }
    }, 750)
  }

})()



