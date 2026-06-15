(function() {
  // 1. Grab the raw HTML of the current webpage
  const cloneDoc = document.cloneNode(true);
  
  // 2. Pass it through Mozilla Readability to extract just the core article
  // (Assuming readability.js loaded successfully globally)
  const reader = new Readability(cloneDoc);
  const article = reader.parse();

  if (!article) {
    alert("Could not parse an article from this page!");
    return;
  }

  // 3. Initialize Turndown to convert HTML to Markdown
  const turndownService = new Turndown({ headingStyle: 'atx' });
  const markdownContent = turndownService.turndown(article.content);

  // 4. Construct our final Markdown file layout
  const finalMarkdown = `---
title: "${article.title}"
source: ${window.location.href}
author: ${article.byline || 'Unknown'}
date_saved: ${new Date().toLocaleDateString()}
---

# ${article.title}

${markdownContent}
`;

  // 5. Send this completed text to background.js to download it safely
  chrome.runtime.sendMessage({
    action: "download_file",
    filename: `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`,
    content: finalMarkdown
  });
})();