
// 获取全局应用程序实例对象
var app = getApp();


// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '同城帮-我的',
            path: '/pages/me/me'
        }
    },
    /**
     * 页面名称
     */
    name: "me",
    /**
     * 页面的初始数据
     */

    data: {
        userInfo: {}       
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
        this.getUserInfo();
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
    // 获取用户信息
    getUserInfo: function(){
        var that = this;
        app.getUserInfo({},{
            success: function(res){
                var data = res.data;
                data.isParter = data.isParter?true:false;
                that.setData({
                    userInfo: data
                });
            },
            error: function(){

            }
        });
    }
});
