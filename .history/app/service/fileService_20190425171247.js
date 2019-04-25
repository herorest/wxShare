const Service = require('egg').Service;
const path = require('path');

class FileService extends Service {
    constructor(ctx) {
        super(ctx); 
        this.tokenFile = path.join(this.config.baseDir, `app/token.txt`);
        this.ticketFile = path.join(this.config.baseDir, `app/ticket.txt`);
    }
    async read(type) {
        let src = type === 'token' ? this.tokenFile : this.ticketFile;
        let data = await this.ctx.helper.readFile(src);
        return data;
    }

    async write(type, text) {
        let src = type === 'token' ? this.tokenFile : this.ticketFile;
        let result = await this.ctx.helper.writeFile(src, text);
        console.log('===', result);
    }
}
module.exports = FileService;