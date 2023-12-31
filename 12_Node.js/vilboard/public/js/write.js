// axios로 서버에 비동기 요청 보내기 - 비동기는 새로고침이 일어나지 않음
document.getElementById('write-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const title = e.target.title.value;
  const content = e.target.content.value;
  const img = e.target.img.files[0];  // upload.single('img')이므로 img로 작명!!

  const formData = new FormData();  //FormData는 multipart/form-data 타입

  formData.append('title', title);
  formData.append('content', content);
  formData.append('img', img);

  try {
    const result = await axios.post('/post/write',  formData );
    console.log(result.data); // 브라우저 콘솔

    if (!result.data.flag) {
      return alert(result.data.message);
    }
    location.href = '/post';  // location 객체로 페이지 redirect
  } catch (err) {
    console.error(err);
  }
  e.target.title.value = '';
  e.target.content.value = '';

});