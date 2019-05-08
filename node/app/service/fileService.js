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
        data = JSON.parse(data);
        return data;
    }

    async write(type, data) {
        let src = type === 'token' ? this.tokenFile : this.ticketFile;
        let result = await this.ctx.helper.writeFile(src, JSON.stringify(data));
        console.log('===', result);
    }
}
module.exports = FileService;