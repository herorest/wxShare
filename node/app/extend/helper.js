const fs = require('fs');

// 排序拼接
var raw = function (args) {
    var keys = Object.keys(args);
    var newArgs = {};
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key];
    });
    var string = '';
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
};

/**
 * 签名算法 
 * crypto 提供通用的加密和哈希算法
 *
 * @param jsapi_ticket 用于签名的 jsapi_ticket
 * @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
 *
 */
var sign = function (jsapi_ticket, url, appId) {
    const uuidv1 = require('uuid/v1');
    const noncestr = uuidv1();
    const timestamp = Math.round(new Date().valueOf() / 1000);
    const string1 = `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
    const crypto = require('crypto');
    const hash = crypto.createHash('sha1');
    hash.update(string1);
    const signature = hash.digest('hex');
    return {
        nonceStr: noncestr,
        timestamp,
        signature,
        appId: appId,
        jsapi_ticket,
        url,
        string1
    };
};

var readFile = function (src) {
    return new Promise((resolve, reject) => {
        fs.readFile(src, 'utf-8', (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

var writeFile = function(src, text){
    return new Promise((resolve, reject) => {
        fs.writeFile(src, text, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}

var checkResponse = function(result){
    if (result.status === 200 && result.data){
        return true;
    }
    return false;
}

module.exports = {
    sign, 
    readFile,
    writeFile,
    checkResponse
};