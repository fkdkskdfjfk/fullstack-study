setInterval(() => {
  console.log('시작');

  // 에러가 발생할 만한 곳을 try catch로 감싼다
  try {
    throw new Error('서버를 고장내주마!'); 
  } catch (err) {
    console.error(err); // 에러 처리
  }
}, 1000);
