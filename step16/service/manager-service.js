"use strict"

module.exports = {
  setManagerDao(dao){
    this.managerDao = dao
  },

  setMemberDao(dao){
    this.memberDao = dao
  },

  listName(success, error) {
    this.managerDao.selectNameList(success, error)
  }, //listName()

  list(pageNo, pageSize, success, error) {
    var obj = this
    this.managerDao.selectList(pageNo, pageSize, function(managers) {
      obj.managerDao.countAll(function(results) {
        success(managers, results[0].cnt)
      }, error) // countAll()
    }, error) // selectList()
  }, // list()
  detail(no, success, error) {
    this.managerDao.selectOne(no, success, error)
  },
  insert(manager, success, error) {
    var obj = this
    this.memberDao.insert(manager, function(result) {
      manager.no = result.insertId
      obj.managerDao.insert(manager, success, error)
    }, error)
  },
  update(manager, success, error) {
    var obj = this
    this.memberDao.update(manager, function(result) {
      obj.managerDao.update(manager, success, error)
    }, error)
  },
  delete(no, success, error) {
    var obj = this
    this.managerDao.delete(no, function(result){
      obj.memberDao.delete(no, success, error)
    }, error)
  }
} // createStudentService()
