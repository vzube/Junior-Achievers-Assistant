const chatInput = document.getElementById("chat-input");
const sendChatBtn = document.getElementById("send-btn");
const chatbox = document.querySelector(".chatbox");
const chatbot = document.querySelector(".chatbot");
const closeBtn = document.querySelector(".close-btn");
const settingsBar = document.querySelector(".settings-bar");
const settingsPanel = document.querySelector(".settings-panel");
const themeToggle = document.getElementById("theme-toggle");
const chatbotToggler = document.querySelector(".chatbot-toggler");

let userMessage;
let API_KEY = "";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
  // Create a chat element with passed message and className
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<img src="https://www.jakenya.org/img/logo.png" alt="Chatbot Logo" class="chat-message-bot-img"> <p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const createTypingIndicator = () => {
  // Create a chat element for typing indicator
  const typingLi = document.createElement("li");
  typingLi.classList.add("chat", "incoming", "typing");
  typingLi.innerHTML = "...";
  return typingLi;
};

const generateResponse = (incomingChatLi) => {
  // Simulate typing indicator before displaying response
  chatbox.appendChild(createTypingIndicator());
  chatbox.scrollTo(0, chatbox.scrollHeight);

  // Replace typing indicator with actual response after a delay
  setTimeout(() => {
    const API_URL = "http://127.0.0.1:8000/chatbot_response";
    const messageElement = incomingChatLi.querySelector("p");

    // Send Post request to API, get response
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: "test_user",
        message: userMessage,
      }),
    };

    fetch(API_URL, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        // Concatenate all messages into one string
        const concatenatedMessage = data
          .map((item) => item.text || item.image)
          .join('\n');

        // Set the messageElement's text content to the concatenated message
        messageElement.textContent = concatenatedMessage;

        console.log(data);
      })
      .catch((err) => {
        messageElement.classList.add("error");
        console.log("err", err);
        messageElement.textContent =
          "Oops! Something went wrong. Please try again later.";
      })
      .finally(() => {
        // Remove typing indicator after the response is displayed
        chatbox.removeChild(document.querySelector(".typing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);
      });
  }, 1000); // Set the delay to 1 second for a more realistic typing effect
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = "";
  chatInput.style.height = inputInitHeight + "px";

  // Append the user's message to the chatbox
  const outgoingChatLi = createChatLi(userMessage, "outgoing");
  chatbox.appendChild(outgoingChatLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);

  // Display "..." message while waiting for the response
  const incomingChatLi = createChatLi("Thinking...", "incoming");
  chatbox.appendChild(incomingChatLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);

  generateResponse(incomingChatLi);
};

// Auto-resize textarea on input
chatInput.addEventListener("input", () => {
  chatInput.style.height = inputInitHeight + "px";
  chatInput.style.height = chatInput.scrollHeight + "px";
});

// Send message on button click or Enter key press
sendChatBtn.addEventListener("click", handleChat);
chatInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    handleChat();
  }
});

// Close chatbot on close button click
closeBtn.addEventListener("click", () => chatbot.classList.remove("show-chatbot"));

// Theme Toggle functionality
themeToggle.addEventListener("change", (e) => {
  const selectedTheme = e.target.checked ? "dark" : "light";
  document.body.classList.remove("light", "dark");
  document.body.classList.add(selectedTheme);

  // Update chat elements based on the theme
  updateChatTheme(selectedTheme);
});

// Update chat elements based on theme  when page loads
const updateChatTheme = (theme) => {
  const chatMessages = document.querySelectorAll(".chat p");
  const chatHeader = document.querySelector(".chatbot header");
  const settingsBar = document.querySelector(".settings-bar");

  for (const message of chatMessages) {
    message.style.backgroundColor =
      theme === "light" ? "#e3f2fd" : "#f2f2f2";
    message.style.color = theme === "light" ? "#03a9f4" : "#007bff";
  }

  chatHeader.style.backgroundColor =
    theme === "light" ? "#03a9f4" : "#333";
  chatHeader.style.color = theme === "light" ? "#fff" : "#fff";
  settingsBar.style.backgroundColor =
    theme === "light" ? "#eee" : "#444";
};

settingsBar.addEventListener("click", () => {
  if (settingsPanel.classList.contains("active")) {
    hideSettingsPanel();
  } else {
    showSettingsPanel();
  }
});

function showSettingsPanel() {
  settingsPanel.classList.add("active");
}

function hideSettingsPanel() {
  settingsPanel.classList.remove("active");
}

// Chatbot opening functionality
chatbotToggler.addEventListener("click", () => {
  chatbot.classList.toggle("show-chatbot");
});

// Accessibility: Keyboard navigation for opening/closing chatbot (add this functionality)
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !event.ctrlKey && !event.altKey && !event.shiftKey) {
    event.preventDefault();
    chatbot.classList.toggle("show-chatbot");
  }
});

// Add a chatbot idle message after a delay
setInterval(() => {
  if (chatbot.classList.contains("show-chatbot") && chatbox.lastChild.classList.contains("outgoing")) {
    const idleMessage = createChatLi("Just letting you know, I'm here to help! 😊", "incoming");
    chatbox.appendChild(idleMessage);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    setTimeout(() => chatbox.removeChild(idleMessage), 8000);
  }
}, 300000); // Display an idle message every 5 minutes