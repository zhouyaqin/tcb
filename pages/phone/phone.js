
// 获取全局应用程序实例对象
var app = getApp();


// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '同城帮-更换手机号',
            path: '/pages/phone/phone'
        }
    },
    /**
     * 页面名称
     */
    name: "phone",
    /**
     * 页面的初始数据
     */

    data: {
        isSubmit: true,
        isDisabled: true,
        codeText: '获取验证码',
        telephone: '',
        code: '',  
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad() {
        var that = this;   

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
    // 获取手机号
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
    // 获取code
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
    // 修改手机号码
    onUpdatePhone: function(){
        var that = this,
            data = that.data,
            telephone = data.telephone,
            code = data.code;

        if(!app.checkPhone(telephone)){
            return;
        }

        app.changeTelephone({
            telephone: telephone,
            code: code
        },{
            success: function(res){
                app.onShowModal({
                    content: res.msg,
                    showCancel: false,
                }, function(){
                    wx.navigateBack({
                      delta: -1
                    })
                });
            },
            error: function(res){
                app.showFailMsg(res.msg);
            }
        });
    }
});
