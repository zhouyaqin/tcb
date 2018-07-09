
// 获取全局应用程序实例对象
var app = getApp();


// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '同城帮-系统消息',
            path: '/pages/system/system'
        }
    },
    /**
     * 页面名称
     */
    name: "system",
    /**
     * 页面的初始数据
     */
    data: {
        isUseTemp: false,
        feedbackMsg: {},
        informMsg: {},
        punishMsg: {},
        noticeDetail: {}
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
        this.getSysMessage();
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
    // 获取系统信息
    getSysMessage: function(){
        var that = this;
        app.getSysMessage({},{
            success: function(res){
                var data = res.data;
                if(data){
                    data = that.handlerData(data);
                    var option = {
                        feedbackMsg: data.feedbackMsg || {},
                        punishMsg: data.punishMsg || {},
                        informMsg: data.informMsg || {}
                    }
                    that.setData(option);
                }
            },
            error: function(res){
                app.showFailMsg(res.msg);
            }
        });
    },
    handlerData: function(data){
        var newData = {};
        for(var key in data){
            if(data[key].length){ 
                var item = data[key][0];
                item.createTime = app.getFormatTime(new Date(item.createTime).getTime(), 'MM-dd');
                newData[key] = item;
            }
        }
        return newData;
    },
    // 用户处罚通知
    onPunishMsg: function(){
        var that = this, 
            punishMsg = that.data.punishMsg;
        if(!punishMsg.content){
            app.showFailMsg("暂无处罚通知");
            return;
        }
        punishMsg.title = "用户处罚通知";
        that.setData({
            isUseTemp: true,
            noticeDetail: punishMsg
        });
    },
    // 举报他人
    onInformMsg: function(){
        var that = this, 
            informMsg = that.data.informMsg;
        if(!informMsg.content){
            app.showFailMsg("暂无举报");
            return;
        }
        informMsg.title = "举报他人";
        that.setData({
            isUseTemp: true,
            noticeDetail: informMsg
        });
    },
    // 建议反馈
    onFeedbackMsg: function(){
        var that = this, 
            feedbackMsg = that.data.feedbackMsg;
        if(!feedbackMsg.content){
            app.showFailMsg("暂无建议反馈");
            return;
        }
        feedbackMsg.title = "建议反馈";
        that.setData({
            isUseTemp: true,
            noticeDetail: feedbackMsg
        });
    },
    closeNoticeTemp: function(){
        this.setData({
            isUseTemp: false
        });
    }
});
