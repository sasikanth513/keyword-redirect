export const defaultGroups = [
  {
    name: "Default",
    id: "default",
    prefix: false
  }
];

export const defaultShortcuts = [
  {
    keyword: "app",
    url:
      "https://chrome.google.com/webstore/detail/keyword-redirect/okmndadncjgigahlgcbgenaoecagebhh/",
    group: "default"
  },
  {
    keyword: "dev",
    url: "https://twitter.com/sasi513",
    group: "default"
  }
];

export const encodeHTML = function (str) {
  return str.replace(/&/g, '&amp;')
   .replace(/</g, '&lt;')
   .replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;')
   .replace(/'/g, '&apos;');
};
