const express = require('express')
const datasource = require('../util/datasource')
const memberDao = require('../dao/member-dao')
const teacherDao = require('../dao/teacher-dao')
const connection = datasource.getConnection()
const teacherService = require('../service/teacher-service')

teacherDao.setConnection(connection)
memberDao.setConnection(connection)
teacherService.setMemberDao(memberDao)
teacherService.setTeacherDao(teacherDao)

const router = express.Router()

router.get('/list.do', (request, response) => {
  var pageNo = 1,
      pageSize = 3;
  if (request.query.pageNo) {
    pageNo = parseInt(request.query.pageNo)
  }
  if (request.query.pageSize) {  //객체.객체.객체 => 원하는 값 출력하기 위해서 사용 (OGNL)
    pageSize = parseInt(request.query.pageSize)
  }
  teacherService.list(pageNo, pageSize, function(results, totalCount) {
    var lastPageNo =  parseInt(totalCount/pageSize) + (((totalCount % pageSize) > 0) ? 1: 0)
    response.render('teacher/index', {
      'data' : results,
      'pageNo' : pageNo,
      'nextPageNo': pageNo + 1,
      'prevPageNo': pageNo - 1,
      'disabledPrevBtn': (pageNo == 1) ? 'disabled' : '' ,
      'disabledNextBtn' : (pageNo == lastPageNo) ? 'disabled' : ''
    })
  }, function(error) {
    response.render('error', {
      'message' : '강사 목록 데이터 로딩 중 오류 발생.'})
    throw error;
  })
})


router.get('/detail.do', function(request, response) {
  var no = parseInt(request.query.no)
  teacherService.detail(no, function(result) {
    response.render('teacher/view', {
      'detail': true,
      'data' : result
    })
  }, function(error) {
    response.render('error', {
      'message' : '강사 데이터를 가더오던 중 오류 발생.'})
    console.log(error)
  })
})

router.post('/update.do', function(request, response) {
  teacherService.update({
    no: request.body.no,
    name: request.body.name,
    tel: request.body.tel,
    email: request.body.email,
    password: '1111',
    homepage: request.body.homepage,
    facebook: request.body.facebook,
    twitter: request.body.twitter
  }, function(result) {
    response.redirect('list.do')
  }, function(error) {
    response.render('error', {
      'message' : '강사 데이터 변경 중 오류 발생'})
  console.log(error)
  })
})
router.get('/delete.do', function(request, response) {
  var no = parseInt(request.query.no)
  teacherService.delete(no, function(result) {
    response.redirect('list.do')
  },
  function(error) {
    response.render('error', {
      'message' : '강사 데이터 삭제 중 오류 발생'})
      console.log(error)
    })
  })

router.get('/form.do', function(request, response) {
  response.render('teacher/view')
})

router.post('/add.do', function(request, response) {
  teacherService.insert({
    name: request.body.name,
    tel: request.body.tel,
    email: request.body.email,
    password: '1111',
    hmpg: request.body.hmpg,
    fcbk: request.body.fcbk,
    twitter: request.body.twitter
  }, function(result) {
    response.redirect('list.do')
  }, function(error) {
    response.render('error', {
      'message' : '강사 데이터 등록 중 오류 발생'})
    console.log(error)
  })
})


module.exports = router
