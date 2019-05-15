import { renderUI, guid, isValidURL } from "./helpers.js";

const appendPrefixToKeyword = (groups, groupId, keyword) => {
  const group = groups.find(obj => obj.id === groupId);
  if (group && group.prefix) {
    return `${group.prefix}${keyword}`;
  }
  return keyword;
};

function onInit() {
  var app = new Vue({
    el: "#app",
    data: {
      message: "Hello Vue!",
      groups: [],
      shortcuts: []
    },
    created() {
      chrome.storage.sync.get(["shortcuts", "groups"], result => {
        this.shortcuts = result.shortcuts || [];
        this.groups = result.groups || [];
      });
    },
    computed: {
      reverseShortcuts() {
        return this.shortcuts.reverse();
      }
    },
    methods: {
      deleteShortcut(e) {
        const keyword = e.target.getAttribute("data-keyword");
        const index = this.shortcuts.findIndex(obj => obj.keyword === keyword);
        if (index > -1) {
          this.shortcuts.splice(index, 1);
          chrome.storage.sync.set({ shortcuts: this.shortcuts }, function() {});
        }
      },
      createShortcut(e) {
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

        if (group !== "default") {
          keyword = appendPrefixToKeyword(this.groups, group, keyword);
        }
        const exists = this.shortcuts.find(
          obj => obj.keyword === keyword.trim()
        );
        if (exists) {
          alert("shortcut already exists");
          return;
        }
        this.shortcuts.push({
          keyword,
          url,
          group
        });
        chrome.storage.sync.set({ shortcuts: this.shortcuts }, function() {
          document.getElementById("keyword").value = "";
          document.getElementById("url").value = "";
        });
      },
      getGroupName(shortcut) {
        const group = this.groups.find(obj => obj.id === shortcut.group);
        return group ? group.name : "Default";
      },
      openCreateGroupModal(e) {
        document
          .getElementById("modal-create-group")
          .classList.add("is-active");
      },
      hideCreateGroupModal() {
        document.getElementById("prefix").value = "";
        document.getElementById("groupName").value = "";
        document
          .getElementById("modal-create-group")
          .classList.remove("is-active");
      },
      hideCreateGroup(e) {
        this.hideCreateGroupModal();
      },
      createGroup() {
        const prefix = document.getElementById("prefix").value || false;
        const groupName = document.getElementById("groupName").value;

        if (!groupName || !groupName.trim()) {
          alert("Please enter group name");
          return;
        }

        const exists = this.groups.find(obj => obj.name === groupName.trim());
        if (exists) {
          alert("Group name already exists");
          return;
        }
        this.groups.push({
          prefix,
          name: groupName,
          id: guid()
        });
        chrome.storage.sync.set({ groups: this.groups }, function() {});
        this.hideCreateGroupModal();
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", onInit, false);
