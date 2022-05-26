


//====== query selector ==========
let user_name = document.querySelector('.chat .pane_right .container_head_pane_right .boder_name_user #input_user_name');
let input_yourname = document.querySelector('.chat .pane_right .container_head_pane_right .boder_name_user #input_name')
let butt_accept_name = document.querySelector('.chat .pane_right .container_head_pane_right .boder_name_user #butt_accept_name');
let add_user_onl = document.querySelector('.chat .pane_left .container_user')
let butt_send_mess = document.querySelector('.chat .pane_right .container_tools_iput .send')
let input_mess = document.querySelector('.chat .pane_right .container_tools_iput #input_chat')
let container_chat = document.querySelector('.chat .pane_right .container_content_chat')
let butt_disconnect = document.querySelector('.chat .pane_right .container_head_pane_right .boder_log_out')
let page_chat = document.querySelector('.chat')
let back_webchat_home = document.querySelector('.chat .pane_left .container_head_pane_left h1');
let image_user = document.querySelector('.chat .pane_right .container_head_pane_right .boder_img_user');
//====== socket client ==========
// const socket = io.connect('http://localhost:5000');

// socket.on('connect', function (data) {
//   socket.emit('join', 'hello server !!!')
// })



//============= set name user =========
butt_accept_name.addEventListener('click', setName);
var nameUser = ''
function setName() {
  const socket = io.connect(`http://localhost:7788`);
  socket.on('connect', function (data) {
    socket.emit('join', 'hello server !!!')
  })

  nameUser = input_yourname.value;
  if (nameUser.length != 0) {
    socket.emit('sendName', nameUser);
    socket.on('errUserName', () => {
      alert('ten cua ban bi trung !');
      window.location = `http://localhost:7788/chat`
    })
    user_name.innerHTML = nameUser;
    socket.on('imageUser',(idImage)=>{
      image_user.insertAdjacentHTML('beforeend',`<img src="./img/user_${idImage}.png" alt="" />`)
    })
  } else {
    alert('nhap lai your name !!!')
    window.location = `http://localhost:7788/chat`
  }
  butt_accept_name.removeEventListener('click', setName);
  input_yourname.style.display = 'none';
  butt_accept_name.style.display = 'none';
  butt_disconnect.style.display = 'flex'

  socket.on('sendName', function (listuser) {
    add_user_onl.innerHTML = '';
    listuser.forEach(element => {
      if (element.userName !== nameUser) {

        add_user_onl.insertAdjacentHTML('beforeend', ` <div class="user">
          <div class="border_img_user">
          <img src="./img/user_${element.idImageUser}.png" alt=""/>
          </div>
          <div class="border_name_user">
            <p>${element.userName}</p>
          </div>
        </div>`)
      }
    });
  })
  socket.on('Notification', function (notif) {
    container_chat.insertAdjacentHTML('beforeend',
      ` <section class="container_notification">
            <p id="content_notification">${notif}</p>
        </section>
      `)
    setTimeout(() => {
      let container_notif = document.querySelector('.chat .container_notification');
      container_chat.removeChild(container_notif);
    }, 3000);

  })


  //========= add content chat client ========
  input_mess.addEventListener('keypress', sendDataKey);
  function sendDataKey(event) {
    let mess = {
      user: nameUser,
      dataMess: input_mess.value
    }
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
      socket.emit('sendDataMess', mess)
      input_mess.value = ''
    }
  }

  butt_send_mess.addEventListener('click', sendData);
  function sendData() {
    let mess = {
      user: nameUser,
      dataMess: input_mess.value
    }
    socket.emit('sendDataMess', mess)
    input_mess.value = ''

  }

  socket.on('sendDataMess', function (data) {
    if (data.user === nameUser) {
      container_chat.insertAdjacentHTML('beforeend',
        `<div class="container_content_mess_user">
          <p>${data.dataMess}</p>
      </div>`)
    } else {
      container_chat.insertAdjacentHTML('beforeend',
        ` <div class="container_content_mess_client">
            <p id="name_client">${data.user}:</p>
             <p id="content_mess">${data.dataMess}</p>
          </div>`)
    }
  })


}
//======= disconnect server chat =======

butt_disconnect.addEventListener('click', disconnectServer);
function disconnectServer() {
  window.location = `http://localhost:7788`
}

// ======== back page home ========
back_webchat_home.addEventListener('click', backPageHome)
function backPageHome() {
  window.location = `http://localhost:7788`
}
