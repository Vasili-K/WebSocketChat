const status = document.querySelector(".status");
const userName = document.querySelector(".name");
const changeNameButton = document.querySelector(".change_name");
const messagesCotainer = document.querySelector("#messages");
const currentMessage = document.querySelector("#input");
const sendButton = document.querySelector(".send");
const feedback = document.querySelector(".feedback");
const max = 1;
const min = 7;
const colorArray = [
  "green",
  "orange",
  "grey",
  "violet",
  "yellow",
  "blue",
  "red",
];
let randomColor = Math.floor(Math.random() * (max - min) + min);

const socket = io.connect("http://localhost:3000");

setStatus("online");

function setStatus(value) {
  status.innerHTML = value;
}

sendButton.onclick = function () {
  socket.emit("send_message", {
    mess: currentMessage.value,
    usName: userName.value || "Anonimous",
    color: randomColor,
  });
  currentMessage.value = "";
};

socket.on("send_message", () => {
  feedback.innerHTML = "";
});

socket.on("add_message", (data) => {
  let li = document.createElement("li");
  li.classList.add(colorArray[data.color]);
  li.innerHTML = `${data.usName}: ${data.mess}`;
  messagesCotainer.appendChild(li);
  feedback.innerHTML = "";
});

changeNameButton.onclick = function () {
  userName.value = "";
};

currentMessage.onkeypress = (event) => {
  socket.emit("typing", { usName: userName.value || "Anonimous" });

  if (event.keyCode === 13) {
    socket.emit("send_message", {
      mess: currentMessage.value,
      usName: userName.value || "Anonimous",
      color: randomColor,
    });
    currentMessage.value = "";
  }
};

socket.on("typing", (data) => {
  feedback.textContent = `${data.usName} is typing ...`;
});
