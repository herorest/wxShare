const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');
const tokenFile = path.resolve('/app/token.txt');
const ticketFile = path.resolve('/app/token.txt');

class FileService extends Service {

    async read(type) {
        this.ctx.helper.readFile();

        let data = await fs.readFile(dir,'utf-8',(err,data)=>{(tokenFile)
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