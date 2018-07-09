
var WxParse = require('../../libs/wxParse/wxParse.js');

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '同城帮-搜索',
            path: '/pages/search/search'
        }
    },
    /**
     * 页面名称
     */
    name: "search",
    /**
     * 页面的初始数据
     */
    searchList: [],
    data: {
        searchInput: '',
        userInfo: {},
        inputShowed: false,
        searchList: [],
        isBottom: false,
        pageNum: 0,
        currentPage: 1,
        totalPage: 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(option) {
        var that = this,
            userInfo = wx.getStorageSync('userInfo');

            that.setData({
               userInfo: userInfo
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
        var that = this,
            region = that.data.userInfo.adcode,
            condition = wx.getStorageSync("condition");
            that.searchList = [];
            if(condition && condition!=""){
                that.searchNews(condition, region, 1);
            }
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
        var that = this,
            data = that.data,
            condition = data.searchInput,
            region = data.userInfo.adcode,
            current = data.currentPage,
            pageNum = data.pageNum;
            current++;
            if(current <= pageNum){
                that.searchNews(condition, region, current);
            }else{
                that.setData({
                    isBottom: true
                });
            }
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            searchInput: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            searchInput: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            searchInput: e.detail.value
        });
    },
    onConfirmSearchSubmit: function(e){
        var that = this,
            condition = e.detail.value,
            region = that.data.userInfo.adcode,
            current = 1;
        that.searchList = [];
        that.searchNews(condition, region, current);
    },
    onSearchSubmit: function(e){
        var that = this,
            data = that.data,
            condition = data.searchInput,
            region = data.userInfo.adcode,
            current = 1;
        that.searchList = [];
        that.searchNews(condition, region, current);
    },
    searchNews: function(condition, region, current){
       var that = this;

       app.searchNews({
          condition: condition || '',
          region: region,
          current: current
       },
       {
          success: function(res){
             var data = res.data;
             if(data.list){
                 var list = data.list;
                 for(var i = 0, len = list.length; i < len; i++){
                    var item = list[i];
                    item.matchStr = app.splitContent(item.matchStr, 120);
                    if(item.matchStr.length > 120) item.showAll = true; else item.showAll = false;
                    WxParse.wxParse('matchStr', 'html', item.matchStr, that);
                    item.matchStr = that.data.matchStr;
                    item.createTime = app.getFormatTime(item.createTime, 'yyyy-MM-dd hh:mm:ss');
                    that.searchList.push(item);
                 }
                 that.setData({
                    searchList: that.searchList,
                    pageNum: data.pages,
                    currentPage: data.current,
                    totalPage: data.total
                 });
                 wx.setStorageSync("condition", condition);
             }
          },
          error: function(res){
            app.showFailMsg(res.msg);
          }
       });

    }
});
