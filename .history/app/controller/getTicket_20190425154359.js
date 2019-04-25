const Controller = require('egg').Controller;

class GetTicketController extends Controller {
    async index() {
        const { ctx, config } = this;
        let timestamp = new Date().valueOf();

        // 判断缓存里是否有access_token且没有过期,并且获取该access_token时的appId与现在的一致，判断appId是为了避免切换不同公众号配置时没有清缓存出现错误
        // 如果以上条件不能同时满足，则重新请求access_token
        if (!ctx.session.tokenObj || ctx.session.tokenObj.expires_in < timestamp || ctx.session.tokenObj.app_id !== config.wx.appId) {
            const tokenResult = await ctx.curl(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.wx.appId}&secret=${config.wx.secret}`, {
                dataType: 'json'
            });
            if (tokenResult.status === 200 && tokenResult.data && tokenResult.data.access_token) {
                ctx.session.tokenObj = {
                    access_token: tokenResult.data.access_token,
                    expires_in: timestamp + tokenResult.data.expires_in * 1000,
                    app_id: config.wx.appId
                };
            } else {
                // 记录请求错误日志，方便定位错误
                // 因为该缓存access_token已经不能使用，请求错误时记得把access_token缓存也清空。
                ctx.session.tokenObj = null;
                ctx.logger.error(new Error(`wxconfig: ${JSON.stringify(config.wx)}`));
                ctx.logger.error(new Error(`tokenResult: ${JSON.stringify(tokenResult)}`));
            }
        }
    }
}

module.exports = GetTicketController;
