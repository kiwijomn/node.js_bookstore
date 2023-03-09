const express = require('express');
const app = express();
var session = require('express-session');
var MySqlStore = require('express-mysql-session')(session);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
var db = require('./lib/db.js');
var etc = require('./lib/etc.js');
var util = require('./lib/util.js');
var auth = require('./lib/authentication.js');
var book = require('./lib/book.js');
var board = require('./lib/board.js');

var options = {
    host : 'localhost',
    user : 'nodejs',
    password : 'nodejs',
    database : 'webdb2022'
};
var sessionStore = new MySqlStore(options);
app.use(express.static('public'));
app.use(session({ 
    secret : 'asadlfkj!@#$%^dfgasdg',
    resave : false,
    saveUninitialized : true,
    store : sessionStore
}));

//root page
app.get('/', function(request, response){
    response.redirect('/home/1');
});

//book
app.get('/home/:pNum', function(request, response){
    book.home(request, response);
});
app.get('/ebook/:pNum', function(request, response){
    book.ebook(request, response);
});
app.get('/book/list/:pNum', function(request, response){
    book.booklistpaging(request, response);
});
app.get('/book_detail/:bId', function(request, response){
    book.detail(request, response);
});
app.get('/best', function(request, response){
    book.best(request, response);
});
app.get('/month', function(request, response){
    book.month(request, response);
});

//cart
app.get('/book/cart', function(request, response){
    book.cartlist(request, response);
});
app.post('/book/cart', function(request, response){
    book.cart(request, response);
});
app.post('/book/cart_delete', function(request, response){
    book.cart_delete(request, response);
});

//purchase
app.get('/book/purchaselist', function(request, response){
    book.purchaselist(request, response);
});
app.post('/book/purchase', function(request, response){
    book.purchase(request, response);
});
app.post('/book/purchase_all', function(request, response){
    book.purchase_all(request, response);
});
app.post('/book/purchase_cancel', function(request, response){
    book.purchase_cancel(request, response);
});
app.post('/book/purchase_refund', function(request, response){
    book.purchase_refund(request, response);
});

//book CRUD
app.get('/book/create', function(request, response) {
    book.bookCreate(request, response);
});
app.post('/book/create_process', function(request, response) {
    book.bookCreate_process(request, response);
});
app.get('/book/list', function(request, response){
    book.bookList(request, response);
});
app.get('/book/update/:bookId', function(request, response){
    book.bookUpdate(request, response);
});
app.post('/book/update_process/:bookId', function(request, response){
    book.bookUpdate_process(request, response);
});
app.get('/book/delete_process/:bookId', function(request, response){
    book.bookDelete_process(request, response);
});

//register
app.get('/register', function(request, response) {
    auth.register(request, response);
});
app.post('/register_process', function(request, response) {
    auth.register_process(request, response);
});

//change password
app.get('/changepw', function(request, response) {
    auth.changepw(request, response);
});
app.post('/changepw_process', function(request, response) {
    auth.changepw_process(request, response);
});

//util - search
app.get('/book/search', function(request, response){
    util.booksearch(request, response);
});
app.post('/book/search', function(request, response){
    util.bookresult(request, response);
});
app.get('/namecard/search', function(request, response){
    util.namecardsearch(request, response);
});
app.post('/namecard/search', function(request, response){
    util.namecardresult(request, response);
});
app.get('/calendar/search', function(request, response){
    util.calendarsearch(request, response);
});
app.post('/calendar/search', function(request, response){
    util.calendarresult(request, response);
});

//calendar
app.get('/calendar', function(request, response) {
    etc.calendarHome(request, response);
});
app.get('/calendar/create', function(request, response) {
    etc.calendarCreate(request, response);
});
app.post('/calendar/create_process', function(request, response) {
    etc.calendarCreate_process(request, response);
});
app.get('/calendar/list', function(request, response){
    etc.calendarList(request, response);
});
app.get('/calendar/update/:planId', function(request, response){
    etc.calendarUpdate(request, response);
});
app.post('/calendar/update_process/:planId', function(request, response){
    etc.calendarUpdate_process(request, response);
});
app.get('/calendar/delete_process/:planId', function(request, response){
    etc.calendarDelete_process(request, response);
});

//namecard
app.get('/namecard', function(request, response) {
    etc.namecardHome(request, response);
});
app.get('/namecard/create', function(request, response) {
    etc.namecardCreate(request, response);
});
app.post('/namecard/create_process', function(request, response) {
    etc.namecardCreate_process(request, response);
});
app.get('/namecard/list', function(request, response){
    etc.namecardList(request, response);
});
app.get('/namecard/update/:planId', function(request, response){
    etc.namecardUpdate(request, response);
});
app.post('/namecard/update_process/:planId', function(request, response){
    etc.namecardUpdate_process(request, response);
});
app.get('/namecard/delete_process/:planId', function(request, response){
    etc.namecardDelete_process(request, response);
});

//user
app.get('/user', function(request, response) {
    etc.userHome(request, response);
});
app.get('/user/create', function(request, response) {
    etc.userCreate(request, response);
});
app.post('/user/create_process', function(request, response) {
    etc.userCreate_process(request, response);
});
app.get('/user/list', function(request, response){
    etc.userList(request, response);
});
app.get('/user/update/:planId', function(request, response){
    etc.userUpdate(request, response);
});
app.post('/user/update_process/:planId', function(request, response){
    etc.userUpdate_process(request, response);
});
app.get('/user/delete_process/:planId', function(request, response){
    etc.userDelete_process(request, response);
});

//board
app.get('/board/list/:pNum', function(request, response){
    board.list(request, response);
});
app.get('/board/view/:bNum/:pNum', function(request, response){
    board.view(request, response);
});
app.get('/board/create', function(request, response){
    board.create(request, response);
});
app.post('/board/create_process', function(request, response){
    board.create_process(request, response);
});
app.get('/board/update/:bNum/:pNum', function(request, response){
    board.update(request, response);
});
app.post('/board/update_process', function(request, response){
    board.update_process(request, response);
});
app.get('/board/delete/:bNum/:pNum', function(request, response){
    board.delete(request, response);
});

//login & logout
app.get('/login', function(request, response){
    auth.login(request, response);
});
app.post('/login_process', function(request, response){
    auth.login_process(request, response);
});
app.get('/logout', function(request, response){
    auth.logout(request, response);
});

app.listen(3000, ()=>console.log('Example app listening on port 3000'));