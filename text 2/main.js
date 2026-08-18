
let currentUser = {};

function user() {
  let name = prompt("Enter your name:");

  console.log("Hello, " + name);

  let age = prompt("Enter your age:");

  console.log("You are " + age + " years old.");

  let email = prompt("Enter your email:");
  console.log("Your email is " + email);

  confirm(`Name: ${name}\nAge: ${age}\nEmail: ${email}`);

  currentUser = {
    name: name,
    age: age,
    email: email,
  };

  console.log("Current User:", currentUser);

  return currentUser;
}


function setupmodels() {
  
  let models = ["Gemini 3.5", "GPT-5.6", "Claude 3.5 Sonnet"];

 
  let modelNumber = prompt(
    "Choose AI Model:\n" +
      "1. Gemini 3.5\n" +
      "2. GPT-5.6\n" +
      "3. Claude 3.5 Sonnet\n\n" +
      "Enter model number:",
  );

  
  modelNumber = Number(modelNumber);

 
  let selectedModel = models[modelNumber - 1];

 
  if (!selectedModel) {
    alert("Invalid model number!");
    return;
  }

 
  confirm(`Selected Model: ${selectedModel}`);

 
  let temperature = Number(prompt("Enter Temperature:")).toFixed(1);

  
  let question = prompt("Enter your question:");

  question = question.trim();

  
  let fullPayload = {
    user: currentUser,
    model: selectedModel,
    temperature: temperature,
    question: question,
  };

 
  console.log("Full Payload:", fullPayload);

  return fullPayload;
}
