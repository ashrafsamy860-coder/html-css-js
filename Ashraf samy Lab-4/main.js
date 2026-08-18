لا// الحصول علي عناصر html من خلال id بتاع كل عنصر علشان نقدر نتحكم فيه
const form = document.querySelector("#promptForm");
const input = document.querySelector("#inputText");
const output = document.querySelector("#outputContainer");

const model = document.querySelector("#modelSelect");
const inputType = document.querySelector("#inputType");
const temp = document.querySelector("#temperature");
const reasoning = document.querySelector("#highReasoning");
const webSearch = document.querySelector("#webSearch");

const submitButton = document.querySelector("#submitButton");


/*
  هنا بنقول للجافا سكريبت اعملي عنصر جديد من نوع span
  وحطي فيه القيمة الموجودة في ال slider
  وبعدين حطي الـ span قبل الـ slider
  علشان القيمة تظهر جنب الـ slider
  وبعد كده بنعمل event listener علي الـ slider
  بحيث كل ما المستخدم يحرك الـ slider
  القيمة اللي جنب الـ slider تتغير معاه
*/
const tempValue = document.createElement("span");

tempValue.textContent = temp.value;

temp.parentNode.insertBefore(tempValue, temp);

temp.addEventListener("input", () => {
  tempValue.textContent = temp.value;
});


// هنا بنحدد رابط الـ API ومفتاح الـ API والموديل اللي هنستخدمه
const API_URL = "https://inference.dahl.global/v1/chat/completions";
const API_KEY = "YOUR_API_KEY";
const AI_MODEL = "moonshotai/Kimi-K2.6";


