const Controller = require('egg').Controller;
const path = require('path');

class CheckController extends Controller {
    async index() {
        let cache = await this.ctx.helper.readFile(path.join(this.config.baseDir, 'app/MP_verify_ysZJMVdQxMoU8v35.txt'));
        this.ctx.body = cache;
    }
}

module.exports = CheckController;