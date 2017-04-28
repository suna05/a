var viewTags = $('.bit-view'),
    newTags = $('.bit-new'),
    fiNo = $('#fi-no'),
    fiEmail = $('#fi-email'),
    fiName = $('#fi-name'),
    fiTel = $('#fi-tel'),
    fiSchoolName = $('#fi-school-name'),
    fiWorking = $('#fi-working');

//console.log(location.href.split('?')[1].split('=')[1]) //?를 기준으로 자름, ?뒤에것 뽑기[1], =로 잘라, 숫자만 남겨

//var no = location.href.split('?')[1].split('=')[1]

var no = 0
try {
  no = location.href.split('?')[1].split('=')[1]
} catch (err) {}

if(no == 0) { //새 학생 등록
  viewTags.css('display', 'none')

  $('#add-btn').click(function() {
    $.post('add.json', {
        'email': fiEmail.val(), //'email'이라는 이름으로 fiEmail값을 저장
        'name': fiName.val(),
        'tel': fiTel.val(),
        'schoolName': fiSchoolName.val(),
        'working': (fiWorking.prop('checked') ? 'Y' : 'N' )

    }, function(result) {  //add한다음에 성공했으면 리스트로 보낸다.
      location.href = 'index.html'  //정상적으로 추가가 되면 목록으로 이동
    }, 'json')
  })
} else { //학생 정보 조회
    newTags.css('display', 'none')
    $.getJSON('detail.json', {'no':no}, function(result) {
      fiNo.text(result.mno)
      fiEmail.val(result.email)
      fiName.val(result.name)
      fiTel.val(result.tel) //fiTel값을 resultdml tel값으로
      fiSchoolName.val(result.schl_nm) //schl_nm/데이터 베이스 컬럼명
      fiWorking.prop('checked', (result.work == 'Y' ? true : false))
  })

  $('#upd-btn').click(function() {
    $.post('update.json', {  // '/' 붙이면 안됨
        'no': fiNo.text(), //<p>태그이기 때문에
        'email': fiEmail.val(), //'email'이라는 이름으로 fiEmail값을 저장
        'name': fiName.val(),
        'tel': fiTel.val(),
        'schoolName': fiSchoolName.val(),
        'working': (fiWorking.prop('checked') ? 'Y' : 'N' )

    }, function(result) {  //add한다음에 성공했으면 리스트로 보낸다.
      location.href = 'index.html'  //정상적으로 추가가 되면 목록으로 이동
    }, 'json')
  })

  $('#del-btn').click(function() {
    $.getJSON('delete.json', {'no':no}, function(result) {
      location.href = 'index.html'
    })
  })
}












// viewTags.css('display', 'none')
//
// $('#add-btn').click(function() {
//   $.post('add.json', {
//       'email': fiEmail.val(), //'email'이라는 이름으로 fiEmail값을 저장
//       'name': fiName.val(),
//       'tel': fiTel.val(),
//       'schoolName': fiSchoolName.val(),
//       'working': (fiWorking.prop('checked') ? 'Y' : 'N' )
//
//   }, function(result) {  //add한다음에 성공했으면 리스트로 보낸다.
//     location.href = 'index.html'  //정상적으로 추가가 되면 목록으로 이동
//   }, 'json')
// })
