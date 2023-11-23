const http = require('http');

http.createServer((req, res) => {
  console.log(req.url, req.headers.cookie); // 쿠키의 데이터 타입은 문자열
  // 응답 헤더에 작성
  // res.writeHead(200, { 'Set-cookie': 'mycookie=test' });  // 브라우저에 쿠키를 설정하라고 명령
  res.writeHead(200, { 'Set-cookie': ['mycookie=test','name=qwer'] });  // 브라우저에 쿠키를 설정하라고 명령
  res.end('Hello Cookie');
})
  .listen(8083, () => {
    console.log('8083번 포트에서 서버 대기 중입니다');
  });

// 처음 접속 시와 쿠키를 한 번 받고난 뒤 요청 헤더 비교
// 브라우저가 자동으로 쿠키를 서버로 전달하는 것 확인!
// 터미널에 undefined 뜸. favicon 요청은 그 다음에 요청이므로 쿠키가 생겨있음

// (참고)
// /favicon.ico는 크롬 브라우저가 알아서 보내는 요청
// Session cookie는 브라우저를 닫으면 사라짐(크롬 기준 탭이 아닌 브라우저 전체)
// 기한을 지정하면 자동으로 사라짐 / 자동 로그인 기능
