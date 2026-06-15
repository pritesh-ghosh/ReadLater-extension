chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "download_file") {
    
    // Create a data URI string directly in the background environment
    // This bypasses the webpage's security restrictions entirely
    const base64Content = btoa(unescape(encodeURIComponent(message.content)));
    const dataUrl = "data:text/markdown;base64," + base64Content;
    
    chrome.downloads.download({
      url: dataUrl,
      filename: message.filename,
      saveAs: true // Prompts the user where to save the file
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error("Download failed:", chrome.runtime.lastError.message);
      } else {
        console.log("Download started with ID:", downloadId);
      }
    });
  }
  return true; // Keeps the messaging channel open
});