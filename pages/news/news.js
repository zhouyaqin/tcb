
// 获取全局应用程序实例对象
var app = getApp();


// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '同城帮-消息',
            path: '/pages/news/news'
        }
    },
    /**
     * 页面名称
     */
    name: "news",
    /**
     * 页面的初始数据
     */
    data: {
        attenAmount: 0, //关注未读数
        commentAmount: 0, //评论未读数
        likeAmount: 0, //点赞未读数
        sysAmount: 0, //系统消息未读数
        totalAmount: 0, //未读消息总数
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad() {

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
        this.getUnreadAmount();
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
     * 获取未读消息数
     */
    getUnreadAmount: function(){
        var that = this;
        app.getUnreadAmount({},{
            success: function(res){
                var data = res.data;
                if(data){
                    that.setData(data);
                }
            },
            error: function(res){
                app.showFailMsg(res.msg);
            }
        });
    }
});
