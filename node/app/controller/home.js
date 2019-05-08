const Controller = require('egg').Controller;

class HomeController extends Controller {
    async index() {
        const { ctx } = this;
        let title = "我是首页";
        await ctx.render('index',{
            title: title
        });
    }
}

module.exports = HomeController;