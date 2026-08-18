const API_KEY = "dahl_NV5BaweuvsinDNLA4FC3EwdxmgMssuEZi";
const API_URL = "https://inference.dahl.global/v1/chat/completions";

const SYSTEM_PROMPT = `أنت Nova AI، مساعد ذكي بالعربية.
-أجب مباشرة بالعربية وكل اللغات  ط
- لا تذكر ما قاله المستخدم
- لا تشرح تفكيرك
- كن مختصراً ومفيداً`;

// العناصر
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatDisplay = document.getElementById("chatDisplay");
const newChatBtn = document.getElementById("newChatBtn");
const chatHistoryList = document.getElementById("chatHistoryList");
const sendBtn = document.getElementById("sendBtn");
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");

const loginPage = document.getElementById("loginPage");
const showLoginBtn = document.getElementById("showLoginBtn");
const loginForm = document.getElementById("loginForm");
const backToChatFromLogin = document.getElementById("backToChatFromLogin");
const goToSignup = document.getElementById("goToSignup");

const signupPage = document.getElementById("signupPage");
const showSignupBtn = document.getElementById("showSignupBtn");
const signupForm = document.getElementById("signupForm");
const backToChatFromSignup = document.getElementById("backToChatFromSignup");
const goToLogin = document.getElementById("goToLogin");

let chats = JSON.parse(localStorage.getItem("novaChats")) || [];
let currentChatId = null;

// التنقل
sidebarToggle.onclick = () => sidebar.classList.toggle("closed");

function showLoginPage() {
  loginPage.style.display = "flex";
  signupPage.style.display = "none";
}

function showSignupPage() {
  signupPage.style.display = "flex";
  loginPage.style.display = "none";
}

function backToChat() {
  loginPage.style.display = "none";
  signupPage.style.display = "none";
}

showLoginBtn.onclick = showLoginPage;
backToChatFromLogin.onclick = (e) => {
  e.preventDefault();
  backToChat();
};
loginForm.onsubmit = (e) => {
  e.preventDefault();
  alert("✓ تم تسجيل الدخول!");
  backToChat();
};

showSignupBtn.onclick = showSignupPage;
backToChatFromSignup.onclick = (e) => {
  e.preventDefault();
  backToChat();
};
signupForm.onsubmit = (e) => {
  e.preventDefault();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById(
    "signupConfirmPassword",
  ).value;
  if (password !== confirmPassword) {
    alert("⚠️ كلمات المرور غير متطابقة!");
    return;
  }
  alert("✓ تم إنشاء الحساب!");
  backToChat();
};

goToSignup.onclick = (e) => {
  e.preventDefault();
  showSignupPage();
};
goToLogin.onclick = (e) => {
  e.preventDefault();
  showLoginPage();
};

// إدارة المحادثات
function saveChats() {
  localStorage.setItem("novaChats", JSON.stringify(chats));
}

function createNewChat() {
  const newChat = {
    id: Date.now(),
    title: "محادثة جديدة",
    messages: [{ sender: "ai", text: "أهلاً بك! أنا جاهز لمساعدتك." }],
  };
  chats.unshift(newChat);
  currentChatId = newChat.id;
  saveChats();
  renderSidebar();
  renderChat();
}

function deleteChat(chatId, event) {
  event.stopPropagation();
  if (confirm("هل أنت متأكد من حذف هذه المحادثة؟")) {
    chats = chats.filter((c) => c.id !== chatId);
    saveChats();
    if (currentChatId === chatId) {
      if (chats.length > 0) {
        currentChatId = chats[0].id;
      } else {
        createNewChat();
        return;
      }
    }
    renderSidebar();
    renderChat();
  }
}

function renderSidebar() {
  chatHistoryList.innerHTML = "";
  chats.forEach((chat) => {
    const li = document.createElement("li");
    li.className = `chat-item ${chat.id === currentChatId ? "active" : ""}`;

    const titleSpan = document.createElement("span");
    titleSpan.className = "chat-item-title";
    titleSpan.textContent = chat.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-chat-btn";
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteBtn.title = "حذف المحادثة";
    deleteBtn.onclick = (e) => deleteChat(chat.id, e);

    li.appendChild(titleSpan);
    li.appendChild(deleteBtn);

    li.onclick = () => {
      currentChatId = chat.id;
      renderSidebar();
      renderChat();
      if (window.innerWidth <= 768) sidebar.classList.add("closed");
    };

    chatHistoryList.appendChild(li);
  });
}

