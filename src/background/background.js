// import { setDefaultValues } from "../options/helpers.js";
import { defaultShortcuts, defaultGroups } from "../constant.js";

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(function(text) {
  if (text && text.trim()) {
    chrome.storage.sync.get(["shortcuts"], function(result) {
      const shortcuts = result.shortcuts || [];
      console.log(shortcuts, text);
      const shortcut = shortcuts.find(obj => obj.keyword === text.trim());
      if (shortcut) {
        const newURL = shortcut.url;
        // chrome.tabs.create({ url: newURL });
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
