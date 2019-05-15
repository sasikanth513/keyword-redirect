// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function(text) {
    if (text && text.trim()) {
      chrome.storage.sync.get(['shortcuts'], function(result) {
        const shortcuts = result.shortcuts || [];
        console.log(shortcuts, text);
        const shortcut = shortcuts.find(obj => obj.keyword === text.trim())
        if (shortcut) {
          const newURL = shortcut.url;
          // chrome.tabs.create({ url: newURL });
          chrome.tabs.update(null, {url: newURL});
        }
      });
    }
  });
