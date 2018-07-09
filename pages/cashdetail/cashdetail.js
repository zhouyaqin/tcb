
// 获取全局应用程序实例对象
var app = getApp();


// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '同城帮-提现明细',
            path: '/pages/cashdetail/cashdetail'
        }
    },
    /**
     * 页面名称
     */
    name: "cashdetail",
    /**
     * 页面的初始数据
     */

    data: {
        windowWidth: '',
        windowHeight: '',
        cashDetailList: [
            {id: 1, mode: "微信钱包", amount: "-100.00", dateTime: "2018-3-13 20:23"},
            {id: 2, mode: "微信钱包", amount: "-200.00", dateTime: "2018-3-13 21:23"},
            {id: 3, mode: "微信钱包", amount: "-1000.00", dateTime: "2018-3-13 22:23"},
            {id: 4, mode: "(***4567)", amount: "-100.00", dateTime: "2018-3-13 12:23"},
            {id: 5, mode: "(***4567)", amount: "-700.00", dateTime: "2018-3-13 15:23"},
            {id: 6, mode: "(***4567)", amount: "-200.00", dateTime: "2018-3-14 20:23"}
        ]    
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad() {
        var that = this;   
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    windowWidth: res.windowWidth,
                    windowHeight: res.windowHeight
                });
            }
        });
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
});
