import { defaultShortcuts, defaultGroups } from "../constant.js";

const getGroupName = (groups, groupId) => {
  const group = groups.find(obj => obj.id === groupId);
  return group ? group.name : "Default";
};

export const renderUI = () => {
  chrome.storage.sync.get(["shortcuts", "groups"], function(result) {
    // console.log(result);
    const shortcuts = result.shortcuts || [];
    const groups = result.groups || [];
    // create group form
    const groupEl = document.getElementById("groupList");
    let groupStr = groups.map(
      group =>
        `
        <option value=${group.id}>
          ${group.name} ${group.prefix ? `(${group.prefix})` : ""}
        </option>
      `
    );
    const groupHTML = groupStr.join(" ");
    groupEl.innerHTML = groupHTML;

    // table
    const el = document.getElementById("keywords-info");
    let strs = shortcuts.map(
      shortcut =>
        `
        <tr>
          <td>${getGroupName(groups, shortcut.group)}</td>
          <td>${shortcut.keyword}</td>
          <td>${shortcut.url}</td>
          <td>
            <img src="../../assets/icons/trash-alt-regular.svg" width="15" class="c-p" id="deleteShortcut" data-keyword="${
              shortcut.keyword
            }">
          </td>
        </tr>
      `
    );
    const html = strs.join(" ");
    el.innerHTML = html;
  });
};

export const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
};

export const isValidURL = string => {
  var res = string.match(
    /(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  if (res == null) return false;
  else return true;
};
