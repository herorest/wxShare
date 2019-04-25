const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');


class FileService extends Service {
    tokenFile: path.resolve('/app/token.txt'),
    ticketFile: path.resolve('/app/token.txt'),

    async read(type) {

        let data = await readAsync('./package.json')
        data = JSON.parse(data)
        console.log(data.name)
    }

    async write(type) {
        const result = await this.ctx.curl(`http://photoserver/uid=${uid}`, {
            dataType: 'json'
        });
        return result.data;
    }
}
module.exports = FileService;