const express = require('express');
var parseurl = require('parseurl');
var session = require('express-session'); // 모듈 불러와 session 객체에 저장
var MySqlStore = require('express-mysql-session')(session);
var options = {
    host : 'localhost',
    user : 'nodejs',
    password : 'nodejs',
    database : 'webdb2022'
};
var sessionStore = new MySqlStore(options);
const app = express();

// session이라는 함수(객체)를 통해 secret, resave, saveUninitialized라는 멤버변수 설정
app.use(session({ // 경로로 요청이 들어오면 두번째 콜백함수=미들웨어함수를 실행, 
    secret : 'keyboard cat', // 저장되어 있는 값이 key로 사용
    resave : false,
    saveUninitialized : true,
    store : sessionStore
}));

// session 정보를 불러오거나 실행. 어떤 경로로 요청이 들어오던 콜백함수 실행
app.use(function(req, res, next){
    if(!req.session.views){ // views라는 멤버변수가 정의되어있지 않다면
        req.session.views = {}; // 정의해주고 객체로 초기화
    }

    // 요청되는 path로 멤버변수 값을 만들고
    var pathname = parseurl(req).pathname;

    // 1씩 증가
    req.session.views[pathname] = (req.session.views[pathname]||0) + 1;

    next();
});

app.get('/', function(req, res, next){
    console.log(req.session);
    if(req.session.num === undefined){
        req.session.num = 1;
    }
    else{
        req.session.num += 1;
    }
    res.send(`Hello session : ${req.session.num}`);
});

app.get('/bar', function(req, res, next){
    res.send('you viewed this page' + req.session.views['/bar'] + 'times');
});

app.listen(3000, function(){
    console.log('3000!');
})