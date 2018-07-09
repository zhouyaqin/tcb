const env = require('./config.js');

const Base64 = require('./Base64.js');

require('./hmac.js');
require('./sha1.js');
const Crypto = require('./crypto.js');


const uploadFile = function (option, cb) {
    var filePath = option.filePath || "",
        fileW = option.fileW || "",
        fileType = option.fileType || ".jpg";

    if (!filePath || filePath.length < 9) {
        wx.showModal({
            title: '文件错误',
            content: '请重试',
            showCancel: false,
        })
        return;
    }

    const uuID = getUUID();
    //const aliyunFileKey = fileW+filePath.replace('wxfile://', '')；
    const fileId = (new Date().getTime()) + uuID;
    const aliyunFileKey = fileW + '' + (new Date().getTime()) + uuID + fileType;
    const aliyunServerURL = env.aliyunServerURL;
    const OSSAccessKeyId = env.OSSAccessKeyId;
    const policyBase64 = getPolicyBase64();
    const signature = getSignature(policyBase64);

    wx.uploadFile({
        url: aliyunServerURL,
        filePath: filePath,
        name: 'file',
        formData: {
            'key': aliyunFileKey,
            'OSSAccessKeyId': OSSAccessKeyId,
            'policy': policyBase64,
            'Signature': signature,
            'success_action_status': '200',
        },
        success: function (res) {
            if (res.statusCode != 200) {
                cb && cb.error && cb.error(new Error('上传错误:' + JSON.stringify(res)));
                return;
            }
            cb && cb.success && cb.success({fileId: fileId});
        },
        fail: function (err) {
            err.wxaddinfo = aliyunServerURL;
            cb && cb.error && cb.error(err);
        },
        complete: function(res){
            cb && cb.complete && cb.complete();
        }
    })
}

const getPolicyBase64 = function () {
    let date = new Date();
    date.setHours(date.getHours() + env.timeout);
    let srcT = date.toISOString();
    const policyText = {
        "expiration": srcT, //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了 指定了Post请求必须发生在2020年01月01日12点之前("2020-01-01T12:00:00.000Z")。
        "conditions": [
            ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制,1048576000=1000mb
        ]
    };

    const policyBase64 = Base64.encode(JSON.stringify(policyText));
    return policyBase64;
}

const getSignature = function (policyBase64) {
    const accesskey = env.AccessKeySecret;

    const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
        asBytes: true
    });
    const signature = Crypto.util.bytesToBase64(bytes);

    return signature;
}

const getUUID = function(){
    function S4() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
}

module.exports = uploadFile;