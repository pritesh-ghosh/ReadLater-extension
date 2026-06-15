document.getElementById('clip-btn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab) return;

  try {
    // 1. Load Readability first
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['readability.js']
    });

    // 2. Load Turndown second
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['turndown.js']
    });

    // 3. Finally, execute the content script that uses them
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });

  } catch (err) {
    console.error("Injection failed: ", err);
  }
});