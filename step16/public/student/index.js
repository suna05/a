//서버에서 학생 목록 데이터를 받아온다.
// $.get('list.json', {'pageNo': 1, 'pageSize': 4}, function(result) {
//   // var obj = JSON.parse(result)  //'json'을 해주면 이렇게 변환해 줄 필요가 없다. 서버에서 알아서 json으로 인식해줌
//   console.log(result)
// }, 'json' ) //control에서 response.json(results)라고 해주면 여기에 'json' 생략해도 됨 =>application/json으로 인식
// //하지만 'Content-Type', 'text/plain;charset=UTF-8'와 같이 다른 형태로 줄 경우를 대비해서 'json'을 적어주는게 원칙


//'json'을 안쓰기 위해 getJSON 사용
// $.getJSON('list.json', {'pageNo': 1, 'pageSize': 4}, function(result) {
//   // var obj = JSON.parse(result)  //'json'을 해주면 이렇게 변환해 줄 필요가 없다. 서버에서 알아서 json으로 인식해줌
//   console.log(result)  //객체로 넘어옴
// })

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
    var list = result.list  //list에서  result라는 이름의 객체를 꺼냄
    var totalCount = result.totalCount
    var lastPageNo = parseInt(totalCount / pageSize) + (totalCount % pageSize > 0 ? 1 : 0)

    //append하기 전에 tbody에 텍스트 콘테츠 빈 배열로 만듦 - 이거 안하면 다음 페이지 넘길때 쭉 붙어서 출력
    //var tbody = $('#student-tbl > tbody')
    tbody.text('')

    for (var s of list) {
      $('<tr>').append($('<td>').text(s.mno))  //<tr>이 부모,,<td> <는 td태그를 만들어라
              .append($('<td>').append(
                $('<a>').attr('href', 'view.html?no=' + s.mno)
                        //.attr('data-no', s.mno)
                        .text(s.name == '' ? '(이름없음)' : s.name)))
              .append($('<td>').text(s.tel))
              .append($('<td>').text(s.email))
              .append($('<td>').text(s.work))
              //td태그를 tr태그에 append시켜야 함
              .appendTo(tbody)
    }

    //리스트 출력후
    //$('#page-no').text(pageNo)
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
