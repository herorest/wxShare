const Service = require('egg').Service;
const path = require('path');
const tokenFile = path.join(this.config.baseDir, `app/token.txt`);
const ticketFile = path.join(this.config.baseDir, `app/ticket.txt`);

class FileService extends Service {

    async read(type) {
        let src = type === 'token' ? tokenFile : ticketFile;
        console.log(src);
        let data = await this.ctx.helper.readFile(src);
        data = JSON.parse(data)
        console.log(data)
    }

    async write(type, text) {
        let src = type === 'token' ? tokenFile : ticketFile;
        let result = await this.ctx.helper.writeFile(src, text);
        console.log('===', result);
    }
}
module.exports = FileService;