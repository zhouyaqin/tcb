
// 获取全局应用程序实例对象
var app = getApp();


// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '同城帮-关注',
            path: '/pages/follow/follow'
        }
    },
    /**
     * 页面名称
     */
    name: "follow",
    /**
     * 页面的初始数据
     */
    data: {
        attentList: []
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
        var that = this;
        that.getAttent(1);
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
     * 获取关注列表
     **/
    getAttent: function(current){
        var that = this;
        app.getAttent({
            current: current
        }, {
            success: function(res){
                var data = res.data,
                    attentList = [];

                if(data.list){
                    var list = data.list;
                    for(var i = 0, len = list.length; i < len; i++){
                        var item = list[i];
                        item.createTime = app.getFormatTime(item.createTime, 'yyyy-MM-dd');
                        attentList.push(item);
                    }
                    that.setData({
                        attentList: attentList
                    });
                }
            },
            error: function(res){
                app.showFailMsg(res.msg);
            }
        });
    }
});
