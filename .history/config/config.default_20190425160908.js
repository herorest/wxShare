exports.keys = '41ZO3MhKoyN5OfkWITDGgnr2';

exports.wx = {
    appId: "wxe66c4eb254b2d970",
    secret: "7d6da5cb6bf87d4fdf73d101b8481533"
}

module.exports = {
    // 配置需要的中间件，数组顺序即为中间件的加载顺序
    middleware: ['gzip'],

    // 配置 gzip 中间件的配置
    gzip: {
        threshold: 1024, // 小于 1k 的响应体不压缩
    },
};