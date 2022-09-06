// 浏览器后台运行

function createMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.storage.sync.get("linkList", (res) => {
      res.linkList.forEach((item) => {
        chrome.contextMenus.create({
          id: item.key + "",
          title: item.name,
          type: "normal",
          contexts: ["page"],
          onclick: function () {
            window.open(item.href, item.name, "");
          },
        });
      });
    });
  });
}

chrome.runtime.onMessage.addListener((message) => {
  if (message != "return") {
    chrome.storage.sync.set({ linkList: message.linkList });
  }

  chrome.storage.sync.get("linkList", (res) => {
    chrome.runtime.sendMessage({ linkList: res.linkList });
  });
  createMenu();
});

createMenu();
