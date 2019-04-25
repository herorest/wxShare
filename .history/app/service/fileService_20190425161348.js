const Service = require('egg').Service;
class UserService extends Service {
    async find(uid) {
        // 假如 我们拿到用户 id 从数据库获取用户详细信息
        const user = await this.ctx.db.query('select * from user where uid = ?', uid);

        // 假定这里还有一些复杂的计算，然后返回需要的信息。
        const picture = await this.getPicture(uid);

        return {
            name: user.user_name,
            age: user.age,
            picture,
        };
    }

    async getPicture(uid) {
        const result = await this.ctx.curl(`http://photoserver/uid=${uid}`, {
            dataType: 'json'
        });
        return result.data;
    }
}
module.exports = UserService;