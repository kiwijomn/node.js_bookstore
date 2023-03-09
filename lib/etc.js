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
    // calendar CRUD
    calendarHome : function(request, response){
        db.query(`SELECT * FROM calendar`, function(error, result) {
            if(error) {
                throw error;
            }
            var context = {
                doc : `./calendar/calendar.ejs`,
                loggined : authIsOwner(request, response),
                id : request.session.login_id,
                cls: request.session.class,
                results: result 
            };
            request.app.render('index', context, function(err, html){
                response.end(html);
            })
        });
    },
    calendarCreate : function(request, response){
        var titleofcreate = 'Create';
        var context = {
            doc: `./calendar/calendarCreate.ejs`,
            title: '',
            description: '',
            kindOfDoc: 'C',
            loggined : authIsOwner(request, response),
            id : request.session.login_id,
            cls: request.session.class
        };
        request.app.render('index', context, function(err, html){
            response.end(html);
        });
    },
    calendarCreate_process : function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var cal = qs.parse(body);
            db.query(`INSERT INTO calendar (title, description, created, author_id) VALUES(?, ?, NOW(), 2)`,
                [cal.title, cal.description],
                function(error, result){
                    if(error){
                        throw error;
                    }
                    response.writeHead(302, {Location: `/calendar`});
                    response.end();
                }
            );
        });
    },
    calendarList : function(request, response){
        var titleofcreate = 'Create';
        db.query(`SELECT * FROM calendar`,
            function(error, result){
                if(error){
                    throw error;
                }
                var context = {
                    doc: `./calendar/calendarList.ejs`,
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id,
                    cls: request.session.class,
                    results: result
                };
                request.app.render('index', context, function(err, html){
                    response.end(html);
                });
            }
        );
    },
    calendarUpdate : function(request, response){
        var titleofcreate = 'Update';
        var planId = request.params.planId;
        db.query(`SELECT * FROM calendar where id = ${planId}`,
            function(error, result){
                if(error){
                    throw error;
                }
                var context = {
                    doc: `./calendar/calendarCreate.ejs`,
                    title: result[0].title,
                    description: result[0].description,
                    pId: planId,
                    kindOfDoc: 'U',
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id,
                    cls: request.session.class,
                };
                request.app.render('index', context, function(err, html){
                    response.end(html);
                });
            }
        );
    },
    calendarUpdate_process : function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var plan = qs.parse(body);
            planId = request.params.planId;
            db.query(`UPDATE calendar SET title=?, description=?, author_id=? WHERE id=?`,
                [plan.title, plan.description, 2, planId],
                function(error, result){
                    response.writeHead(302, {Location: `/calendar`});
                    response.end();
                }
            );
        });
    },
    calendarDelete_process : function(request, response){
        var planId = request.params.planId;
        db.query('DELETE FROM calendar WHERE id = ?', [planId], function(error, result){
            if(error){
                throw error;
            }
            response.writeHead(302, {Location: `/calendar`});
            response.end();
        });
    },

    // namecard CRUD
    namecardHome : function(request, response){
        db.query(`SELECT * FROM namecard`, function(error, result) {
            if(error) {
                throw error;
            }
            var context = {
                doc : `./namecard/namecard.ejs`,
                loggined : authIsOwner(request, response),
                id : request.session.login_id,
                cls : request.session.class,
                results: result
            };
            request.app.render('index', context, function(err, html){
                response.end(html);
            })
        });
    },
    namecardCreate : function(request, response){
        var titleofcreate = 'Create';
        var context = {
            doc: `./namecard/namecardCreate.ejs`,
            name: '',
            address: '',
            workplace: '',
            tel: '',
            birth: '',
            kindOfDoc: 'C',
            loggined : authIsOwner(request, response),
            id : request.session.login_id,
            cls: request.session.class,
        };
        request.app.render('index', context, function(err, html){
            response.end(html);
        });
    },
    namecardCreate_process : function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var cal = qs.parse(body);
            db.query(`INSERT INTO namecard (name, address, workplace, tel, birth) VALUES(?, ?, ?, ?, ?)`,
                [cal.name, cal.address, cal.workplace, cal.tel, cal.birth],
                function(error, result){
                    if(error){
                        throw error;
                    }
                    response.writeHead(302, {Location: `/namecard`});
                    response.end();
                }
            );
        });
    },
    namecardList : function(request, response){
        var titleofcreate = 'Create';
        db.query(`SELECT * FROM namecard`,
            function(error, result){
                if(error){
                    throw error;
                }
                var context = {
                    doc: `./namecard/namecardList.ejs`,
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id,
                    cls: request.session.class,
                    results: result
                };
                request.app.render('index', context, function(err, html){
                    response.end(html);
                });
            }
        );
    },
    namecardUpdate : function(request, response){
        var titleofcreate = 'Update';
        var planId = request.params.planId;
        db.query(`SELECT * FROM namecard where id = ${planId}`,
            function(error, result){
                if(error){
                    throw error;
                }
                var context = {
                    doc: `./namecard/namecardCreate.ejs`,
                    name: result[0].name,
                    address: result[0].address,
                    workplace: result[0].workplace,
                    tel: result[0].tel,
                    birth: result[0].birth,
                    pId: planId,
                    kindOfDoc: 'U',
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id,
                    cls: request.session.class,
                };
                request.app.render('index', context, function(err, html){
                    response.end(html);
                });
            }
        );
    },
    namecardUpdate_process : function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var plan = qs.parse(body);
            var planId = request.params.planId;
            db.query(`UPDATE namecard SET name=?, address=?, workplace=?, tel=?, birth=? WHERE id=?`,
                [plan.name, plan.address, plan.workplace, plan.tel, plan.birth, planId],
                function(error, result){
                    response.writeHead(302, {Location: `/namecard`});
                    response.end();
                }
            );
        });
    },
    namecardDelete_process : function(request, response){
        var planId = request.params.planId;
        db.query(`DELETE FROM namecard WHERE id = ?`, [planId], function(error, result){
            if(error){
                throw error;
            }
            response.writeHead(302, {Location: `/namecard`});
            response.end();
        });
    },

    // user CRUD
    userHome : function(request, response){
        db.query(`SELECT * FROM user`, function(error, result) {
            if(error) {
                throw error;
            }
            var context = {
                doc : `./user/user.ejs`,
                loggined : authIsOwner(request, response),
                id : request.session.login_id,
                cls : request.session.class,
                results: result
            };
            request.app.render('index', context, function(err, html){
                response.end(html);
            })
        });
    },
    userCreate : function(request, response){
        var titleofcreate = 'Create';
        var context = {
            loggined : authIsOwner(request, response),
            id : request.session.login_id,
            cls: request.session.class,
            doc: `./user/userCreate.ejs`,
            loginid: '',
            password: '',
            name: '',
            address: '',
            tel: '',
            birth: '',
            user_class: '',
            grade: '',
            kindOfDoc: 'C',
        };
        request.app.render('index', context, function(err, html){
            response.end(html);
        });
    },
    userCreate_process : function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var cal = qs.parse(body);
            db.query(`INSERT INTO user (loginid, password, name, address, tel, birth, user_class, grade) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
                [cal.loginid, cal.password, cal.name, cal.address, cal.tel, cal.birth, cal.user_class, cal.grade],
                function(error, result){
                    if(error){
                        throw error;
                    }
                    response.writeHead(302, {Location: `/user`});
                    response.end();
                }
            );
        });
    },
    userList : function(request, response){
        var titleofcreate = 'Create';
        db.query(`SELECT * FROM user`,
            function(error, result){
                if(error){
                    throw error;
                }
                var context = {
                    doc: `./user/userList.ejs`,
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id,
                    cls : request.session.class,
                    results: result
                };
                request.app.render('index', context, function(err, html){
                    response.end(html);
                });
            }
        );
    },
    userUpdate : function(request, response){
        var titleofcreate = 'Update';
        planId = request.params.planId;
        db.query(`SELECT * FROM user where id = ${planId}`,
            function(error, result){
                if(error){
                    throw error;
                }
                var context = {
                    doc: `./user/userCreate.ejs`,
                    loginid: result[0].loginid,
                    password: result[0].password,
                    name: result[0].name,
                    address: result[0].address,
                    tel: result[0].tel,
                    birth: result[0].birth,
                    user_class: result[0].user_class,
                    grade: result[0].grade,
                    pId: planId,
                    kindOfDoc: 'U',
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id,
                    cls: request.session.class
                };
                request.app.render('index', context, function(err, html){
                    response.end(html);
                });
            }
        );
    },
    userUpdate_process : function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var plan = qs.parse(body);
            planId = request.params.planId;
            db.query(`UPDATE user SET loginid=?, password=?, name=?, address=?, tel=?, birth=?, user_class=?, grade=? WHERE id = ?`,
                [plan.loginid, plan.password, plan.name, plan.address, plan.tel, plan.birth, plan.user_class, plan.grade, planId],
                function(error, result){
                    response.writeHead(302, {Location: `/user`});
                    response.end();
                }
            );
        });
    },
    userDelete_process : function(request, response){
        var planId = request.params.planId;
        db.query(`DELETE FROM user WHERE id = ?`, [planId], function(error, result){
            if(error){
                throw error;
            }
            response.writeHead(302, {Location: `/user`});
            response.end();
        });
    }
}