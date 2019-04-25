const Service = require('egg').Service;
const path = require('path');

class FileService extends Service {
    constructor(ctx) {
        super(ctx); 
        this.tokenFile = path.join(this.config.baseDir, `app/token.txt`);
        this.ticketFile = path.join(this.config.baseDir, `app/ticket.txt`);
    }
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