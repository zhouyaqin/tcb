
// 获取全局应用程序实例对象
var app = getApp();


// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '同城帮-发布',
            path: '/pages/release/release'
        }
    },
    /**
     * 页面名称
     */
    name: "release",
    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        classifyList: []   
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
        var that = this,
            userInfo = wx.getStorageSync("userInfo");

            that.setData({
                userInfo: userInfo
            });

        that.getCategoryByRegion();
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
    /*
     * 用户点击右上角转发
     */
    onShareAppMessage: function () {
       // return custom share data when user share.
    },
    /*
     * 页面滚动触发事件的处理函数
     */
    onPageScroll: function() {
        // Do something when page scroll
    },
    /**
     * 当前是 tab 页时，点击 tab 时触发
     */ 
    onTabItemTap(item) {
        console.log(item.index)
        console.log(item.pagePath)
        console.log(item.text)
    },
    /**
      * 获取根据所在区域获取帖子类别
      */
     getCategoryByRegion: function(){
        var that = this,
            region = that.data.userInfo.adcode;

        app.getCategoryByRegion({
          region: region 
        }, {
            success: function(res){
              var data = res.data;

                  if(data.length){
                     that.setData({
                        classifyList: data
                     });
                  }
                   
            },
            error: function(res){
               console.log(res.msg);
            }
        });
     }
});
