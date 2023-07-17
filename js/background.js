// 创建右键菜单
function createMenu() {
  // 移除旧菜单项
  chrome.contextMenus.removeAll(() => {
    // 从本地存储中取出数据
    chrome.storage.sync.get("linkList", (res) => {
      res.linkList.forEach((item) => {
        // 创建菜单项
        chrome.contextMenus.create({
          id: item.key + "",
          title: item.name,
          type: "normal",
          contexts: ["page"],
          //   onclick: function () {
          //     window.open(item.href, item.name, "");
          //   },
        });
      });
    });
  });
}

function getMenuClick(info, tab) {
  chrome.storage.sync.get("linkList", (res) => {
    const link = res.linkList.find((item) => item.key == info.menuItemId);
    if (link) {
      chrome.tabs.create({
        url: link.href,
      });
    }
  });
}

// 监听来自idnex.js的数据
chrome.runtime.onMessage.addListener((message) => {
  if (message != "return") {
    // 将数据存在本地存储中
    chrome.storage.sync.set({ linkList: message.linkList });
  }
  // 从本地存储中取出数据
  chrome.storage.sync.get("linkList", (res) => {
    // 将数据发送给index.js
    chrome.runtime.sendMessage({ linkList: res.linkList });
  });
  createMenu();
});

createMenu();

chrome.contextMenus.onClicked.addListener(getMenuClick);
