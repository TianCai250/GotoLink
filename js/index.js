window.onload = () => {
  const webName = document.querySelector(".input-name");
  const webHref = document.querySelector(".input-href");
  const addBtn = document.querySelector(".add-btn");
  const list = document.querySelector(".link-list");
  let linkList = [];

  addBtn.addEventListener("click", () => {
    const name = webName.value;
    const href = webHref.value;
    if (name.trim() == "" || href.trim() == "") {
      return;
    }
    // 增加链接
    addLink(name, href);
    webName.value = "";
    webHref.value = "";
  });

  function bindDel() {
    linkList.forEach((item) => {
      document.getElementById(item.key).addEventListener("click", () => {
        delLink(item.key);
      });
    });
  }

  function addLink(name, href) {
    const link = {
      key: new Date().getTime(),
      name,
      href,
    };
    linkList.push(link);
    saveLinkList();
  }

  function delLink(key) {
    linkList = linkList.filter((item) => item.key != key);
    saveLinkList();
  }
  // 存储数据
  function saveLinkList() {
    chrome.runtime.sendMessage({ linkList: linkList });
  }
  // 监听数据
  chrome.runtime.onMessage.addListener((message) => {
    if (message && message.linkList) {
      linkList = message.linkList;
    } else {
      linkList = [];
    }
    renderList();
  });

  // 渲染列表
  function renderList() {
    const html = linkList
      .map((item) => {
        return `
                    <div class="link-item">
                        <div class="link-content">
                            <div class="link-name">${item.name}</div>
                            <div class="link-href">${item.href}</div>
                        </div>
                        <div class="del-content">
                            <div class="del-btn" id="${item.key}">删除</div>
                        </div>
                    </div>
                `;
      })
      .join("");
    list.innerHTML = html;
    bindDel();
  }

  chrome.runtime.sendMessage("return");
};
