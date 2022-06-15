//로그인 임시방편
let username = prompt("아이디를 입력하세요");
let roomNum = prompt("채팅방 번호를 입력하세요");

document.querySelector("#roomNum").innerHTML = roomNum;

//SSE 연결하기
const eventSource = new EventSource(
  `http://localhost:8082/chat/roomNum/${roomNum}`
);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.sender === username) {
    //파란박스(오른쪽)
    initMyMessage(data);
  } else {
    //회색박스(왼쪽)
    initYourMessage(data);
  }
};
//파란박스(나)
function getSendMsgBox(data) {
  let md = data.createdAt.substring(5, 10);
  let tm = data.createdAt.substring(11, 16);
  let convertTime = tm + " | " + md;

  return `<div class="sent_msg">
            <p>${data.msg}</p>
            <span class="time_date"> ${convertTime} / <b>${data.sender}</b></span>
         </div>`;
}
//회색박스(상대)
function getReceiveMsgBox(data) {
  let md = data.createdAt.substring(5, 10);
  let tm = data.createdAt.substring(11, 16);
  let convertTime = tm + " | " + md;

  return `<div class="received_withd_msg">
              <p>${data.msg}</p>
              <span class="time_date"> ${convertTime} / <b>${data.sender}</b></span>
           </div>`;
}
//addMessage()함수 호출 시 DB에 insert 되고, 그 데이터가 자동으로 흘러들어온다.
//파란박스 초기화
function initMyMessage(data) {
  let chatBox = document.querySelector("#chat-box");

  let chatOutgoingBox = document.createElement("div");
  chatOutgoingBox.className = "outgoing_msg";
  chatOutgoingBox.innerHTML = getSendMsgBox(data);
  chatBox.append(chatOutgoingBox);

  //스크롤이 되도록 설정
  document.documentElement.scrollTop = document.body.scrollHeight;
}
//addMessage()함수 호출 시 DB에 insert 되고, 그 데이터가 자동으로 흘러들어온다.
//회색박스 초기화
function initYourMessage(data) {
  let chatBox = document.querySelector("#chat-box");

  let chatInComingBox = document.createElement("div");
  chatInComingBox.className = "incoming_msg";
  chatInComingBox.innerHTML = getReceiveMsgBox(data);
  chatBox.append(chatInComingBox);

  document.documentElement.scrollTop = document.body.scrollHeight;
}

//AJAX 채팅 메시지 전송
async function addMessage() {
  let msgInput = document.querySelector("#chat-outgoing-msg");

  let chat = {
    sender: username,
    roomNum: roomNum,
    msg: msgInput.value,
  };

  //비동기 처리를 할 때 진행을 block시키기 위해서 fetch를 할 때 await으로 lock을 건다.
  fetch("http://localhost:8082/chat", {
    method: "POST", //post로 새로운 데이터 write
    body: JSON.stringify(chat), //JS-Object -> JSON
    headers: {
      "Content-type": "application/json;charset=utf-8",
    },
  });
  //fetch만하고 response를 담을 필요가 없다.
  //   let response = await fetch("http://localhost:8082/chat", {
  //     method: "POST", //post로 새로운 데이터 write
  //     body: JSON.stringify(chat), //JS-Object -> JSON
  //     headers: {
  //       "Content-type": "application/json;charset=utf-8",
  //     },
  //   });

  //   console.log(response);

  //   let parseResponse = await response.json(response);

  msgInput.value = "";
}

//버튼 클릭시 메시지 전송
document.querySelector("#chat-send").addEventListener("click", () => {
  addMessage();
});

//엔터시 메시지 전송
document
  .querySelector("#chat-outgoing-msg")
  .addEventListener("keydown", (e) => {
    console.log(e.keyCode);
    if (e.keyCode === 13) {
      addMessage();
    }
  });
