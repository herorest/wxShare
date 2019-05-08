const Controller = require('egg').Controller;

class GetTicketController extends Controller {
    async getToken(ctx, config){
        let timestamp = new Date().valueOf();
        let cache = await this.ctx.service.fileService.read('token');
        let result = cache;

        // 缓存失效
        if (!cache || cache.expires_in < timestamp || cache.app_id !== config.wx.appId) {
            result = await ctx.curl(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.wx.appId}&secret=${config.wx.secret}`, {
                dataType: 'json'
            });
            if (this.ctx.helper.checkResponse(result)) {
                result = {
                    access_token: result.data.access_token,
                    expires_in: timestamp + result.data.expires_in * 1000,
                    app_id: config.wx.appId
                };
                this.ctx.service.fileService.write('token', result);               
            } else {
                this.ctx.service.fileService.write('token', '');
                this.ctx.logger.error(new Error(`${timestamp}--wxconfig: ${JSON.stringify(config.wx)}--tokenResult: ${JSON.stringify(result)}`));
                result = null;
            }
        }

        return result;
    }

    async getTicket(ctx, config, res){
        let timestamp = new Date().valueOf();
        let cache = await this.ctx.service.fileService.read('ticket');
        let result = cache;

        // 缓存失效
        if (!cache || cache.expires_in < timestamp || cache.app_id !== config.wx.appId) {
            result = await ctx.curl(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${res.access_token}&type=jsapi`, {
                dataType: 'json'
            });
            if (this.ctx.helper.checkResponse(result)) {
                result = {
                    ticket: result.data.ticket,
                    expires_in: timestamp + result.data.expires_in * 1000,
                    app_id: config.wx.appId
                };
                this.ctx.service.fileService.write('ticket', result); 
            } else {
                this.ctx.service.fileService.write('ticket', '');
                this.ctx.logger.error(new Error(`${timestamp}--wxconfig: ${JSON.stringify(config.wx)}--jsapiResult: ${JSON.stringify(jsapiResult)}`));
                result = null;
            }
        }

        return result;
    }

    async index() {
        const { ctx, config } = this;

        let res = {
            code: 200,
            msg: '获取成功'
        };

        let result = await this.getToken(ctx, config);

        if(result){

            if(result.app_id === config.wx.appId){
                result = await this.getTicket(ctx, config, result);                
            }else{
                result = null;
            }

        }else{
            res = {
                code: 500,
                msg: '获取token失败'
            }
        }

        let url = decodeURIComponent(ctx.request.body.url, "UTF-8");
        
        if(!url){
            res = {
                code: 500,
                msg: '获取url失败'
            };
            result = null;
        }

        if(result){
            let data = this.ctx.helper.sign(result.ticket, url, config.wx.appId);
            res = {
                code: 0,
                data
            };
        }else{
            res = {
                code: 500,
                msg: '获取ticket失败'
            }
        }

        this.ctx.body = res;
    }
}

module.exports = GetTicketController;
