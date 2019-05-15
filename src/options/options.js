import { setDefaultValues, renderUI, guid, isValidURL } from "./helpers.js";

const deleteShortcutWithKeyword = keyword => {
  chrome.storage.sync.get(["shortcuts"], function(result) {
    const shortcuts = result.shortcuts || [];
    const index = shortcuts.findIndex(obj => obj.keyword === keyword);
    if (index > -1) {
      shortcuts.splice(index, 1);
    }
    chrome.storage.sync.set({ shortcuts: shortcuts }, function() {
      renderUI();
    });
  });
};

const appendPrefixToKeyword = (groups, groupId, keyword) => {
  const group = groups.find(obj => obj.id === groupId);
  if (group && group.prefix) {
    return `${group.prefix}${keyword}`;
  }
  return keyword;
};

const initCreateShortcutForm = () => {
  const el = document.getElementById("createShortcutForm");
  el.addEventListener(
    "submit",
    function(e) {
      e.preventDefault();
      const group = document.getElementById("groupList").value;
      let keyword = document.getElementById("keyword").value;
      const url = document.getElementById("url").value;

      if (!keyword || !url) {
        alert("Please enter valid details");
        return;
      }

      if (!isValidURL(url)) {
        alert("Please enter complete URL including http");
        return;
      }

      chrome.storage.sync.get(["shortcuts", "groups"], function(result) {
        const shortcuts = result.shortcuts || [];
        const groups = result.groups || [];
        if (group !== "default") {
          keyword = appendPrefixToKeyword(groups, group, keyword);
        }
        const exists = shortcuts.find(obj => obj.keyword === keyword.trim());
        if (exists) {
          alert("shortcut already exists");
          return;
        }
        shortcuts.push({
          keyword,
          url,
          group
        });
        chrome.storage.sync.set({ shortcuts: shortcuts }, function() {
          document.getElementById("keyword").value = "";
          document.getElementById("url").value = "";
          renderUI();
        });
      });
    },
    false
  );
};

const closeCreateGroupModal = () => {
  document.getElementById("prefix").value = "";
  document.getElementById("groupName").value = "";
  document.getElementById("modal-create-group").classList.remove("is-active");
};

const handleCreateGroupSubmit = () => {
  const prefix = document.getElementById("prefix").value || false;
  const groupName = document.getElementById("groupName").value;

  if (!groupName || !groupName.trim()) {
    alert("Please enter group name");
    return;
  }

  chrome.storage.sync.get(["groups"], function(result) {
    const groups = result.groups || [];
    const exists = groups.find(obj => obj.name === groupName.trim());
    if (exists) {
      alert("Group name already exists");
      return;
    }
    groups.push({
      prefix,
      name: groupName,
      id: guid()
    });
    chrome.storage.sync.set({ groups: groups }, function() {
      closeCreateGroupModal();
      renderUI();
    });
  });
};

const initCreateGroupForm = () => {
  const el = document.getElementById("createGroupForm");
  el.addEventListener(
    "submit",
    function(e) {
      e.preventDefault();
      handleCreateGroupSubmit();
    },
    false
  );
};

const initDeleteShortcutEvent = () => {
  document.addEventListener("click", function(e) {
    if (e.target.id === "deleteShortcut") {
      const keyword = e.target.getAttribute("data-keyword");
      deleteShortcutWithKeyword(keyword);
    }

    const classes = e.target.classList;
    if (classes.contains("modal-button")) {
      const target = e.target.getAttribute("data-target");
      document.getElementById(target).classList.add("is-active");
    }

    if (classes.contains("modal-hide")) {
      const target = e.target.getAttribute("data-target");
      closeCreateGroupModal();
    }

    if (e.target.id === "submitCreateGroupForm") {
      handleCreateGroupSubmit();
    }
  });
};

function onInit() {
  // seed data
  setDefaultValues(function() {
    renderUI();
    initCreateShortcutForm();
    initCreateGroupForm();
    initDeleteShortcutEvent();
  });
}

document.addEventListener("DOMContentLoaded", onInit, false);
