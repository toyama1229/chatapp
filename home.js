const STORAGE_KEY = "studyPosts";
const posts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ------------------------------------
// 最近の履歴（上位5件）
// ------------------------------------
const historyList = document.querySelector("#recentHistory ul");
if (historyList) {
  historyList.innerHTML = posts
    .slice(0, 5)
    .map((p) => {
      switch (p.type) {
        case "exam":
          return `<li><strong>📘試験名：</strong>${
            p.name || "（不明）"
          } <strong>試験日：</strong>${p.date || "未設定"} - 残り ${
            p.daysLeft ?? "?"
          }日</li>`;
        case "study":
          return `<li><strong>⏰学習：</strong>${p.date || "未設定"} に ${
            p.name || "未設定"
          }を ${p.hours || 0} 時間</li>`;
        case "memo":
          return `<li><strong>📝メモ：</strong>${
            p.content || "（内容なし）"
          }</li>`;
        default:
          return `<li>不明なデータ</li>`;
      }
    })
    .join("");
}

// ------------------------------------
// 試験日カウントダウン（複数対応）
// ------------------------------------
const examContainer = document.getElementById("examCountdown");
if (examContainer) {
  const examPosts = posts.filter((p) => p.type === "exam" && p.date);

  examPosts.forEach((exam) => {
    const targetDate = new Date(exam.date);
    const diff = targetDate - new Date();
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const examName = exam.name || "試験";

    const item = document.createElement("div");
    item.textContent = `・${examName}：あと${daysLeft}日！`;
    examContainer.appendChild(item);
  });

  if (examPosts.length === 0) {
    examContainer.textContent = "登録された試験はありません";
  }
}

// ------------------------------------
// 資格別に学習時間を集計
// ------------------------------------
const studyPosts = posts.filter((p) => p.type === "study");
const hoursByExam = {};

studyPosts.forEach((p) => {
  const name = p.name || "不明";
  const hours = parseFloat(p.hours) || 0;
  hoursByExam[name] = (hoursByExam[name] || 0) + hours;
});

// グラフ用データ生成
const labels = Object.keys(hoursByExam);
const data = Object.values(hoursByExam);

// ランダムカラー生成
const colors = labels.map(() => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r}, ${g}, ${b}, 0.6)`;
});

// Chart.js 描画
const ctx = document.getElementById("weeklyChart");
if (ctx && typeof Chart !== "undefined") {
  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "資格別 学習時間（h）",
          data,
          backgroundColor: colors,
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "時間" },
        },
      },
    },
  });
}
