// 기본적인 서버 구조 작성하기
// 1) dotenv 설정
// 2) app 관련 설정들(전역속성) 설정
// 3) 공통 미들웨어 설정
// (morgan, static, body-parser, cookie-parser, express-session)
// 4) 404 처리 미들웨어
// 5) 에러 처리 미들웨어 + error.ejs
// 6) 서버 연결

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const cors = require('cors');

dotenv.config();

// 라우터 가져오기
const indexRouter = require('./routes/index');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
// DB 연결 함수 가져오기
const { connect } = require('./database/index');
// ./passport/index.js 가져오기
const passportConfig = require('./passport');

const app = express();
passportConfig(); // passport/index.js에서 내보낸 함수 = passport 설정 실행
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');  // view engine의 확장자 지정
connect();  // 몽고디비에 연결

// cors 설정
// 응답에 'Access-Control-Allow-Origin 헤더가 자동으로 추가됨
app.use(cors({
  credentials: true // true여야 다른 도메인 간에 쿠키가 공유됨
}));
// (참고) axios에서도 도메인이 다른데, 쿠키를 공유해야 하는 경우
// withCredentials: true 옵션을 줘서 요청을 보내야 함

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public'))); // '/' 생략 가능
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,  // 개발단계에선 false. 기본이 false
    // 만료기한 설정(expires, maxage) 안 하면 기본이 session
  },
  // 세션 만드는 코드!
  store: MongoStore.create({
    mongoUrl: `mongodb+srv://${process.env.MONGO_ID}:${process.env.MONGO_PASSWORD}@cluster0.hqitiuj.mongodb.net/`,
    dbName: 'board',
  })
}));

// passport 미들웨어 설정
app.use(passport.initialize()); // 요청(req) 객체에 passport 설정이 추가됨(req.isAuthenticated, req.login, req.logout 등)
app.use(passport.session());  // req.session 객체에 passport 정보를 저장
// req.session 객체는 express-session에서 생성하는 것이므로 passport 미들웨어는 express-session 미들웨어보다 뒤에 연결해야 함
// passport.session()이 deserializeUser()를 실행시킴

// res.locals.user 속성에 req.user 정보 넣기를 미들웨어로 등록
// => 템플릿 엔진에서 user 객체를 통해 로그인한 사용자 정보에 접근할 수 있음
// views에서 쓸 수 있게 미들웨어로 등록
app.use((req, res, next) => {
  res.locals.user = req.user; // deserializeUser에서 req.user에 저장했음, 전역변수로 만듦
  next();
});


// 라우터를 미들웨어로 등록
app.use('/', indexRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
  const error = new Error( `${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 서버에서 대기 중');
});


// 이미지 업로드 기능 만들기
// 이미지 첨부를 위한 file input을 이용하여 서버로 이미지를 전송하면 서버 컴퓨터 하드에 저장
// => 서버 컴퓨터의 용량에 문제가 생기거나 서버를 배포하는 곳에 따라 하드 사용이 어려울 수 있음
// => 그래서 보통 AWS S3 같은 파일 저장용 클라우드 서비스를 이용
// 클라우드 서비스: AWS, GCP, MS Azure, 네이버 클라우드 등
// 참고로 AWS는 첫 가입 시 카드 등록까지 마치면 1년 동안 프리 티어(사용량이 무제한은 아님, 요금 부과될 수 있음)

// 1) 글 작성 페이지에 file input 하나 만듦
// 2) 서버는 전송된 이미지를 S3에 업로드
// npm install multer multer-s3 @aws-sdk/client-s3
// multer: 전송된 파일을 다룰 수 있음, mmultipart/form-data를 파싱 해줌
// multer-s3: 파일을 S3에 업로드할 수 있도록 도와줌
// @aws-sdk/client-s3: Node.js 환경에서 AWS S3를 쓸 때 필요
// 3) 업로드 완료 시 URL이 하나 생성되는데 DB에 글과 함께 저장
// 4) 나중에 이미지 필요할 때 DB에 저장한 URL 꺼내쓰기