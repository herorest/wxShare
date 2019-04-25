const Controller = require('egg').Controller;

class GetTicketController extends Controller {
    async index() {
        const { ctx, config } = this;
        let timestamp = new Date().valueOf();

        let result = this.ctx.service.fileService.read('token');

        // 判断缓存里是否有access_token且没有过期,并且获取该access_token时的appId与现在的一致，判断appId是为了避免切换不同公众号配置时没有清缓存出现错误
        if (!result || result.expires_in < timestamp || result.app_id !== config.wx.appId) {
            const tokenResult = await ctx.curl(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.wx.appId}&secret=${config.wx.secret}`, {
                dataType: 'json'
            });
            if (tokenResult.status === 200 && tokenResult.data && tokenResult.data.access_token) {
                let tokenInfo = {
                    access_token: tokenResult.data.access_token,
                    expires_in: timestamp + tokenResult.data.expires_in * 1000,
                    app_id: config.wx.appId
                };
                this.ctx.service.fileService.write('token', tokenInfo);
            } else {
                this.ctx.service.fileService.write('token', '');
                ctx.logger.error(new Error(`${timestamp}--wxconfig: ${JSON.stringify(config.wx)}--tokenResult: ${JSON.stringify(tokenResult)}--jsapiResult: ${JSON.stringify(jsapiResult)}`));
            }
        }

        // timestamp = new Date().valueOf();
        // // 判断缓存里是否有jsapi_ticket且没有过期,并且获取该jsapi_ticket时的appId与现在的一致,判断appId是为了避免切换不同公众号配置时没有清缓存出现错误
        // // 如果以上条件不能同时满足，则重新请求access_token
        // if (!ctx.session.jsapiObj || ctx.session.jsapiObj.expires_in < timestamp || ctx.session.jsapiObj.app_id !== config.wx.appId) {
        //     const jsapiResult = await ctx.curl(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${ctx.session.tokenObj.access_token}&type=jsapi`, {
        //         dataType: 'json'
        //     });
        //     if (jsapiResult.status === 200 && jsapiResult.data && jsapiResult.data.errcode === 0) {
        //         ctx.session.jsapiObj = {
        //             ticket: jsapiResult.data.ticket,
        //             expires_in: timestamp + jsapiResult.data.expires_in * 1000,
        //             app_id: config.wx.appId
        //         };
        //         ctx.logger.error(new Error(`jsapiResult:success: ${JSON.stringify(jsapiResult)}`));
        //     } 
        // }

        // const jsapi_ticket = ctx.session.jsapiObj.ticket;
        // const uuidv1 = require('uuid/v1');
        // const noncestr = uuidv1();
        // timestamp = new Date().valueOf();
        // const { url } = ctx.query;
        // const string1 = `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
        // const crypto = require('crypto');
        // const hash = crypto.createHash('sha1');
        // hash.update(string1);
        // const signature = hash.digest('hex');
        // res = {
        //     code: 0,
        //     data: {
        //         nonceStr: noncestr,
        //         timestamp,
        //         signature,
        //         appId: config.wx.appId,
        //         jsapi_ticket,
        //         string1
        //     }
        // };
    }
}

module.exports = GetTicketController;
