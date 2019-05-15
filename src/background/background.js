import { defaultShortcuts, defaultGroups } from "../constant.js";

// suggest results from the existing shortcuts
chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
  chrome.storage.sync.get(["shortcuts"], function(result) {
    const shortcuts = result.shortcuts || [];
    const regex = new RegExp(text, "i");
    let matches = shortcuts.filter(obj => regex.test(obj.keyword));
    // console.log({ text, matches });
    if (matches && matches.length > 0) {
      matches = matches.slice(0, 5);

      const out = [];

      matches.forEach(function(res) {
        out.push({
          content: res.keyword,
          description: `${res.keyword} - ${res.url}`
        });
      });
      // console.log({ out });
      suggest(out);
    } else {
      suggest([]);
    }
  });
});

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(function(text) {
  if (text && text.trim()) {
    chrome.storage.sync.get(["shortcuts"], function(result) {
      const shortcuts = result.shortcuts || [];
      const shortcut = shortcuts.find(obj => obj.keyword === text.trim());
      if (shortcut) {
        const newURL = shortcut.url;
        chrome.tabs.update(null, { url: newURL });
      }
    });
  }
});

export const setDefaultValues = cb => {
  chrome.storage.sync.get(["seedData"], function(result) {
    if (!result.seedData) {
      // adding default shortcuts
      chrome.storage.sync.set({ shortcuts: defaultShortcuts }, function() {
        cb();
      });

      chrome.storage.sync.set({ groups: defaultGroups }, function() {});

      chrome.storage.sync.set({ seedData: true }, function() {});
    } else {
      cb();
    }
  });
};

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason == "install") {
    //call a function to handle a first install
    setDefaultValues(() => {});
  } else if (details.reason == "update") {
    //call a function to handle an update
  }
});
