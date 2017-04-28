//학생 정보를 다루는 서비스를 정의한다.
const express = require('express')
const datasource = require('../util/datasource')
const memberDao = require('../dao/member-dao')
const managerDao = require('../dao/manager-dao')
const managerService = require('../service/manager-service')
const connection = datasource.getConnection()

memberDao.setConnection(connection)
managerDao.setConnection(connection)

managerService.setMemberDao(memberDao)
managerService.setManagerDao(managerDao)


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
  managerService.list(pageNo, pageSize, function(results, totalCount) {
    var lastPageNo =  parseInt(totalCount/pageSize) + (((totalCount % pageSize) > 0) ? 1: 0)
    //response.setHeader('Content-Type', 'text/html;charset=UTF-8')
    response.render('manager/index', {
      'data': results,
      'pageNo': pageNo,
      'nextPageNo': pageNo + 1,
      'prevPageNo': pageNo - 1,
      'disabledPrevBtn': (pageNo == 1) ? 'disabled' : '' ,
      'disabledNextBtn' : (pageNo == lastPageNo) ? 'disabled' : ''
    })  //handlebars, 이름:값
  }, function(error) {
    response.render('error', {
      'message' : '매니저 목록 데이터 로딩 중 오류 발생.'})
    throw error;
  })
})

router.get('/detail.do', function(request, response) {
  var no = parseInt(request.query.no)
  managerService.detail(no, function(result) {
    response.render('manager/view', {
      'detail': true,
      'data': result
  })
  }, function(error) {
    response.render('error', {
      'message' : '매니저 데이터를 가더오던 중 오류 발생.'})
    console.log(error)
  })
})


router.post('/update.do', function(request, response) {
  managerService.update({
    no: request.body.no,
    posi: request.body.position,
    name: request.body.name,
    tel: request.body.tel,
    email: request.body.email,
    password: '1111',
    fax: request.body.fax,
    path: request.body.path
  }, function(result) {
    response.redirect('list.do')
  }, function(error) {
    response.render('error', {
      'message' : '매니저 데이터 변경 중 오류 발생'})
  console.log(error)
  })
  //response.setHeader('Content-Type', 'text/html;charset=UTF-8')
  // response.redirect('list.do')
})

router.get('/delete.do', function(request, response) {
  var no = parseInt(request.query.no)
  managerService.delete(no, function(result) {
    response.redirect('list.do')
  },
  function(error) {
    response.render('error', {
      'message' : '매니저 데이터 삭제 중 오류 발생'})
    console.log(error)
  })
})

router.get('/form.do', function(request, response) {
  response.render('manager/view')
})

router.post('/add.do', function(request, response) {
  managerService.insert({
    posi: request.body.position,
    name: request.body.name,
    tel: request.body.tel,
    email: request.body.email,
    password: '1111',
    fax: request.body.fax,
    path: request.body.path
  }, function(result) {
    response.redirect('list.do')
  }, function(error) {
    response.render('error', {
      'message' : '매니저 데이터 등록 중 오류 발생'})
    console.log(error)
  })
})


module.exports = router
