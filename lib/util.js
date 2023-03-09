var db = require('./db');
var qs = require('querystring');

function authIsOwner(request, response){
    if(request.session.is_logined){
        return true;
    }
    else {
        return false;
    }
}

module.exports = {
    //Calendar 검색
    calendarsearch : function(request, response) {
        var context = {
            doc : `./search.ejs`,
            loggined : authIsOwner(request, response),
            id : request.session.login_id,
            cls : request.session.class,
            kind: 'calendar search',
            listyn: 'N',
            kindOfDoc: 'C',
            searchword: '월을 입력하세요'
        };
        request.app.render('index', context, function(err, html){
            response.end(html);
        })
    },
    //Calendar 검색 결과
    calendarresult : function(request, response) {
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
        var post = qs.parse(body);
                db.query(`SELECT * FROM calendar where title like ?`, [`%${post.keyword}%`],
                function(error, results){
                    if(error) {
                        throw error;
                    }
                    var context = {
                        doc : `./search.ejs`,
                        loggined : authIsOwner(request, response),
                        id : request.session.login_id,
                        cls : request.session.class,
                        kind: 'calendar search',
                        listyn: 'Y',
                        kindOfDoc: 'C',
                        searchword: '월을 입력하세요',
                        bs: results
                    };
                    request.app.render('index', context, function(err, html){
                        response.end(html);
                    })
                });
        });
    },

    //NameCard 검색
    namecardsearch : function(request, response) {
        var context = {
            doc : `./search.ejs`,
            loggined : authIsOwner(request, response),
            id : request.session.login_id,
            cls : request.session.class,
            kind: 'name search',
            listyn: 'N',
            kindOfDoc: 'N',
            searchword: '이름을 입력하세요'
        };
        request.app.render('index', context, function(err, html){
            response.end(html);
        })
    },
    //NameCard 검색 결과
    namecardresult : function(request, response) {
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
        var post = qs.parse(body);
                db.query(`SELECT * FROM namecard where name like ?`, [`%${post.keyword}%`],
                function(error, results){
                    if(error) {
                        throw error;
                    }
                    var context = {
                        doc : `./search.ejs`,
                        loggined : authIsOwner(request, response),
                        id : request.session.login_id,
                        cls : request.session.class,
                        kind: 'name search',
                        listyn: 'Y',
                        kindOfDoc: 'N',
                        searchword: '이름을 입력하세요',
                        bs: results
                    };
                    request.app.render('index', context, function(err, html){
                        response.end(html);
                    })
                });
        });
    },

    //Book 검색
    booksearch : function(request, response) {
        var context = {
            doc : `./search.ejs`,
            loggined : authIsOwner(request, response),
            id : request.session.login_id,
            cls : request.session.class,
            kind: 'book search',
            listyn: 'N',
            kindOfDoc: 'B',
            searchword: '책 제목을 입력하세요'
        };
        request.app.render('index', context, function(err, html){
            response.end(html);
        })
    },
    //Book 검색 결과
    bookresult : function(request, response) {
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
        var post = qs.parse(body);
                db.query(`SELECT * FROM book where name like ?`, [`%${post.keyword}%`],
                function(error, results){
                    if(error) {
                        throw error;
                    }
                    var context = {
                        doc : `./search.ejs`,
                        loggined : authIsOwner(request, response),
                        id : request.session.login_id,
                        cls : request.session.class,
                        kind: 'book search',
                        listyn: 'Y',
                        bs: results,
                        kindOfDoc: 'B',
                        searchword: '책 제목을 입력하세요'
                    };
                    request.app.render('index', context, function(err, html){
                        response.end(html);
                    })
                });
        });
    },
}