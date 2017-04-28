var pageNoTag = $('#page-no'),
    tbody = $('#student-tbl > tbody'),
    prevBtn = $('#prev-btn'),
    nextBtn = $('#next-btn'),
    pageSize = 4;

// var currPageNo = parseInt($('#page-no').text())

var currPageNo = parseInt(pageNoTag.text())
//함수 실행
displayList(1) //호이스팅

function displayList(pageNo) {  //함수 정의
  $.getJSON('list.json', {'pageNo': pageNo, 'pageSize': pageSize}, function(result) {
    var list = result.list
    var totalCount = result.totalCount
    var lastPageNo = parseInt(totalCount / pageSize) + (totalCount % pageSize > 0 ? 1 : 0)

    //템플릿 소스를 가지고 템플릿을 처리할 함수를 얻는다.
    var templateFn = Handlebars.compile($('#tbody-template').text())  //index.html에 있는 {{#each list}를 text로 받아서 리턴
    var generatedHTML = templateFn(result) //템플릿 함수에 데이터를 넣고  HTMl을 생성
    tbody.text('') //tbody의 기존 tr태그들을 지우고
    tbody.html(generatedHTML)  //새 tr태그들로 설정한다.

    currPageNo = pageNo
    pageNoTag.text(currPageNo) //출력

    if(currPageNo == 1) {
      prevBtn.prop('disabled', true)
    } else {
      prevBtn.prop('disabled', false)
    }

    if(currPageNo == lastPageNo) {
      nextBtn.prop('disabled', true)
    } else {
      nextBtn.prop('disabled', false)
    }
  }) //getJSON()
}//displayList()

prevBtn.click(function() {
//$('#prev-btn').click(function() {
  //var currPageNo = parseInt(pageNoTag.text())  //currPageNo = pageNo를 설정해줘서 필요없음
  displayList(currPageNo - 1)
})
nextBtn.click(function() {
//$('#next-btn').click(function() {
  //var currPageNo = parseInt(pageNoTag.text())
  displayList(currPageNo + 1)
})
