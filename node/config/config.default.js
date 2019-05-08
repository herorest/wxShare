module.exports = {
    // 配置需要的中间件，数组顺序即为中间件的加载顺序
    middleware: ['gzip'],

    // 配置 gzip 中间件的配置
    gzip: {
        threshold: 1024, // 小于 1k 的响应体不压缩
    },

    wx: {
        appId: "wx256579a53382476b",
        secret: "42402dfdb9e4210a7cd5895b14a3070f"
    },

    keys: '41ZO3MhKoyN5OfkWITDGgnr2',
     
    view: {
        mapping: {'.html': 'ejs'}
    },
};