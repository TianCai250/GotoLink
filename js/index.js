window.onload = () => {
  const webName = document.querySelector(".input-name");
  const webHref = document.querySelector(".input-href");
  const addBtn = document.querySelector(".add-btn");
  const list = document.querySelector(".link-list");
  let linkList = [];

  // 点击添加按钮
  addBtn.addEventListener("click", () => {
    const name = webName.value;
    const href = webHref.value;
    if (name.trim() == "" || href.trim() == "") {
      return;
    }
    addLink(name, href);
    webName.value = "";
    webHref.value = "";
  });
  // 处理拖拽排序
  function handleSort() {
    new Sortable(list, {
      animation: 150,
      onEnd({ newIndex, oldIndex }) {
        console.log(newIndex, oldIndex);
        const currRow = linkList.splice(oldIndex, 1)[0];
        linkList.splice(newIndex, 0, currRow);
        console.log(linkList);
        saveLinkList();
      },
    });
  }

  // 给删除按钮绑定点击事件
  function bindDel() {
    linkList.forEach((item) => {
      document.getElementById(item.key).addEventListener("click", () => {
        delLink(item.key);
      });
    });
  }
  // 增加链接
  function addLink(name, href) {
    const link = {
      key: new Date().getTime(),
      name,
      href,
    };
    linkList.push(link);
    saveLinkList();
  }
  // 删除链接
  function delLink(key) {
    linkList = linkList.filter((item) => item.key != key);
    saveLinkList();
  }
  // 存储数据
  function saveLinkList() {
    // 将链接数据发送给background
    chrome.runtime.sendMessage({ linkList: linkList });
  }
  // 监听来自background的数据
  chrome.runtime.onMessage.addListener((message) => {
    if (message && message.linkList) {
      linkList = message.linkList;
    } else {
      linkList = [];
    }
    renderList();
  });

  // 渲染链接列表
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
  // 通知background返回列表数据，用来第一次初始化列表数据
  chrome.runtime.sendMessage("return");

  handleSort();
};
