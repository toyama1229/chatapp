document.getElementById("registerBtn").addEventListener("click", async () => {
            const username = document.getElementById("reg-username").value.trim();
            const password = document.getElementById("reg-password").value.trim();
            const confirm = document.getElementById("reg-password-confirm").value.trim();

            if (!username || !password || !confirm) {
                alert("すべての項目を入力してください");
                return;
            }
            if (password !== confirm) {
                alert("パスワードが一致しません");
                return;
            }
			

            try {
                const response = await fetch("/api/createprofile", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    alert("登録が完了しました！ログイン画面に戻ります");
                    document.getElementById("reg-username").value = "";
                    document.getElementById("reg-password").value = "";
                    document.getElementById("reg-password-confirm").value = "";
					
					window.location.href = "index.html";
				} else if (response.status === 409) {
					alert("このユーザー名はすでに登録されています");
                } else {
                    alert("登録に失敗しました");
                }
            } catch (error) {
                console.error(error);
                alert("サーバーエラーが発生しました");
            }
        });