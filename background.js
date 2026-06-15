chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "download_file") {
    // Convert the plain text Markdown into a data URL format Chrome can download
    const blobUrl = "data:text/markdown;charset=utf-8," + encodeURIComponent(message.content);
    
    chrome.downloads.download({
      url: blobUrl,
      filename: message.filename,
      saveAs: true // This prompts the user where to save it
    });
  }
});