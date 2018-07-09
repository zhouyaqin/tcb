
const uploadImage = require('../../libs/oss/uploadAliyun.js');

// 获取全局应用程序实例对象
var app = getApp();


// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '同城帮-发布',
            path: '/pages/releaseinfo/releaseinfo'
        }
    },
    /**
     * 页面名称
     */
    name: "releaseinfo",
    /**
     * 页面的初始数据
     */
    fileId: [],
    data: {
        isSubmit: true,
        isTop: false,
        isDisabled: true,
        isVeriAuth: true,
        remainNum: 0,
        totalFee: 0,
        telephone: '',
        codeText: '获取验证码',
        code: '',
        content: '',
        daysIndex: 0,
        days: 0,
        daysArr: [],
        cost: 0,
        newsCost: 0,
        stick: 0,
        longitude: '',
        latitude: '',
        location: '',
        categoryId: 0,
        categoryName: '',
        region: 440309,
        placeholderText: '请填写反馈内容',
        files: []   
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(option) {
        var that = this;   
        if(option['categoryId'] && option['categoryName']){
            wx.setNavigationBarTitle({
                title: option['categoryName']+' - 发布'
            });
            that.setData({
                categoryId: option['categoryId'],
                categoryName: option['categoryName']
            });
        }

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function onReady() { 

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function onShow() {
        var that = this;
        
        that.getUserInfo(function(info) {
            if(info.telephone!=""){
                that.setData({
                    telephone: info.telephone,
                    isVeriAuth: false
                });
            }else{
                that.setData({
                    isVeriAuth: true
                });
            }
        });
        that.getNewsRemainNum();
        that.getStickPeriod();

        app.getCurrentLocation({
            success: function (postion) {
                app.getCurrentAddress([postion.longitude, postion.latitude], function(regeo){
                    var regeocode = regeo.regeocode,
                        location = regeocode.formatted_address||"";
                    that.setData({
                        longitude: postion.longitude,
                        latitude: postion.latitude,
                        location: location,
                        locationName: app.splitContent(location, 15)
                    });
                });
            }
        });

    },
    
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function onUnload() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function onPullDownRefresh() {
        wx.stopPullDownRefresh();
    },
    /*
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        // Do something when page reach bottom.
    },
    getInputPhone: function(e){
        var that = this,
            telephone = e.detail.value;
            if(telephone!="" && telephone.length>=11){
                that.setData({
                    telephone: telephone,
                    isDisabled: false
                });
            }
    },
    getInputCode: function(e){
        var that = this,
            code = e.detail.value;
            if(code!=""){
                that.setData({
                    code: code,
                    isSubmit: false
                });
            }
    },
    getInputContent: function(e){
        var that = this,
            content = e.detail.value;
            if(content!=""){
                that.setData({
                    content: content,
                    isSubmit: false
                });
            }else{
                that.setData({
                    isSubmit: true
                });
            }
    },
    // 获取验证码
    getAuthCode: function(){
        var that = this,
            time = 60,
            telephone = that.data.telephone;

        if(!app.checkPhone(telephone)){
            return;
        }

        setTime();
        function setTime(){
            if(time == 0){
                that.setData({
                    codeText: "获取验证码",
                    isDisabled: false
                });
                time = 60;
                return;
            }else{
                that.setData({
                    codeText: time + "s后重新获取",
                    isDisabled: true
                });
                time--;
            }
            setTimeout(function(){
                setTime();
            }, 1000);
        }

        app.getAuthCode({
            telephone: telephone
        },{
            success: function(res){
                var data = res.data;
            },
            error: function(res){
                app.showFailMsg(res.msg);
            }
        });

    },
    imageHandler: function(e) {
        var that = this,
            url = e.currentTarget.id;
            wx.previewImage({
                current: url, // 当前显示图片的http链接
                urls: that.data.files // 需要预览的图片http链接列表
            });
    },
    switchChange: function(e){
        var that = this,
            data = that.data,
            value = e.detail.value,
            totalFee = data.totalFee,
            option = { isTop: false, stick: 0 };

            if(value){
                option = { isTop: true, stick: 1, totalFee: (data.cost+data.newsCost)};
            }else{
                option = { isTop: false, stick: 0, totalFee: data.newsCost};
            }
            that.setData(option);
    },
    // 选择天数
    bindPickerChange: function(e){
        var that = this,
            data = that.data,
            daysArr = that.data.daysArr,
            index = e.detail.value;
            that.setData({
                daysIndex: index,
                days: daysArr[index].period,
                cost: daysArr[index].price,
                totalFee: (daysArr[index].price+data.newsCost)
            });
    },
    // 选择位置
    chooseLocation: function(){
        var that = this;
        wx.chooseLocation({
            success: function(res){
                if (res) {
                    that.setData({
                        longitude: res.longitude,
                        latitude: res.latitude,
                        location: res.address,
                        locationName: app.splitContent(res.address, 15)
                    });
                    app.getCurrentAddress([res.longitude, res.latitude], function(rs){
                         var regeocode = rs.regeocode,
                             addressComponent = regeocode.addressComponent,
                             adcode = addressComponent.adcode;
                             that.setData({
                                region: adcode
                             });          
                    });
                }
            }
        });
    }, 
    /*
     * 选择图片
    */
    chooseImage: function (e) {
        var that = this, fileId = that.fileId;
            if(fileId.length < 9){
                wx.chooseImage({
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                        var tempFilePaths = res.tempFilePaths;
                        that.uploadFile({path: tempFilePaths});
                    }
                });
            }else{
                app.showFailMsg("最多只能上传9张图片");
                return;
            }
    },
    /*
     * 上传文件
     */
    uploadFile: function(data){
        var that = this,
            i = data.i ? data.i : 0,
            success = data.success ? data.success : 0,
            fail = data.fail ? data.fail : 0;

            uploadImage({
                filePath: data.path[i]
            },
            {
                success: function(res){
                    var filesArr = that.data.files.concat(data.path[i]);
                        success++;
                        that.fileId.push(res.fileId);
                        that.setData({
                            files: filesArr
                        });
                },
                error: function(res){
                    fail++;
                    console.log(data.path[i]);
                },
                complete: function(res){
                    i++;
                    if(i==data.path.length){
                        console.log("成功：" + success + ",失败：" + fail);
                    }else{
                        data.i = i;
                        data.success = success;
                        data.fail = fail;
                        that.uploadFile(data);
                    }
                }
            });
    },
    /* 
     * 发布帖子
     */
    releaseNews: function(){
        var that = this,
            data = that.data,
            userInfo = wx.getStorageSync('userInfo'),
            adcode = userInfo.adcode,
            isVeriAuth = data.isVeriAuth,
            fee = data.totalFee,
            option = {
                stick: data.stick,
                telephone: data.telephone,
                userId: userInfo.userId,
                categoryId: data.categoryId,
                content: data.content,
                location: data.location,
                longitude: data.longitude,
                latitude: data.latitude,
                region: adcode,
                imgs: that.fileId.join(",")
            };

        if(that.fileId.length >9){
            app.showFailMsg("最多只能上传9张图片");
            return;
        }

        if(data.location=="" || data.longitude=="" || data.latitude==""){
            app.showFailMsg("选择发帖位置");
            return;
        }

        if(data.stick == '1'){
            if(!data.days || data.days==''){
                app.showFailMsg("置顶天数不能空");
                return;
            }
            option.days = data.days;
            option.cost = fee;
        }
        if(isVeriAuth){
            if(!app.checkPhone(data.telephone)){
                return;
            }
            if(data.code==""){
                app.showFailMsg("请输入验证码");
                return;
            }
            that.veriAuthCode(data.telephone, data.code, function(){
                that.payForStickSubmit(data, fee, option);
            });
        }else{
            that.payForStickSubmit(data, fee, option);
        }
    },
    payForStickSubmit: function(data, fee, option){
        var that = this,
            remainNum = data.remainNum;

        if(data.stick == '1'){
            that.payForStick(fee, function(rs){
                that.onPayment(rs, function(){
                    that.submitRelease(option);
                });
            });
        }else{
            if(remainNum==0 || remainNum=='0'){
                that.payForStick(fee, function(rs){
                    that.onPayment(rs, function(){
                        option.cost = fee;
                        that.submitRelease(option);
                    });
                });
            }else{
                that.submitRelease(option);
            }
        }
    },
    // 验证手机短信验证码
    veriAuthCode: function(telephone, code, callback){
        var that = this;
        app.veriAuthCode({
            telephone: telephone,
            code: code
        }, {
            success: function(res){
                typeof callback === 'function' && callback();
            },
            error: function(res){
                app.showFailMsg(res.msg);
            }
        });
    },
    // 获取金额
    getStickPeriod: function() {
        var that = this,
            categoryId = that.data.categoryId;
        app.getStickPeriod({
            categoryId: categoryId
        },{
            success: function(res){
                var data = res.data;
                if(data){
                   var option = {
                        daysArr: data,
                        daysIndex: 0,
                        days: data[0].period,
                        cost: data[0].price
                   };
                   that.setData(option);
                }
            },
            error: function(res){
                app.showFailMsg(res.msg);
            }
        });
    },
    // 提交发布
    submitRelease: function(option){
        var that = this, remainNum = that.data.remainNum;
        wx.showLoading();
        app.releaseNews(option, {
            success: function(res){
                wx.hideLoading();
                var remain = (remainNum-1)>0?(remainNum-1):0;
                var msg = '您今天免费发布次数还有' + remain + '条';
                app.onShowModal({
                    title: '恭喜你，内容发布成功！',
                    content: msg,
                    cancelText: '返回首页',
                    confirmText: '继续发布'
                }, function(){
                    that.setData({
                        files: [],
                        content: ''
                    });
                    that.fileId = [];
                    that.getNewsRemainNum();
                }, function(){
                    wx.switchTab({
                        url: "/pages/index/index"
                    });
                });
            },
            error: function(res){
                wx.hideLoading();
                app.showFailMsg(res.msg);
            }
        });
    },
    // 获取支付
    payForStick: function(fee, callback){
        var that = this;
        app.payForStick({
            fee: fee
        },{
            success: function(res){
                var data = res.data;
                if(data){
                   typeof callback === 'function' && callback(data);
                }
            },
            error: function(res){
                app.showFailMsg(res.msg)
            }
        });
    },
    onPayment: function(data, callback){
         wx.requestPayment({
             'timeStamp': data.timeStamp,
             'nonceStr': data.nonceStr,
             'package': data.package,
             'signType': data.signType,
             'paySign': data.paySign,
             success:function(res){
                typeof callback === 'function' && callback();
             },
             fail:function(res){
                if(res.errMsg == "requestPayment:fail cancel"){
                    app.showFailMsg("支付取消");
                }else{
                    app.showFailMsg(res.err_desc);
                }
             }
        })
    },
    // 获取用户信息
    getUserInfo: function(callback){
        var that = this;
        app.getUserInfo({},{
            success: function(res){
                var data = res.data;
                if(data){
                   typeof callback === 'function' && callback(data);
                }
            },
            error: function(){

            }
        });
    },
    // 获取当天剩余免费发帖数,0或负数表示已经用完额度
    getNewsRemainNum: function(){
        var that = this,
            categoryId = that.data.categoryId;
        app.getNewsRemainNum({
            categoryId: categoryId
        },{
            success: function(res){
                var data = res.data;
                if(data){
                    that.setData({
                        remainNum: data.remainNum || 0,
                        newsCost: data.cost,
                        totalFee: data.cost
                    })
                }
            }
        })
    }
});
