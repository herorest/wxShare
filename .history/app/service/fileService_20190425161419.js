const Service = require('egg').Service;
class fileService extends Service {
    async read() {
        
    }

    async write(uid) {
        const result = await this.ctx.curl(`http://photoserver/uid=${uid}`, {
            dataType: 'json'
        });
        return result.data;
    }
}
module.exports = fileService;