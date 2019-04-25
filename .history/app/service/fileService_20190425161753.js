const Service = require('egg').Service;
const fs = require('fs');


class FileService extends Service {
    async read() {
        let data = await readAsync('./package.json')
        data = JSON.parse(data)
        console.log(data.name)
    }

    async write(uid) {
        const result = await this.ctx.curl(`http://photoserver/uid=${uid}`, {
            dataType: 'json'
        });
        return result.data;
    }
}
module.exports = FileService;