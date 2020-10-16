module.exports = {
    HTML: function(title, list, control, body) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>WEB | ${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">WEB</a></h1>
                ${list}
                ${control}
                ${body}
            </body>
            </html>
        `;
    }, list: function(topic_list) {
        let list = '<ul>';
        for(let i=0; i<topic_list.length; i++) {
            list = list + `<li><a href="/?id=${topic_list[i].id}">${topic_list[i].title}</a></li>`;
        }
        list = list + '</ul>';

        return list;
    }, authorSelect: function(author_list, author_id) {
        let tag = '';
        for(let i=0; i<author_list.length; i++) {
            let selected = '';
            if(author_list[i].id === author_id) {
                selected = ' selected';
            }
            tag = tag + `<option value="${author_list[i].id}"${selected}>${author_list[i].name}</option>`;
        }

        return `
            <select name="author">
                ${tag}
            </select>
        `;
    }
}