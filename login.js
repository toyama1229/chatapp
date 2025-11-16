document.getElementById("loginBtn").addEventListener("click", async () => {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!username || !password) {
    alert("ユーザー名とパスワードを入力してください。");
    return;
  }

  try {
    // Spring Boot API に送信
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const result = await response.text();

    if (result === "success") {
      alert("ログイン成功！");
      // ログインユーザー名を保持（例：次の画面で利用）
      localStorage.setItem("chatUser", username);
      window.location.href = "home.html";
    } else {
      alert("ユーザー名またはパスワードが間違っています。");
    }

  } catch (error) {
    console.error(error);
    alert("サーバーエラーが発生しました。");
  }
});
