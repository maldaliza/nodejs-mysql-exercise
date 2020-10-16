const http = require('http');
const url = require('url');
const topic = require('./lib/topic.js');

const server = http.createServer(function(request, response) {
    const pathname = url.parse(request.url, true).pathname;
    const query = url.parse(request.url, true).query;

    if(pathname === '/') {
        if(query.id === undefined) {
            topic.home(request, response);
        } else {
            topic.page(request, response);
        }
    } else if(pathname === '/create') {
        topic.create(request, response);
    } else if(pathname === '/create_process') {
        topic.create_process(request, response);
    } else if(pathname === '/update') {
        topic.update(request, response);
    } else if(pathname === '/update_process') {
        topic.update_process(request, response);
    } else if(pathname === '/delete_process') {
        topic.delete_process(request, response);
    } else {
        response.writeHead(404, {'Content-Type' : 'text/html'});
        response.write('Not found');
        response.end();
    }
});
server.listen(3000);