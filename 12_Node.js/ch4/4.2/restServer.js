const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const users = {}; // 사용자 정보 데이터 저장용
// (참고) DB가 아닌 메모리(rem)에 저장되는 것이라 서버를 재시작하면 정보가 지워짐

// 서버는 요청을 받으면 응답을 해야됨
// 브라우저 주소창에 주소를 입력하면 GET 요청을 보내는 것
// http://localhost:8082 를 입력하면 url은 '/', method는 GET
http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET') {
      if (req.url === '/') {  // GET 요청이고 url이 '/'일 때
        // const data = await fs.readFile('./restFront.html');
        // (참고) 서버 파일이 루트 경로에 없는 경우 서버 실행 위치에 따라 상대 경로가 문제될 수 있음, path를 같이 사용하면 좋음
        const data = await fs.readFile(path.join(__dirname, 'restFront.html'));
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); // 200: OK(성공)
        return res.end(data); // 응답으로 페이지를 내려줌
      }
      // Quiz: GET 요청이고 url이 '/about'일 때
      else if (req.url === '/about') {
        const data = await fs.readFile(path.join(__dirname, 'about.html'));
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(data);
      }
      else if (req.url === '/users') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });  // 콘텐츠 타입은 json
        return res.end(JSON.stringify(users));  // 응답으로 json 포맷으로 바꿔서 내려줌
      }
      
      console.log(req.url);
      try {
        // const data = await fs.readFile(`.${req.url}`);  // 상대 경로 사용
        const data = await fs.readFile(path.join(__dirname, req.url));  // 안전한 방식
        return res.end(data); // 응답으로 css랑 js를 보내줌
      } catch (err) {
        console.error(err);
      }
    }
    else if (req.method === 'POST') {
      if (req.url === '/user') { // 폼 제출(submit) 시 실행, 사용자를 등록하는 로직
        let body = '';
        // 요청의 body를 stream 형식으로 받음
        req.on('data', (data) => {
          body += data;
        });
        // 요청의 body를 다 받은 후 실행됨
        return req.on('end', () => {
          console.log('POST 본문(Body):', body);
          const { name } = JSON.parse(body); // json 문자열을 객체로 변환
          const id = Date.now(); // id값 임의 생성
          users[id] = name;
          res.writeHead(201, { 'Content-Type': 'text/plain; charset=utf-8' }); // 201: Created(생성됨)
          res.end('등록 성공'); // Response에서 응답 데이터 확인 가능
        });
      }
    } else if (req.method === 'PUT') {
      // console.log(req.url); // /user/1700576444873
      // console.log(req.url.split('/')); // [ '', 'user', '1700576444873' ]
      if (req.url.startsWith('/user/')) {
        const key = req.url.split('/')[2]; // url에서 id 추출
        let body = '';
        req.on('data', (data) => {
          body += data;
        });
        return req.on('end', () => {
          console.log('PUT 본문(Body):', body);
          users[key] = JSON.parse(body).name;
          res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
          return res.end(JSON.stringify(users));
        });
      }
    } else if (req.method === 'DELETE') {
      if (req.url.startsWith('/user/')) {
        const key = req.url.split('/')[2]; // url에서 id 추출
        delete users[key];
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end(JSON.stringify(users));
      }
    }
  } catch (err) {
    console.error(err);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }); // 500: Internal Server Error(서버 에러)
    res.end(err.message);
  }
})
  .listen(8082, () => {
    console.log('8082번 포트에서 서버 대기 중입니다');
  });