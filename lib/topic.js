const url = require('url');
const qs = require('querystring');
const mysql = require('mysql');
const db = require('./db.js');
const template = require('./template.js');

exports.home = function(request, response) {
    db.query('SELECT * FROM topic', function(error, topic_list) {
        if(error) {
            throw error;
        }
        const title = 'Welcome';
        const description = 'Hello, Node.js';
        const list = template.list(topic_list);
        const control = '<a href="/create">create</a>';
        const body = `
            <h2>${title}</h2>
            <p>${description}</p>
        `;
        const html = template.HTML(title, list, control, body);

        response.writeHead(200, {'Content-Type' : 'text/html'});
        response.write(html);
        response.end();
    });
}

exports.page = function(request, response) {
    const query = url.parse(request.url, true).query;
    db.query('SELECT * FROM topic', function(error_1, topic_list) {
        if(error_1) {
            throw error_1;
        }
        db.query('SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?', [query.id], function(error_2, topic_row) {
            if(error_2) {
                throw error_2;
            }
            const title = topic_row[0].title;
            const description = topic_row[0].description;
            const list = template.list(topic_list);
            const control = `
                <a href="/create">create</a>
                <a href="/update?id=${query.id}">update</a>
                <form action="/delete_process" method="POST">
                    <input type="hidden" name="id" value="${query.id}">
                    <input type="submit" value="delete">
                </form>
            `;
            const body = `
                <h2>${title}</h2>
                <p>${description}</p>
                <p>by ${topic_row[0].name}</p>
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
            const title = 'Create';
            const list = template.list(topic_list);
            const control = '';
            const body = `
                <form action="/create_process" method="POST">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p><textarea name="description" placeholder="description" cols="30" rows="10"></textarea></p>
                    <p>${template.authorSelect(author_list)}</p>
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

        db.query('INSERT INTO topic (title, description, created, author_id) VALUES (?, ?, NOW(), ?)', [post.title, post.description, post.author], function(error, result) {
            if(error) {
                throw error;
            }
            response.writeHead(302, {Location: `/?id=${result.insertId}`});
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
            db.query('SELECT * FROM topic WHERE id=?', [query.id], function(error_3, topic_row) {
                if(error_3) {
                    throw error_3;
                }
                const title = `Update - ${topic_row[0].title}`;
                const list = template.list(topic_list);
                const control = '';
                const body = `
                    <h2>${title}</h2>
                    <form action="/update_process" method="POST">
                        <input type="hidden" name="id" value="${topic_row[0].id}">
                        <p><input type="text" name="title" placeholder="title" value="${topic_row[0].title}"></p>
                        <p><textarea name="description" placeholder="description" cols="30" rows="10">${topic_row[0].description}</textarea></p>
                        <p>${template.authorSelect(author_list, topic_row[0].author_id)}</p>
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

        db.query('UPDATE topic SET title=?, description=?, created=NOW(), author_id=? WHERE id=?', [post.title, post.description, post.author, post.id], function(error, result) {
            if(error) {
                throw error;
            }
            response.writeHead(302, {Location: `/?id=${post.id}`});
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

        db.query('DELETE FROM topic WHERE id=?', [post.id], function(error, result) {
            if(error) {
                throw error;
            }
            response.writeHead(302, {Location: '/'});
            response.end();
        });
    });
}