// هنا بنقول لما المستخدم يعمل submit للفورم نفذ الكود اللي جوه
form.addEventListener("submit", async (e) => {

  // منع الصفحة من عمل refresh لما المستخدم يعمل submit
  e.preventDefault();


  // هنا بناخد النص اللي المستخدم كتبه في input
  // و trim بتشيل المسافات الزيادة من البداية والنهاية
  const text = input.value.trim();


  // هنا بنتأكد إن المستخدم كتب حاجة
  // لو الـ input فاضي نظهر رسالة ونوقف الكود
  if (!text) {
    alert("Please enter a prompt");
    return;
  }


  // هنا بنحذف الـ placeholder من منطقة المحادثة لو موجود
  output.querySelector(".placeholder")?.remove();


  // هنا بنعمل div جديد علشان نحط فيه رسالة المستخدم
  const userMessage = document.createElement("div");

  // هنا بنضيف الـ classes علشان نقدر نتحكم في شكل الرسالة بالـ CSS
  userMessage.classList.add("message-bubble", "user-message");


  // هنا بنعمل paragraph جديد علشان نحط فيه نص المستخدم
  const userText = document.createElement("p");

  // هنا بنحط النص اللي المستخدم كتبه داخل الـ paragraph
  userText.textContent = text;


  // هنا بنعمل زرار Edit
  const edit = document.createElement("button");

  // هنا بنكتب كلمة Edit علي الزرار
  edit.textContent = "Edit";


  // هنا بنقول لما المستخدم يضغط علي Edit نفذ الكود ده
  edit.onclick = () => {

    // هنا بنفتح prompt علشان المستخدم يقدر يعدل الرسالة
    const newText = prompt("Edit message:", userText.textContent);


    // لو المستخدم كتب نص جديد
    // بنغير النص القديم بالنص الجديد
    if (newText?.trim()) {
      userText.textContent = newText;
    }
  };


  // هنا بنعمل زرار Delete
  const del = document.createElement("button");

  // هنا بنكتب كلمة Delete علي الزرار
  del.textContent = "Delete";


  // هنا بنقول لما المستخدم يضغط Delete
  // يتم حذف رسالة المستخدم
  del.onclick = () => {
    userMessage.remove();
  };


  // هنا بنحط النص وزرار Edit وزرار Delete داخل رسالة المستخدم
  userMessage.append(userText, edit, del);

  // هنا بنضيف رسالة المستخدم داخل منطقة المحادثة
  output.appendChild(userMessage);


  // هنا بنعمل رسالة جديدة خاصة بالـ AI
  const aiMessage = document.createElement("div");

  // هنا بنضيف classes علشان نقدر ننسق رسالة الـ AI بالـ CSS
  aiMessage.classList.add("message-bubble", "ai-message");


  // هنا بنعمل paragraph علشان نحط فيه رد الـ AI
  const aiText = document.createElement("p");


  // هنا بنعرض رسالة مؤقتة للمستخدم لحد ما الـ AI يرد
  aiText.textContent = "AI is thinking...";


  // هنا بنحط النص داخل رسالة الـ AI
  aiMessage.appendChild(aiText);

  // هنا بنضيف رسالة الـ AI لمنطقة المحادثة
  output.appendChild(aiMessage);


  // هنا بننزل لآخر رسالة في المحادثة
  output.scrollTop = output.scrollHeight;


  // هنا بنمسح الكلام من input بعد الإرسال
  input.value = "";

  // هنا بنرجع المؤشر للـ input علشان المستخدم يقدر يكتب تاني
  input.focus();


  // هنا بنقفل زرار Send أثناء انتظار رد الـ AI
  submitButton.disabled = true;

  // هنا بنغير اسم الزرار مؤقتا لـ Thinking
  submitButton.textContent = "Thinking...";


  try {

    // هنا بنبعت request للـ API باستخدام fetch
    const response = await fetch(API_URL, {

      // نوع الطلب POST لأننا بنبعت بيانات للـ API
      method: "POST",


      // هنا بنحدد نوع البيانات ونبعت الـ API Key
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },


      // هنا بنحدد البيانات اللي هنرسلها للـ API
      // JSON.stringify بتحول البيانات لصيغة JSON
      body: JSON.stringify({

        // هنا بنحدد الموديل اللي هيجاوب علي السؤال
        model: AI_MODEL,


        // هنا بنحدد إن الرسالة جاية من المستخدم
        messages: [
          {
            role: "user",

            // هنا بنبعت نص المستخدم للـ AI
            content: text,
          },
        ],
      }),
    });


    // هنا بنتأكد إن الـ API رجع response ناجح
    // لو حصل خطأ بنعمل Error
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }


    // هنا بنحول الـ response اللي رجع من الـ API إلي JSON
    const data = await response.json();


    // هنا بنطبع response في الـ console علشان نقدر نشوف البيانات اللي رجعت
    console.log("AI Response:", data);


    // هنا بنجيب نص إجابة الـ AI من الـ response
    // choices = الإجابات
    // [0] = أول إجابة
    // message = الرسالة
    // content = نص الإجابة
    const aiAnswer = data.choices?.[0]?.message?.content;


    // هنا بنتأكد إن الـ AI رجع إجابة
    if (!aiAnswer) {
      throw new Error("No AI response was returned.");
    }


    // هنا بنعرض إجابة الـ AI بدل رسالة AI is thinking
    aiText.textContent = aiAnswer;


    // هنا بننزل لآخر إجابة في المحادثة
    output.scrollTop = output.scrollHeight;


  } catch (error) {

    // هنا بنتعامل مع أي Error حصل أثناء الاتصال بالـ API
    console.error("API Error:", error);


    // هنا بنعرض رسالة خطأ للمستخدم
    aiText.textContent =
      "Sorry, something went wrong. Please check your internet connection or API key.";


    // هنا بنضيف class لرسالة الخطأ علشان نقدر ننسقها بالـ CSS
    aiMessage.classList.add("error-message");
  }


  // هنا بنفتح زرار Send مرة تانية بعد انتهاء الطلب
  submitButton.disabled = false;

  // هنا بنرجع اسم الزرار لـ Send
  submitButton.textContent = "Send";
});