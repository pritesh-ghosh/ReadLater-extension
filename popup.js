document.getElementById('clip-btn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab) return;

  // Simply send a message to the content script already sitting on the page
  chrome.tabs.sendMessage(tab.id, { action: "parse_page" });
});