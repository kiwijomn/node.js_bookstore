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
function dateOfEightDigit(){
    var today = new Date();
    var nowdate = String(today.getFullYear());
    var month ;
    var day ;
    if (today.getMonth < 9)
        month = "0" + String(today.getMonth()+1);
    else
        month = String(today.getMonth()+1);

    if (today.getDate < 10)
        day = "0" + String(today.getDate());
    else
        day = String(today.getDate());
    return nowdate + month + day;
}

module.exports = {
    // cart
    cartlist : function(request, response){
        var id = request.session.login_id;
        db.query(`select * from book LEFT JOIN cart on book.id = cart.bookid where cart.custid=?
                UNION 
                select * from book RIGHT JOIN cart on book.id = cart.bookid where cart.custid=?`,
                [id, id],
                function(error, result) {
                    if(error) {
                        throw error;
                    }
                    var context = {
                        doc : `./cart.ejs`,
                        loggined : authIsOwner(request, response),
                        id : request.session.login_id,
                        cls : request.session.class,
                        kind: '장바구니 목록',
                        results: result,
                    };
                    request.app.render('index', context, function(err, html){
                        response.end(html);
                    })
                }
        );
    },
    cart : function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var item = qs.parse(body);
            var id = request.session.login_id
            db.query(`INSERT INTO cart (custid, bookid, cartdate, qty) VALUES(?, ?, ?, ?)`,
                [id, item.bookid, dateOfEightDigit(), item.qty],
                function(error, result){
                    response.writeHead(302, {Location: `/book/cart`});
                    response.end();
                }
            );
        });
    },
    cart_delete : function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var item = qs.parse(body);
            db.query(`DELETE FROM cart WHERE cartid = ?`, [item.cartid], function(error, result){
                if(error){
                    throw error;
                }
                response.writeHead(302, {Location: `/book/cart`});
                response.end();
            });
        });
    },

    // purchase
    purchase : function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var item = qs.parse(body);
            var id = request.session.login_id;
            var point = item.price * 0.1;
            db.query(`INSERT INTO purchase (custid, bookid, purchasedate, price, point, qty)
                VALUES(?, ?, ?, ?, ?, ?)`,
                [id, item.bookid, dateOfEightDigit(), item.price, point, item.qty],
                function(error, result){
                    db.query(`DELETE FROM cart WHERE cartid = ?`, [item.cartid], function(error, result){
                        if(error){
                            throw error;
                        }
                        response.writeHead(302, {Location: `/book/purchaselist`});
                        response.end();
                    });
                }
            );
        });
    },
    purchase_all : function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var item = qs.parse(body);
            var id = request.session.login_id;
            db.query(`select * from book LEFT JOIN cart on book.id = cart.bookid where cart.custid=?
            UNION 
            select * from book RIGHT JOIN cart on book.id = cart.bookid where cart.custid=?`,
                [id, id],
                function(error, result){
                    var i = 0;
                    while(i < result.length){
                        db.query(`INSERT INTO purchase (custid, bookid, purchasedate, price, point, qty)
                        VALUES(?, ?, ?, ?, ?, ?)`,
                        [id, result[i].id, dateOfEightDigit(), result[i].price, result[i].price*0.1, result[i].qty],
                        function(error, result){
                            if(error){
                                throw error;
                            }
                        });
                        i++;
                    }
                    response.writeHead(302, {Location: `/book/purchaselist`});
                    response.end();
                }
            );
            db.query(`DELETE FROM cart WHERE custid = ?`, [id], function(error, result){
                if(error){
                    throw error;
                }
            });
        });
    },
    purchaselist : function(request, response){
        var id = request.session.login_id;
        db.query(`select * from book LEFT JOIN purchase on book.id = purchase.bookid where purchase.custid=?
                UNION 
                select * from book RIGHT JOIN purchase on book.id = purchase.bookid where purchase.custid=?`,
                [id, id],
                function(error, result) {
                    if(error) {
                        throw error;
                    }
                    var context = {
                        doc : `./purchase.ejs`,
                        loggined : authIsOwner(request, response),
                        id : request.session.login_id,
                        cls : request.session.class,
                        kind: '구매 페이지',
                        results: result,
                    };
                    request.app.render('index', context, function(err, html){
                        response.end(html);
                    })
                }
        );
    },
    purchase_cancel : function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var item = qs.parse(body);
            db.query(`UPDATE purchase SET cancel = "Y" WHERE purchaseid = ?`,
                [item.purchaseid],
                function(error, result){
                    response.writeHead(302, {Location: `/book/purchaselist`});
                    response.end();
                }
            );
        });
    },
    purchase_refund : function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var item = qs.parse(body);
            db.query(`UPDATE purchase SET refund = "Y" WHERE purchaseid = ?`,
                [item.purchaseid],
                function(error, result){
                    response.writeHead(302, {Location: `/book/purchaselist`});
                    response.end();
                }
            );
        });
    },

    // book CRUD & paging
    home : function(request, response){
        db.query(`SELECT count(*) as total FROM book`, function(error, nums){
            var numPerPage = 2;
            var pageNum = request.params.pNum 
            var offs = (pageNum - 1) * numPerPage;
            var totalPages = Math.ceil(nums[0].total / numPerPage);
        
            db.query(`SELECT * FROM book ORDER BY pubdate desc, id LIMIT ? OFFSET ?`, [numPerPage, offs], 
                function(error, books) {
                    if(error) {
                        throw error;
                    }
                    var context = {doc : `./book/bookpaging.ejs`,
                                cls : request.session.class,
                                loggined : authIsOwner(request, response),
                                id : request.session.login_id,
                                kind : 'Books',
                                book : books,
                                pageNum : pageNum,
                                totalpages : totalPages,
                                kindofurl: 'H'
                                };
                    request.app.render('index', context, function(err, html){
                        response.end(html); 
                    });
                }
            );
        });
    },
    ebook : function(request, response) {
        db.query(`SELECT count(*) as total FROM book where ebook = 'Y'`, function(error, nums) {
            var numPerPage = 2; 
            var pageNum = request.params.pNum;
            var offs = (pageNum - 1) * numPerPage;
            var totalPages = Math.ceil(nums[0].total / numPerPage); 

            db.query(`SELECT * FROM book where ebook = 'Y' ORDER BY pubdate desc, id LIMIT ? OFFSET ?`, [numPerPage, offs], 
                function(error, books) {
                    if(error) {
                        throw error;
                    }
                    var context = {doc : `./book/bookpaging.ejs`,
                                cls : request.session.class,
                                loggined : authIsOwner(request, response),
                                id : request.session.login_id,
                                kind : 'ebook',
                                book : books,
                                pageNum : pageNum,
                                totalpages : totalPages,
                                kindofurl: 'E'
                    };
                    request.app.render('index', context, function(err, html){
                        response.end(html); 
                    });
                }
            );
        });
    },
    booklistpaging : function(request, response){
        db.query(`SELECT count(*) as total FROM book`, function(error, nums){
            var numPerPage = 2; 
            var pageNum = request.params.pNum;
            var offs = (pageNum - 1) * numPerPage;
            var totalPages = Math.ceil(nums[0].total / numPerPage); 
        
            db.query(`SELECT * FROM book ORDER BY pubdate desc, id LIMIT ? OFFSET ?`, [numPerPage, offs], 
                function(error, books) {
                    if(error) {
                        throw error;
                    }
                    var context = {doc : `./book/bookpaging.ejs`,
                                cls : request.session.class,
                                loggined : authIsOwner(request, response),
                                id : request.session.login_id,
                                kind : 'Books',
                                book : books,
                                pageNum : pageNum,
                                totalpages : totalPages,
                                kindofurl: 'L'
                                };
                    request.app.render('index', context, function(err, html){
                        response.end(html); 
                    });
                }
            );
        });
    },
    best : function(request, response) {
        db.query(`SELECT * FROM book B join (SELECT *
            FROM (SELECT bookid, count(bookid) as numOfSeller
                FROM purchase
                group by bookid
                order by count(bookid) desc ) A
            LIMIT 3) S on B.id = S.bookid`, function(error, result) {
            if(error) {
                throw error;
            }
            var context = {
                doc : `./book/book.ejs`,
                results: result,
                loggined : authIsOwner(request, response),
                id : request.session.login_id,
                cls : request.session.class,
                kind : 'Best Seller'
            };
            request.app.render('index', context, function(err, html){
                response.end(html);
            })
        });
    },
    month : function(request, response) {
        db.query(`SELECT * FROM book B join (SELECT *
            FROM (SELECT bookid, count(bookid) as numOfSeller
                FROM purchase
                WHERE left(purchasedate,6) = ?
                group by bookid
                order by count(bookid) desc ) A
            LIMIT 3) S on B.id = S.bookid`, [dateOfEightDigit().substring(0,6)], function(error, result) {
            if(error) {
                throw error;
            }
            var context = {
                doc : `./book/book.ejs`,
                results: result,
                loggined : authIsOwner(request, response),
                id : request.session.login_id,
                cls : request.session.class,
                kind : '이달의 책'
            };
            request.app.render('index', context, function(err, html){
                response.end(html);
            })
        });
    },
    detail : function(request, response){
        var bId = request.params.bId;
        db.query(`SELECT * FROM book where id = ${bId}`, function(error, result) {
            if(error) {
                throw error;
            }
            var context = {
                doc : `./book/bookdetail.ejs`,
                loggined : authIsOwner(request, response),
                id : request.session.login_id,
                cls : request.session.class,
                name: result[0].name,
                author: result[0].author,
                price: result[0].price,
                qty: result[0].qty,
                img: result[0].img,
                results: result,
                bookid: bId
            };
            request.app.render('index', context, function(err, html){
                response.end(html);
            })
        });
    },
    bookCreate : function(request, response){
        var titleofcreate = 'Create';
        var context = {
            loggined : authIsOwner(request, response),
            id : request.session.login_id,
            cls: request.session.class,
            doc: `./book/bookCreate.ejs`,
            name: '',
            publisher: '',
            author: '',
            stock: '',
            pubdate: '',
            pagenum: '',
            ISBN: '',
            ebook: '',
            kdc: '',
            img: '',
            price: '',
            nation: '',
            description: '',
            kindOfDoc: 'C',
        };
        request.app.render('index', context, function(err, html){
            response.end(html);
        });
    },
    bookCreate_process : function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var cal = qs.parse(body);
            db.query(`INSERT INTO book (name, publisher, author, stock, pubdate, pagenum, ISBN, ebook, kdc, img, price, nation, description)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [cal.name, cal.publisher, cal.author, cal.stock, cal.pubdate, cal.pagenum, cal.ISBN, cal.ebook, cal.kdc, cal.img, cal.price, cal.nation, cal.description],
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
    bookList : function(request, response){
        var titleofcreate = 'Create';
        db.query(`SELECT * FROM book`,
            function(error, result){
                if(error){
                    throw error;
                }
                var context = {
                    doc: `./book/bookList.ejs`,
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
    bookUpdate : function(request, response){
        var titleofcreate = 'Update';
        bookId = request.params.bookId;
        db.query(`SELECT * FROM book where id = ${bookId}`,
            function(error, result){
                if(error){
                    throw error;
                }
                var context = {
                    doc: `./book/bookCreate.ejs`,
                    name: result[0].name,
                    publisher: result[0].publisher,
                    author: result[0].author,
                    stock: result[0].stock,
                    pubdate: result[0].pubdate,
                    pagenum: result[0].pagenum,
                    ISBN: result[0].ISBN,
                    ebook: result[0].ebook,
                    kdc: result[0].kdc,
                    img: result[0].img,
                    price: result[0].price,
                    nation: result[0].nation,
                    description: result[0].description,
                    bId: bookId,
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
    bookUpdate_process : function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var plan = qs.parse(body);
            bookId = request.params.bookId;
            db.query(`UPDATE book SET name=?, publisher=?, author=?, stock=?, pubdate=?, pagenum=?, ISBN=?, ebook=?, kdc=?, img=?, price=?, nation=?, description=? WHERE id = ?`,
                [plan.name, plan.publisher, plan.author, plan.stock, plan.pubdate, plan.pagenum, plan.ISBN, plan.ebook, plan.kdc, plan.img, plan.price, plan.nation, plan.description, bookId],
                function(error, result){
                    response.writeHead(302, {Location: `/book/list`});
                    response.end();
                }
            );
        });
    },
    bookDelete_process : function(request, response){
        var bookId = request.params.bookId;
        db.query(`DELETE FROM book WHERE id = ?`, [bookId], function(error, result){
            if(error){
                throw error;
            }
            response.writeHead(302, {Location: `/`});
            response.end();
        });
    }
}