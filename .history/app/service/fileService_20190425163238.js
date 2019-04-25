const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');
const tokenFile = path.resolve('/app/token.txt');
const ticketFile = path.resolve('/app/token.txt');

class FileService extends Service {

    async read(type) {
        let src = type === 'token' ? tokenFile : ticketFile;
        let data = await this.ctx.helper.readFile(src);
        data = JSON.parse(data)
        console.log(data)
    }

    async write(type, text) {
        let src = type === 'token' ? tokenFile : ticketFile;
        const result = await this.ctx.helper.writeFile(src, text);
        return result;
    }
}
module.exports = FileService;