// Listen for the click message from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "parse_page") {
    
    // 1. Grab raw HTML
    const cloneDoc = document.cloneNode(true);
    
    // 2. Run Readability
    const reader = new Readability(cloneDoc);
    const article = reader.parse();

    if (!article) {
      alert("Could not parse an article from this page.");
      return;
    }

    // 3. Run Turndown
    const turndownService = new Turndown({ headingStyle: 'atx' });
    const markdownContent = turndownService.turndown(article.content);

    // 4. Create Markdown Format
    const finalMarkdown = `---
title: "${article.title}"
source: ${window.location.href}
author: ${article.byline || 'Unknown'}
date_saved: ${new Date().toLocaleDateString()}
---

# ${article.title}

${markdownContent}
`;

    // 5. Send raw data to background worker to download
    chrome.runtime.sendMessage({
      action: "download_file",
      filename: `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`,
      content: finalMarkdown
    });
  }
});