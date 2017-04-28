//학생 정보를 다루는 서비스를 정의한다.
const express = require('express')
const datasource = require('../util/datasource')
const studentDao = require('../dao/student-dao')
const memberDao = require('../dao/member-dao')
const studentService = require('../service/student-service')

const connection = datasource.getConnection()
studentDao.setConnection(connection)
memberDao.setConnection(connection)
studentService.setStudentDao(studentDao)
studentService.setMemberDao(memberDao)

//const router = express.Router()


const router = express.Router()
router.get('/list.do', (request, response) => {         // /student/list.do 에 대해서 요청이 들어오면 실행
  var pageNo = 1,
      pageSize = 3;
  if (request.query.pageNo) {
    pageNo = parseInt(request.query.pageNo)
  }
  if (request.query.pageSize) {  //객체.객체.객체 => 원하는 값 출력하기 위해서 사용 (OGNL)
    pageSize = parseInt(request.query.pageSize)
  }
  studentService.list(pageNo, pageSize, function(results, totalCount) {
    var lastPageNo =  parseInt(totalCount/pageSize) + (((totalCount % pageSize) > 0) ? 1: 0)
    //response.setHeader('Content-Type', 'text/html;charset=UTF-8')
    response.render('student/index', {
      'data': results,
      'pageNo': pageNo,
      'nextPageNo': pageNo + 1,
      'prevPageNo': pageNo - 1,
      'disabledPrevBtn': (pageNo == 1) ? 'disabled' : '' ,
      'disabledNextBtn' : (pageNo == lastPageNo) ? 'disabled' : ''
    })  //handlebars, 이름:값
  }, function(error) {
    response.render('error', {
      'message' : '학생 목록 데이터 로딩 중 오류 발생.'})
    throw error;
  })
})

router.get('/detail.do', function(request, response) {
  var no = parseInt(request.query.no)
  studentService.detail(no, function(result) {
    response.render('student/view', {
      'detail': true,
      'data': result,
    'checkedWorking' : (result.work == 'Y' ? 'checked' : '')
  })
  }, function(error) {
    response.render('error', {
      'message' : '학생 데이터를 가더오던 중 오류 발생.'})
    console.log(error)
  })
})


router.post('/update.do', function(request, response) {
  // console.log('no=', request.body.no + '\n' )
  // console.log('name=', request.body.name + '\n' )
  // console.log('email=', request.body.email +'\n' )
  // console.log('tel=', request.body.tel +'\n')
  // console.log('schoolName=', request.body.schoolName +'\n')
  // console.log('working=', request.body.working +'\n')

  studentService.update({
    no: request.body.no,
    working: (request.body.working == undefined ? 'N' : 'Y'),
    schoolName: request.body.schoolName,
    name: request.body.name,
    tel: request.body.tel,
    email: request.body.email,
    password: '1111'
  }, function(result) {
    response.redirect('list.do')
  }, function(error) {
    response.render('error', {
      'message' : '학생 데이터 변경 중 오류 발생'})
  console.log(error)
  })
  //response.setHeader('Content-Type', 'text/html;charset=UTF-8')
  // response.redirect('list.do')
})

router.get('/delete.do', function(request, response) {
  var no = parseInt(request.query.no)
  studentService.delete(no, function(result) {
    response.redirect('list.do')
  },
  function(error) {
    response.render('error', {
      'message' : '학생 데이터 삭제 중 오류 발생'})
    console.log(error)
  })
})

router.get('/form.do', function(request, response) {
  response.render('student/view')
})

router.post('/add.do', function(request, response) {
  studentService.insert({
    working: (request.body.working == undefined ? 'N' : 'Y'),
    schoolName: request.body.schoolName,
    name: request.body.name,
    tel: request.body.tel,
    email: request.body.email,
    password: '1111'
  }, function(result) {
    response.redirect('list.do')
  }, function(error) {
    response.render('error', {
      'message' : '학생 데이터 등록 중 오류 발생'})
    console.log(error)
  })
})







module.exports = router
