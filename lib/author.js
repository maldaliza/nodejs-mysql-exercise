const url = require('url');
const qs = require('querystring');
const mysql = require('mysql');
const db = require('./db.js');
const template = require('./template.js');

exports.home = function(request, response) {
    db.query('SELECT * FROM topic', function(error_1, topic_list) {
        if(error_1) {
            throw error_1;
        }
        db.query('SELECT * FROM author', function(error_2, author_list) {
            if(error_2) {
                throw error_2;
            }
            const title = 'Author';
            const list = template.list(topic_list);
            const control = '<a href="/author/create">create</a>';
            const body = `
                ${template.authorTable(author_list)}
                <style>
                    table {
                        border-collapse: collapse;
                    }
                    td {
                        border:1px solid black;
                    }
                </style>
            `;
            const html = template.HTML(title, list, control, body);

            response.writeHead(200, {'Content-Type' : 'text/html'});
            response.write(html);
            response.end();
        });
    });
}

exports.create = function(request, response) {
    db.query('SELECT * FROM topic', function(error_1, topic_list) {
        if(error_1) {
            throw error_1;
        }
        db.query('SELECT * FROM author', function(error_2, author_list) {
            if(error_2) {
                throw error_2;
            }
            const title = 'Author';
            const list = template.list(topic_list);
            const control = '';
            const body = `
                ${template.authorTable(author_list)}
                <style>
                    table {
                        border-collapse: collapse;
                    }
                    td {
                        border:1px solid black;
                    }
                </style>
                <form action="/author/create_process" method="POST">
                    <p><input type="text" name="name" placeholder="name"></p>
                    <p><input type="text" name="profile" placeholder="profile"></p>
                    <p><input type="submit" value="create"></p>
                </form>
            `;
            const html = template.HTML(title, list, control, body);

            response.writeHead(200, {'Content-Type' : 'text/html'});
            response.write(html);
            response.end();
        });
    });
}

exports.create_process = function(request, response) {
    let body = '';
    request.on('data', function(data) {
        body = body + data;
    });
    request.on('end', function() {
        const post = qs.parse(body);

        db.query('INSERT INTO author (name, profile) VALUES (?, ?)', [post.name, post.profile], function(error, result) {
            if(error) {
                throw error;
            }
            response.writeHead(302, {Location: '/author'});
            response.end();
        });
    });
}

exports.update = function(request, response) {
    const query = url.parse(request.url, true).query;
    db.query('SELECT * FROM topic', function(error_1, topic_list) {
        if(error_1) {
            throw error_1;
        }
        db.query('SELECT * FROM author', function(error_2, author_list) {
            if(error_2) {
                throw error_2;
            }
            db.query('SELECT * FROM author WHERE id=?', [query.id], function(error_3, author_row) {
                if(error_3) {
                    throw error_3;
                }
                const title = 'Author';
                const list = template.list(topic_list);
                const control = '';
                const body = `
                    ${template.authorTable(author_list)}
                    <style>
                        table {
                            border-collapse: collapse;
                        }
                        td {
                            border:1px solid black;
                        }
                    </style>
                    <form action="/author/update_process" method="POST">
                        <input type="hidden" name="id" value="${query.id}">
                        <p><input type="text" name="name" placeholder="name" value="${author_row[0].name}"></p>
                        <p><input type="text" name="profile" placeholder="profile" value="${author_row[0].profile}"></p>
                        <p><input type="submit" value="update"></p>
                    </form>
                `;
                const html = template.HTML(title, list, control, body);

                response.writeHead(200, {'Content-Type' : 'text/html'});
                response.write(html);
                response.end();
            });
        });
    });
}

exports.update_process = function(request, response) {
    let body = '';
    request.on('data', function(data) {
        body = body + data;
    });
    request.on('end', function() {
        const post = qs.parse(body);

        db.query('UPDATE author SET name=?, profile=? WHERE id=?', [post.name, post.profile, post.id], function(error, result) {
            if(error) {
                throw error;
            }
            response.writeHead(302, {Location: '/author'});
            response.end();
        });
    });
}

exports.delete_process = function(request, response) {
    let body = '';
    request.on('data', function(data) {
        body = body + data;
    });
    request.on('end', function() {
        const post = qs.parse(body);

        db.query('DELETE FROM topic WHERE author_id=?', [post.id], function(error_1, result_1) {
            if(error_1) {
                throw error_1;
            }
            db.query('DELETE FROM author WHERE id=?', [post.id], function(error_2, result_2) {
                if(error_2) {
                    throw error_2;
                }
                response.writeHead(302, {Location: '/author'});
                response.end();
            });
        });
    });
}