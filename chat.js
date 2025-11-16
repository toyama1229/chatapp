const user = localStorage.getItem("chatUser");
if (!user) {
  window.location.href = "index.html";
}

const groupList = document.getElementById("groupList");
const chatTitle = document.getElementById("chatTitle");
const messagesList = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let currentGroup = null;
let messages = []; // 現在のグループのメッセージ配列

// グループ選択処理
groupList.addEventListener("click", (e) => {
  if (e.target.tagName !== "LI") return;

  currentGroup = e.target.dataset.group;
  chatTitle.textContent = `${currentGroup} のチャット`;
  loadMessages();
});

// グループのメッセージを読み込み
function loadMessages() {
  const saved = localStorage.getItem(`chatMessages_${currentGroup}`);
  messages = saved ? JSON.parse(saved) : [];
  renderMessages();
}

// メッセージ送信
sendBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text || !currentGroup) return;

  const msg = { user, text, time: new Date().toISOString(), stamp: null };
  messages.push(msg);
  localStorage.setItem(
    `chatMessages_${currentGroup}`,
    JSON.stringify(messages)
  );

  input.value = "";
  renderMessages();
});

// メッセージ描画
function renderMessages() {
  messagesList.innerHTML = "";

  messages.forEach((msg, index) => {
    const li = document.createElement("li");
    li.classList.add("message");
    li.classList.add(msg.user === user ? "self" : "other");

    li.innerHTML = `
      <div class="message-header">
        <strong>${msg.user}</strong> 
        <small>${new Date(msg.time).toLocaleTimeString()}</small>
      </div>
      <div class="message-body">${msg.text}</div>
      <div class="message-actions">
        <button class="stamp-btn" data-index="${index}">😊</button>
        ${msg.stamp ? `<span class="stamp-display">${msg.stamp}</span>` : ""}
      </div>
    `;
    messagesList.appendChild(li);
  });
}

// スタンプ一覧
const STAMPS = ["😊", "😆", "❤️", "👍", "🎉", "🙏"];

// スタンプボタンのクリック
messagesList.addEventListener("click", (e) => {
  // スタンプボタン押下時
  if (e.target.classList.contains("stamp-btn")) {
    const index = e.target.dataset.index;

    // 既存のポップアップを削除（1つだけ表示）
    document
      .querySelectorAll(".stamp-popup")
      .forEach((popup) => popup.remove());

    // 新しいポップアップを作成
    const popup = document.createElement("div");
    popup.classList.add("stamp-popup");

    STAMPS.forEach((emoji) => {
      const btn = document.createElement("button");
      btn.textContent = emoji;
      btn.addEventListener("click", () => {
        messages[index].stamp = emoji;
        localStorage.setItem(
          `chatMessages_${currentGroup}`,
          JSON.stringify(messages)
        );
        popup.remove();
        renderMessages();
      });
      popup.appendChild(btn);
    });

    // 押したボタンの位置に表示
    document.body.appendChild(popup);

    const rect = e.target.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const screenWidth = window.innerWidth;

    // デフォルト位置（ボタンのすぐ下）
    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY + 6;

    // 右端にはみ出す場合は左寄せ
    if (left + popupRect.width > screenWidth - 10) {
      left = screenWidth - popupRect.width - 10;
    }

    // 左端にも出ないように
    if (left < 10) {
      left = 10;
    }

    popup.style.position = "absolute";
    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
    popup.style.zIndex = "9999";

    // アニメーション
    setTimeout(() => popup.classList.add("show"), 10);
  }
});

// どこかクリックしたらポップアップ閉じる
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("stamp-btn")) {
    document
      .querySelectorAll(".stamp-popup")
      .forEach((popup) => popup.remove());
  }
});

window.addEventListener("storage", (e) => {
  if (e.key === `chatMessages_${currentGroup}`) {
    loadMessages();
  }
});

// =====================================
// WebSocket接続処理（リアルタイム通信）
// =====================================

// WebSocketサーバーのURL（Spring Bootが8080で動いている場合）
const socket = new SockJS("/ws"); // WebSocketConfigで "/ws" を設定している
const stompClient = Stomp.over(socket);

// 接続開始
stompClient.connect({}, (frame) => {
  console.log("✅ WebSocket connected:", frame);

  // 資格ごと（グループ）チャット用サブスクライブ
  groupList.addEventListener("click", (e) => {
    if (e.target.tagName !== "LI") return;

    currentGroup = e.target.dataset.group;
    chatTitle.textContent = `${currentGroup} のチャット`;

    // メッセージ購読を一旦解除 → 再購読
    stompClient.unsubscribe("chatSubscription");
    stompClient.subscribe(`/topic/messages/${currentGroup}`, (message) => {
      const msgObj = JSON.parse(message.body);
      messages.push(msgObj);
      renderMessages();
    }, { id: "chatSubscription" });

    loadMessages();
  });
});

// =====================================
// WebSocket送信（メッセージ送信時）
// =====================================
sendBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text || !currentGroup) return;

  const msg = {
    user,
    text,
    time: new Date().toISOString(),
  };

  // ---- WebSocketで送信 ----
  stompClient.send(`/app/chat/${currentGroup}`, {}, JSON.stringify(msg));

  // ---- ローカル保存も維持（履歴表示用）----
  messages.push(msg);
  localStorage.setItem(
    `chatMessages_${currentGroup}`,
    JSON.stringify(messages)
  );

  input.value = "";
  renderMessages();
});