function renderChat() {
  chatDisplay.innerHTML = "";
  const currentChat = chats.find((c) => c.id === currentChatId);
  if (!currentChat) return;

  currentChat.messages.forEach((msg) => {
    const div = document.createElement("div");
    div.className = `message ${msg.sender === "user" ? "user-message" : "ai-message"}`;
    const icon = msg.sender === "user" ? "fa-user" : "fa-robot";
    const content =
      msg.sender === "ai" && window.marked ? marked.parse(msg.text) : msg.text;
    div.innerHTML = `<div class="avatar"><i class="fa-solid ${icon}"></i></div><div class="text">${content}</div>`;
    chatDisplay.appendChild(div);
  });

  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

// ============================================
// 🎯 الدالة الجديدة: تنظيف الرد من الكلام الزائد
// ============================================
function cleanResponse(text) {
  if (!text) return text;

  let cleaned = text;

  // حذف أي شرح عن المستخدم
  cleaned = cleaned.replace(/المستخدم قال.*?[.!?]\s*/gi, "");
  cleaned = cleaned.replace(/المستخدم.*?[.!?]\s*/gi, "");
  cleaned = cleaned.replace(/User said.*?[.!?]\s*/gi, "");
  cleaned = cleaned.replace(/The user.*?[.!?]\s*/gi, "");

  // حذف التفكير والشرح
  cleaned = cleaned.replace(/I should.*?[.!?]\s*/gi, "");
  cleaned = cleaned.replace(/I need to.*?[.!?]\s*/gi, "");
  cleaned = cleaned.replace(/I will.*?[.!?]\s*/gi, "");
  cleaned = cleaned.replace(/respond with.*?[.!?]\s*/gi, "");
  cleaned = cleaned.replace(/following.*?[.!?]\s*/gi, "");
  cleaned = cleaned.replace(/rules[.!?]\s*/gi, "");

  // حذف الكلمات الزائدة بالإنجليزية
  cleaned = cleaned.replace(/^[A-Za-z\s\(\)"]+[.!?]\s*/g, "");

  // إذا وجد نص عربي، خذ من بداية النص العربي
  const arabicMatch = cleaned.match(/[\u0600-\u06FF][\s\S]*$/);
  if (arabicMatch) {
    cleaned = arabicMatch[0];
  }

  // تنظيف إضافي
  cleaned = cleaned.trim();
  cleaned = cleaned.replace(/^\s*[-•*]\s*/g, ""); // حذف النقاط في البداية

  return cleaned || text; // إذا أصبح فارغاً، عد النص الأصلي
}

// الاتصال بالـ API
async function getAIResponse(messages, retryCount = 0) {
  const maxRetries = 3;

  const formattedMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    })),
  ];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "MiniMaxAI/MiniMax-M2.7",
        messages: formattedMessages,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (
        (response.status === 429 || response.status >= 500) &&
        retryCount < maxRetries
      ) {
        const delay = Math.pow(2, retryCount) * 2000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return getAIResponse(messages, retryCount + 1);
      }

      if (response.status === 401) throw new Error("مفتاح API غير صالح");
      if (response.status === 429) throw new Error("تم تجاوز حد الطلبات");
      if (response.status === 503) throw new Error("الخدمة غير متاحة مؤقتاً");
      throw new Error(`خطأ: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    if (error.name === "AbortError" && retryCount < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return getAIResponse(messages, retryCount + 1);
    }
    if (error.message.includes("Failed to fetch") && retryCount < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return getAIResponse(messages, retryCount + 1);
    }
    throw error;
  }
}

// إرسال الرسالة
chatForm.onsubmit = async (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  if (!currentChatId) createNewChat();
  const currentChat = chats.find((c) => c.id === currentChatId);

  currentChat.messages.push({ sender: "user", text });
  if (currentChat.messages.length === 2) {
    currentChat.title = text.substring(0, 30) + "...";
  }

  userInput.value = "";
  sendBtn.disabled = true;
  sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
  renderChat();
  saveChats();

  const loading = document.createElement("div");
  loading.className = "message ai-message";
  loading.innerHTML = `
    <div class="avatar"><i class="fa-solid fa-robot"></i></div>
    <div class="text">
      <div class="typing-indicator">
        <span></span><span></span><span></span>
      </div>
    </div>`;
  chatDisplay.appendChild(loading);

  try {
    const aiResponse = await getAIResponse(currentChat.messages);
    // تنظيف الرد من الكلام الزائد
    const cleanedResponse = cleanResponse(aiResponse);

    chatDisplay.removeChild(loading);
    currentChat.messages.push({ sender: "ai", text: cleanedResponse });
    saveChats();
    renderChat();
  } catch (error) {
    chatDisplay.removeChild(loading);
    currentChat.messages.push({
      sender: "ai",
      text: `⚠️ ${error.message}\n\n💡 يمكنك المحاولة مرة أخرى.`,
    });
    saveChats();
    renderChat();
  } finally {
    sendBtn.disabled = false;
    sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
    userInput.focus();
  }
};

userInput.onkeydown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    chatForm.dispatchEvent(new Event("submit"));
  }
};

newChatBtn.onclick = createNewChat;

if (chats.length === 0) createNewChat();
else {
  currentChatId = chats[0].id;
  renderSidebar();
  renderChat();
}
