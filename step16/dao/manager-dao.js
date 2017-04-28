"use strict"

module.exports = {
  setConnection(con) {
    this.connection = con
  },


/*
'select mr.mrno, m.name
from mgr mr inner join memb m on mr.mrno=m.mno
order by m.name asc
*/

  selectNameList(successFn, errorFn) {
    this.connection.query(
      'select mr.mrno, m.name\
      from mgr mr inner join memb m on mr.mrno=m.mno\
      order by m.name asc',
    function(error, results) {
      if (error) {
        errorFn(error)
      } else {
      successFn(results)
      }
    }) // connection.query()
  },//selectNameList()


  selectList(pageNo, pageSize, successFn, errorFn) {   //방법 javascript01\step05-\test22.js 확인
    this.connection.query(
      'select m.mno, m.name, m.tel, m.email, mr.posi, mr.fax, mr.path \
      from mgr mr inner join memb m on mr.mrno=m.mno  \
      order by m.name asc  \
      limit ?, ?',
      [(pageNo-1) * pageSize, pageSize] ,                   //?,? 자리에는 [(pageNo-1) * 3, 3] 이게 들어감
    function(error, results) {
      if (error) {
        errorFn(error)                    // 실패했을 경우의 함수, 성공했을 경우의 함수만 써줌
      } else {
      successFn(results)
      }
    }) // connection.query()
  }, //selectListStudent()

  countAll(successFn, errorFn) {
    this.connection.query(
      'select count(*) cnt from mgr',
    function(error, results) {
      if (error) {
        errorFn(error)
      } else {
        successFn(results)
      }
    }) //connection.query()
  }, //countAllStudent()

  selectOne(no, successFn, errorFn) {
    this.connection.query(
      'select m.mno, m.name, m.tel, m.email, mr.posi, mr.fax, mr.path \
      from mgr mr inner join memb m on mr.mrno=m.mno \
      where mr.mrno =?',
      [no],
    function(error, results) {
      if(error){
        errorFn(error)
      } else {
        successFn(results[0])
      }
    }) //connection.query()
  },//selectOneStudent()

  insert(manager, successFn, errorFn){
    this.connection.query(
      'insert into mgr(mrno, posi, fax, path) values(?, ?, ?, ?)',
      [manager.no, manager.posi, manager.fax, manager.path],
    function(error, results) {
      if (error) {
        errorFn(error)
      } else {
        successFn(results)
      }
    })//connection.query()
  }, //insertStudent()

  update(manager, successFn, errorFn) {
    this.connection.query(
      'update mgr set posi=?, fax=?, path=? where mrno=?',
      [manager.posi, manager.fax, manager.path, manager.no],
    function(error, results) {
      if (error) {
        errorFn(error)
      } else {
        successFn(results)
      }
    })//connection.query()
  },//updateStudent()

  delete(no, successFn, errorFn) {
    this.connection.query(
      'delete from mgr where mrno=?',
      [no],
    function(error, results) {
      if (error) {
        errorFn(error)
      } else {
        successFn(results)
      }
    })//connection.query()
  }//deleteStudent()

}// createStudentDao()
