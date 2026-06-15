document.getElementById('clip-btn').addEventListener('click', async () => {
  // Get the active browser tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab) return;

  // Inject our content script into that active tab to grab and process the HTML
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['readability.js', 'turndown.js', 'content.js']
  });
});