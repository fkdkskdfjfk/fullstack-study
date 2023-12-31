import { useState } from "react";
// Quiz
// 사용자의 정보를 입력받는 가입 양식 컴포넌트 만들기


// 1. 이름 입력받기
// 이름을 입력할 수 있는 input 태그와 입력된 값을 저장하기 위한 name이라는 state를 정의(초기값 '')
// 값이 변경되면 이를 처리하기 위한 handleChangeName() 이라는 이벤트 핸들러 정의

// 2. 성별 입력받기
// 성별을 입력받기 위한 select 태그와 gender라는 이름의 state를 정의(초기값 '남자')
// select 태그에는 총 두가지 옵션이 들어감(남자, 여자)
// 값이 변경되면 이를 처리하기 위한 handleChangeGender() 라는 이벤트 핸들러 정의

// 3. 출력
// 이름과 성별을 입력하고 버튼을 누를시 alert 창으로 입력된 이름과 성별 출력하기

// (선택 사항)
// 1) form 태그 및 submit 이벤트를 사용해도 되고 button 태그의 click 이벤트를 사용해도 됨
// 2) 각각의 state를 여러 개 만들어도 되고 객체 형태로 한번에 관리해도 됨
function SignUp() {
  
  // 객체 형태로 관리
  const [inputs, setInputs] = useState({
    name: '',
    gender: '남자'
  });
  const { name, gender } = inputs;
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // 방법1
    // const copyObj = {
    //   ...inputs
    // };
    // copyObj[name] = value;
    // setInputs(copyObj);

    // 방법2
    // setInputs({
    //   ...inputs,
    //   [name]: value
    // });

    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value 
    }))
  };

  // const [name, setName] = useState('');
  // const [gender, setGender] = useState('남자');

  // const handleChangeName = (e) => {
  //   // console.log(e.target.value);
  //   setName(e.target.value)
  // };

  // const handleChangeGender = (e) => {
  //   console.log(e.target.value);
  //   setGender(e.target.value);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`이름은 ${name}, 성별은 ${gender}입니다.`);
  };

  return (
    <form onSubmit={handleSubmit}>
    {/* <form> */}
      <label>
        이름: 
        <input 
          type="text" 
          name="name"
          onChange={handleInputChange}
          value={name} // 이걸 안 하면 state에 들어있는 값이 아닌 내가 타이핑한 값이 보이는 것. 입력에 어떤 처리를 한다면 달라질 수 있음
        />
      </label>

      <br />

      <label>
        성별:
        <select value={gender} name="gender" onChange={handleInputChange}>
          <option value="남자">남자</option>
          <option value="여자">여자</option>
        </select>
      </label>
      <br />

      {/* <button type="button" onClick={handleSubmit}>입력</button> */}
      <button type="submit" >입력</button>
    </form>
  );
}

export default SignUp;
