(function() {
  // 1. Grab the raw HTML of the current webpage
  const cloneDoc = document.cloneNode(true);
  
  // 2. Pass it through Mozilla Readability to extract just the core article
  if (typeof Readability === 'undefined') {
    alert("Readability library failed to load. Please refresh the page and try again.");
    return;
  }
  
  const reader = new Readability(cloneDoc);
  const article = reader.parse();

  if (!article) {
    alert("Could not parse an article from this page. Try an article or news site!");
    return;
  }

  // 3. Initialize Turndown to convert HTML to Markdown
  if (typeof Turndown === 'undefined') {
    alert("Turndown library failed to load.");
    return;
  }
  
// 3. Initialize Turndown to convert HTML to Markdown
  let turndownService;
  if (typeof Turndown !== 'undefined') {
    turndownService = new Turndown({ headingStyle: 'atx' });
  } else if (typeof window.Turndown !== 'undefined') {
    turndownService = new window.Turndown({ headingStyle: 'atx' });
  } else {
    alert("Turndown library failed to attach globally.");
    return;
  }
  
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

  // 5. Send the RAW markdown text to background.js safely
  chrome.runtime.sendMessage({
    action: "download_file",
    filename: `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`,
    content: finalMarkdown
  });
})();