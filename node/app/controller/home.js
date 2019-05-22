const Controller = require('egg').Controller;

class HomeController extends Controller {
    async index() {
        const { ctx } = this;
        let title = "我是首页";
        // console.log(ctx.app.cache, ctx.app.foo());
        await ctx.render('index',{
            title: title
        });
    }
}

module.exports = HomeController;