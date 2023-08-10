const socket = io();
var typing=false;
var timeout=undefined;
let typingTimeout=()=>{};
// Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = document.getElementById("messageInput");
const $messageFormButton = document.getElementById("sendMessage");
// const $sendLocationBtn = document.querySelector("#send-location");
const $clearChat = document.querySelector("#clear-chat");
const $messages = document.querySelector("#messages");
// const $myMessages = document.querySelector("#myMessages");
const $isTyping = document.querySelector("#typing").innerHTML;

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
// const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML;
const sentMessageTemplate = document.querySelector("#message-template-sent").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;
console.log("🚀 ~ file: chat.js:20 ~ sidebarTemplate:", sidebarTemplate)
const autoExpandTextarea = document.getElementById('messageInput');
const leaveChatButton = document.getElementById('leaveChat');

const toggleButton = document.getElementById('message-toggle-button');
const messagesContainer = $messages

let emojiDialog = document.getElementById("emojiDialog");
emojiDialog.style.display = "none"

console.log("🚀 ~ file: chat.js:31 ~ emojiDialog:", emojiDialog)
let openEmoji = document.getElementById("openEmoji");
console.log("🚀 ~ file: chat.js:33 ~ openEmoji:", openEmoji)

openEmoji.addEventListener('click', (event) => {
  console.log("🚀 ~ file: chat.js:36 ~ openEmoji.addEventListener ~ event:", event.target.id)
  if (event.target.id !== "openEmoji" && event.target.id !== "emojiID") {
    emojiDialog.style.display = "none";
  }})
  openEmoji.addEventListener('click', e =>{
    if (emojiDialog.style.display === "none") {
      emojiDialog.style.display = "block"
    } else {
      emojiDialog.style.display = "none"
    }
  })

  let emojiPicker = document.querySelector('emoji-picker');

  emojiPicker.addEventListener('emoji-click', event => {
    autoExpandTextarea.value += event.detail.unicode
  });
toggleButton.addEventListener('click', () => {
    messagesContainer.classList.toggle('hidden');
});

function adjustTextareaHeight() {
    autoExpandTextarea.style.height = 'auto';
    autoExpandTextarea.style.height = (autoExpandTextarea.scrollHeight) + 'px';
}

autoExpandTextarea.addEventListener('input', adjustTextareaHeight);
// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $messages.offsetHeight;

  // Height of messages container
  const containerHeight = $messages.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = Math.round($messages.scrollTop + visibleHeight);

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on("message", message => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a")
  });

  if(message.username.toLowerCase() === username.toLowerCase() && message.room === room ){
    const html = Mustache.render(sentMessageTemplate, {
      username: message.username,
      message: message.text,
      createdAt: moment(message.createdAt).format("h:mm a")
    });

    $messages.insertAdjacentHTML("beforeend", html);
  } else {
    $messages.insertAdjacentHTML("beforeend", html);
    fetch('/broadcast', {
      body: JSON.stringify({title: `${message.username.toUpperCase()}`, body: `${message.text}`}),
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
    });
  }
  autoscroll();
});

// socket.on("locationMessage", message => {
//   const html = Mustache.render(locationMessageTemplate, {
//     username: message.username,
//     url: message.url,
//     createdAt: moment(message.createdAt).format("h:mm a")
//   });

//   $messages.insertAdjacentHTML("beforeend", html);
// });

socket.on("roomData", ({ room, users }) => {
  console.log("🚀 ~ file: chat.js ~ line 93 ~ socket.on ~ room, users", room, users)
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });

  document.getElementById("discussion").innerHTML = html;
  const groupName = document.getElementById("groupName")
  groupName.textContent = room
});

$messageForm.addEventListener("submit", e => {
  console.log('event--', e.target.id)
  e.preventDefault();
  $messageFormButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.messageInput.value;
  if(message !== ""){
    socket.emit("sendMessage", message, error => {
      $messageFormButton.removeAttribute("disabled");
      $messageFormInput.value = "";
      $messageFormInput.focus();
  
      if (error) {
        return console.log(error);
      } else {
        console.log("Message delivered!");
      }
    });
  } else {
    $messageFormInput.focus();
    $messageFormButton.removeAttribute("disabled");
  }
});

// $sendLocationBtn.addEventListener("click", () => {
//   if (!navigator.geolocation) {
//     return alert("Geolocation is not supported by your browser.");
//   } else {
//     $sendLocationBtn.setAttribute("disabled", "disabled");

//     navigator.geolocation.getCurrentPosition(position => {
//       socket.emit(
//         "sendLocation",
//         {
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude
//         },
//         error => {
//           $sendLocationBtn.removeAttribute("disabled");
//           if (!error) {
//             console.log("Location shared!");
//           }
//         }
//       );
//     });
//   }
// });

$clearChat.addEventListener("click", () => {
  console.log('clear-chat--->>>')
 $messages.innerHTML = ''
});

  $messageFormInput.addEventListener("keypress", ((e)=>{
    if(e.which!=13){
      typing=true
      socket.emit('typing', {user:username, typing:true})
      clearTimeout(timeout)
      timeout=setTimeout(()=>{
        document.querySelector("#typing").innerHTML = '';
      }, 1000)
    }else{
      clearTimeout(timeout)
    }
  }));

  socket.on('display', (data)=>{
    if(data.typing==true){
      if(username !== data.user){
        document.querySelector("#typing").innerHTML = `${data.user} is typing...`;
        clearTimeout(timeout)
      timeout=setTimeout(()=>{
        document.querySelector("#typing").innerHTML = '';
      }, 1000)
      }
    }
    else
      document.querySelector("#typing").innerHTML = '';
  })

socket.emit("join", { username, room }, error => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

leaveChatButton.addEventListener('click', ()=>{
  location.href = "/";
})