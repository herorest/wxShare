const Controller = require('egg').Controller;

class GetTicketController extends Controller {
    async index() {
        const { ctx, config } = this;
        let timestamp = new Date().valueOf();
        let res = {
            code: 200,
            msg: '获取成功'
        };

        let result = await this.ctx.service.fileService.read('token');
        if (!result || result.expires_in < timestamp || result.app_id !== config.wx.appId) {
            const tokenResult = await ctx.curl(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.wx.appId}&secret=${config.wx.secret}`, {
                dataType: 'json'
            });
            if (tokenResult.status === 200 && tokenResult.data && tokenResult.data.access_token) {
                result = {
                    access_token: tokenResult.data.access_token,
                    expires_in: timestamp + tokenResult.data.expires_in * 1000,
                    app_id: config.wx.appId
                };
                this.ctx.service.fileService.write('token', result);               
            } else {
                this.ctx.service.fileService.write('token', '');
                this.ctx.logger.error(new Error(`${timestamp}--wxconfig: ${JSON.stringify(config.wx)}--tokenResult: ${JSON.stringify(tokenResult)}`));
                res = {
                    code: 500,
                    msg: '获取token失败'
                }
            }
        }

        if(result && result.app_id === config.wx.appId){
            timestamp = new Date().valueOf();
            result = await this.ctx.service.fileService.read('ticket');
            if (!result || result.expires_in < timestamp || result.app_id !== config.wx.appId) {
                const jsapiResult = await ctx.curl(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${ctx.session.tokenObj.access_token}&type=jsapi`, {
                    dataType: 'json'
                });
                if (jsapiResult.status === 200 && jsapiResult.data && jsapiResult.data.errcode === 0) {
                    result = {
                        ticket: jsapiResult.data.ticket,
                        expires_in: timestamp + jsapiResult.data.expires_in * 1000,
                        app_id: config.wx.appId
                    };
                    this.ctx.service.fileService.write('ticket', result); 
                } else {
                    this.ctx.service.fileService.write('ticket', '');
                    this.ctx.logger.error(new Error(`${timestamp}--wxconfig: ${JSON.stringify(config.wx)}--jsapiResult: ${JSON.stringify(jsapiResult)}`));
                    res = {
                        code: 500,
                        msg: '获取ticket失败'
                    }
                }
            }
        }
        
        if(result){
            const crypto = require('crypto');
            // 生成并返回RFC4122 v1（基于时间戳的）UUID
            const uuidv1 = require('uuid/v1');

            const jsapi_ticket = result.ticket;
            const noncestr = uuidv1();
            timestamp = new Date().valueOf();
            const { url } = ctx.query;
            const string1 = `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
            const hash = crypto.createHash('sha1');
            hash.update(string1);
            const signature = hash.digest('hex');
            res = {
                code: 0,
                data: {
                    nonceStr: noncestr,
                    timestamp,
                    signature,
                    appId: config.wx.appId,
                    jsapi_ticket,
                    string1
                }
            };
        }

        this.ctx.body = res;
    }
}

module.exports = GetTicketController;
