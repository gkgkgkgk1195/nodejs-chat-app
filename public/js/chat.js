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
const $myMessages = document.querySelector("#myMessages");
const $isTyping = document.querySelector("#typing").innerHTML;

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML;
const sentMessageTemplate = document.querySelector("#message-template-sent").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

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
  const scrollOffset = $messages.scrollTop + visibleHeight;

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

  if(message.username === username){
    const html = Mustache.render(sentMessageTemplate, {
      username: message.username,
      message: message.text,
      createdAt: moment(message.createdAt).format("h:mm a")
    });

    $messages.insertAdjacentHTML("beforeend", html);
  } else{
    $messages.insertAdjacentHTML("beforeend", html);
    fetch('/broadcast', {
      body: JSON.stringify({title: `Payment received Successfully`, body: `${message.username}: ${message.text}`}),
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
    });
  }
  autoscroll();
});

socket.on("locationMessage", message => {
  const html = Mustache.render(locationMessageTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format("h:mm a")
  });

  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });

  document.querySelector("#sidebar").innerHTML = html;
});

$messageForm.addEventListener("submit", e => {
  e.preventDefault();

  $messageFormButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;

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
