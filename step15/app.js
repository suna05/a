/*Express 프레임 워크 적용
=> 테스트 방법 : test.html을 웹 브라우저로 로딩하여 확인하라!
*/

var express = require('express')
var bodyParser = require('body-parser')
var cons = require('consolidate')//엔진에 상관없이 사용자가 단일하게 사용할 수 있도록 해줌. 더 필요한 기능은 추가하여서.
var path = require('path')
//var handlebars = require('handlebars')

var app =express()
app.use(express.static('public')) //클라이언트가 요청할 때 던져줄 폴더(위치) 지정. 여러 곳 지정가능
app.use(bodyParser.urlencoded({extended: false})) //POST요청 시 데이터를 꺼낼 수 있음

app.engine('hbs', cons.handlebars) //템플릿 엔진을 등록, 핸들바가 등록되어 있으면 리턴해줌
app.set('view engine', 'hbs') //등록된 템플릿 엔진 중에서 express에서 html을 출력할 때 사용할 엔진을 지정
app.set('views', path.join(__dirname , '/views')) //템플릿 파일이 있는 위치 지정, 폴더 경로를 줌

//서비스 라우터 등록, /student로 들어오는 요청을 ./control/student-control 라우터한테 물어보고, 있으면 반환
app.use('/student', require('./control/student-control'))
app.use('/teacher', require('./control/teacher-control'))
app.use('/manager', require('./control/manager-control'))
app.use('/lecture', require('./control/lecture-control'))

app.get('/', function(request, response) {  //루트라는 요청이 들어오면 함수 실행
  response.render('index')  //템플릿 엔진 출력, index.html이라는 파일을 views폴더 내에서 찾음
})

app.listen(8888, function() {
  console.log('서버가 시작되었습니다.')
})
