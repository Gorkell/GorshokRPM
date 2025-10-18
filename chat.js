import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove, set } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBOoUI-BhgrirrK4yOQyJUlXrM6EikyRY0",
  authDomain: "gorshokrpm.firebaseapp.com",
  databaseURL: "https://gorshokrpm-default-rtdb.firebaseio.com",
  projectId: "gorshokrpm",
  storageBucket: "gorshokrpm.firebasestorage.app",
  messagingSenderId: "948140804897",
  appId: "1:948140804897:web:eabcb36f436e612cd88c60",
  measurementId: "G-18MEHBMX1G"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// Укажи любой код, который знаешь только ты
const ADMIN_CODE = "secret123";

// Отправка сообщения
document.getElementById("sendBtn").addEventListener("click", () => {
  const text = document.getElementById("msgInput").value.trim();
  const author = "anon" + Math.floor(Math.random() * 1000);
  if (text) {
    push(ref(db, "messages"), {
      text,
      author,
      timestamp: Date.now()
    });
    document.getElementById("msgInput").value = "";
  }
});

// Отображение сообщений
const chatContainer = document.getElementById("chat");
onValue(ref(db, "messages"), (snapshot) => {
  chatContainer.innerHTML = "";
  const messages = snapshot.val();
  for (const id in messages) {
    const msg = messages[id];
    const time = new Date(msg.timestamp).toLocaleTimeString();
    const msgDiv = document.createElement("div");
    msgDiv.className = "message";
    msgDiv.innerHTML = `<b>${msg.author}</b>: ${msg.text} <small>${time}</small>`;

    // Если админ — добавить кнопку удаления
    if (localStorage.getItem("admin") === "true") {
      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑";
      delBtn.onclick = () => remove(ref(db, `messages/${id}`));
      msgDiv.appendChild(delBtn);
    }

    chatContainer.appendChild(msgDiv);
  }
});

// Вход как админ
document.getElementById("adminLogin").addEventListener("click", () => {
  const code = prompt("Введите код администратора:");
  if (code === ADMIN_CODE) {
    localStorage.setItem("admin", "true");
    alert("Вы вошли как администратор!");
  } else {
    alert("Неверный код.");
  }
});

// Очистка чата (только для админа)
document.getElementById("clearChat").addEventListener("click", () => {
  if (localStorage.getItem("admin") === "true") {
    if (confirm("Очистить весь чат?")) {
      set(ref(db, "messages"), null);
    }
  } else {
    alert("Недостаточно прав!");
  }
});
