const uploadImage = require('../../libs/oss/uploadAliyun.js');

// 获取全局应用程序实例对象
var app = getApp();


// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '同城帮-评论',
            path: '/pages/addcomment/addcomment'
        }
    },
    /**
     * 页面名称
     */
    name: "addcomment",
    /**
     * 页面的初始数据
     */
    fileId: [],
    data: {
        pid: 0,
        content: '',
        type: 1,
        newsId: 0,
        isSubmit: true,
        placeholderText: '写评论'  
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(option) {
        var that = this;   

        if(option['type'] || option['newsId'] || option['pid'] || option['activeUserName']){
            var activeUserName = option['activeUserName'] || ''
            that.setNavigationBarTitle(option['pid'], activeUserName);
            that.setData({
                type: option['type'] || 1,
                newsId: option['newsId'] || 0,
                pid: option['pid'] || 0
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
    setNavigationBarTitle: function(pid, activeUserName){
        var that = this,
            titleText = "",
            placeholderText = "";

            if(pid==0){
                titleText = "评论";
                placeholderText = "写评论";
            }else{
                titleText = "回复";
                placeholderText = "回复"+ activeUserName +":";
            }
            that.setData({
                placeholderText: placeholderText 
            });
            wx.setNavigationBarTitle({
                title: titleText
            });
    },
    getInputContent: function(e){
        var that = this,
            content = e.detail.value;
            content = app.trim(content);
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
    onFormSubmit: function(){
        var that = this,
            data = that.data,
            type = data.type,
            content = app.trim(data.content),
            option = {
                pid:  data.pid,
                newsId: data.newsId,
                content: content
            };

        if(!content || content==""){
            app.showFailMsg(data.placeholderText);
            return;
        }

        if(type == '1' || type == 1){
            that.addComment(option);
        }else if(type == '2' || type == 2){

        }
    },
    /**
     * 举报
     */
    addComment: function(data){
        var that = this;
        app.addComment(data,
        {
            success: function(res){
                wx.navigateBack({
                  delta: -1
                });
            }
        });
    }
});
