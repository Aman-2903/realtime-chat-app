const socket = io();
let name;
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");
let typingDiv = document.querySelector(".typing");
do {
  name = prompt("Please enter your name: ");
} while (!name);

textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
    return;
  }
  socket.emit("typing", {
    name,
  });
});

function sendMessage(message) {
  let msg = {
    user: name,
    message: message.trim(),
  };
  // Append
  appendMessage(msg, "outgoing");
  textarea.value = "";
  scrollToBottom();

  // Send to server
  socket.emit("message", msg);
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message");

  let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `;
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

// Recieve messages
socket.on("message", (msg) => {
  appendMessage(msg, "incoming");
  scrollToBottom();
});

let timerId = null;
function debounce(func, timer) {
  if (timerId) {
    clearTimeout(timerId);
  }

  timerId = setTimeout(() => {
    func();
  }, timer);
}

socket.on("typing", ({ name }) => {
  let markup = `<div>${name} is typing ...</div>`;
  typingDiv.innerHTML = markup;
  debounce(() => {
    typingDiv.innerHTML = "";
  }, 500);
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}
