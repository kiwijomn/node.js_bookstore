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
    //change password
    changepw : function(request, response){
        var context = {doc : `./changepw.ejs`,
            loggined : authIsOwner(request, response),
            id : request.session.login_id,
            cls : request.session.class,
            loginid: '',
            password: '',
        };
        request.app.render('index', context, function(err, html){
            response.end(html);
        })
    },
    changepw_process : function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
        var post = qs.parse(body);
                db.query(`UPDATE person SET password=? WHERE loginid = ?`,
                [post.password, post.loginid], function(error, result){
                    if(error) {
                        throw error;
                    }
                    response.writeHead(302, {Location: `/`});
                    response.end();
                });
        });
    },

    //register
    register : function(request, response){
        var context = {doc : `./register.ejs`,
            loggined : authIsOwner(request, response),
            id : request.session.login_id,
            cls : request.session.class,
            loginid: '',
            password: '',
            name: '',
            address: '',
            tel: '',
            birth: '',
        };
        request.app.render('index', context, function(err, html){
            response.end(html);
        })
    },
    register_process : function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var cal = qs.parse(body);
            db.query(`INSERT INTO person (loginid, password, name, address, tel, birth, class, grade) VALUES(?, ?, ?, ?, ?, ?, 'B', 'B')`,
                [cal.loginid, cal.password, cal.name, cal.address, cal.tel, cal.birth],
                function(error, result){
                    if(error){
                        throw error;
                    }
                    response.writeHead(302, {Location: `/`});
                    response.end();
                }
            );
        });
    },

    //login
    login : function(request, response){
        var subdoc;
        if (authIsOwner(request, response) === true) {
            subdoc = 'book.ejs';
        }
        else {
            subdoc = 'login.ejs';
        }
        var context = {doc : subdoc,
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id,
                    cls : request.session.class
        };
        request.app.render('index', context, function(err, html){
            response.end(html);
        })
    },
    login_process : function(request, response) {
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            db.query(`SELECT loginid, password, class FROM person where loginid=? and password=?`,
                [post.id, post.pw], function(error, result) {
                    if(error) {
                        throw error;
                    }
                    if(result[0] === undefined) response.end('Who?');
                    else {
                        request.session.is_logined = true;
                        request.session.login_id = result[0].loginid;
                        request.session.class = result[0].class;
                        response.redirect('/');
                    }
                }
            );
        });
    },

    //logout
    logout : function(request, response) {
        request.session.destroy(function(err){
            response.redirect('/');
        });
    }
};