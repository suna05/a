/*Express 프레임 워크 적용 : AJAX 웹 프로그래밍 방식
=> 서버에서 기본 HTMl을 클라이언트로 보낸다.
=> 서버에서 데이터를 JSON 형식으로 만들어 클라이언트로 보낸다.

*/

var express = require('express')
var bodyParser = require('body-parser')
var cons = require('consolidate')//엔진에 상관없이 사용자가 단일하게 사용할 수 있도록 해줌. 더 필요한 기능은 추가하여서.
var path = require('path')
//var handlebars = require('handlebars')

var app =express()
app.use(express.static('public')) //클라이언트가 요청할 때 던져줄 폴더(위치) 지정. 여러 곳 지정가능
app.use(bodyParser.urlencoded({extended: false})) //POST요청 시 데이터를 꺼낼 수 있음

//서비스 라우터 등록, /student로 들어오는 요청을 ./control/student-control 라우터한테 물어보고, 있으면 반환
app.use('/student', require('./control/student-control'))
app.use('/teacher', require('./control/teacher-control'))
app.use('/manager', require('./control/manager-control'))
app.use('/lecture', require('./control/lecture-control'))


app.listen(8888, function() {
  console.log('서버가 시작되었습니다.')
})
