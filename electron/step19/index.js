"use strict"
const net = require('net')
window.$ = window.jQuery = require('jquery')
var host = $('#host'),
    port = $('#port'),
    alias = $('#alias'),
    message = $('#message'),
    messageBox = $('#messageBox'),
    sendBtn = $('#sendBtn');

var myAlias = null

var socket = new net.Socket()

var buffer = ''
	
socket.on('data', (data) => {
  buffer += data.toString()
  
  var value = null
  while (true) {
    var newLineIndex = buffer.indexOf('\n') 
    if ( newLineIndex < 0) 
      return; 
    
    value = buffer.substring(0, newLineIndex)
    buffer = buffer.substring(newLineIndex + 1)
    
    if (value.length > 0) 
	  break;
  }
  
 $('<li>').addClass(value.startsWith(myAlias) ? "me" : "him") //서버에서 받은 값이 내 별명으로 시작하면 "me"
     	  .html(value)
		  .appendTo(messageBox);  //<추가>
   
  messageBox.scrollTop(messageBox.prop('scrollHeight'));
})
  
socket.on('error', (error) => {
  alert(error.message)
})
 
$('#connectBtn').click(() => {
 socket.connect(parseInt(port.val()), host.val(), () => {
    socket.write(alias.val() + '\n')
    myAlias = '[' + alias.val()  //<추가> 클라이언트 별명을 보관 ']'를 붙이면 ip주소와야 하기 때문에 오류. 지워야 함
   //myAlias =  alias.val()
  })
})
  
sendBtn.click(() => {
  //socket.write(JSON.stringify(obj) + '\n')
  //socket.end()
  socket.write(message.val() + '\n')  //엔터값이 들어가면 빈걸로 인식
  message.val('') //send버튼 누르면 입력창 비우기
})

  
message.keyup((e) => {
	if (e.keyCode == 0x0d) {
		var text = message.val().replace('\r', '').replace('\n',''); //\r과 \n을 제외
		message.val(text)
		//console.log('okok')
		sendBtn.click()  //sendBtn 'click' 이벤트를 발생시키는 것일 뿐.
	}
})

//https://stackoverflow.com/questions/42256877/how-to-create-chat-bubbles-like-facebook-messenger
//http://webcache.googleusercontent.com/search?q=cache:yYfHmB-EgcsJ:a07274.tistory.com/attachment/cfile8.uf%401542EA264BAB5A0302AB8B.doc+&cd=1&hl=ko&ct=clnk&gl=kr
