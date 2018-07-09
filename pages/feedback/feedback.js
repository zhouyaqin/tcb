const uploadImage = require('../../libs/oss/uploadAliyun.js');

// 获取全局应用程序实例对象
var app = getApp();


// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '同城帮-建议反馈',
            path: '/pages/feedback/feedback'
        }
    },
    /**
     * 页面名称
     */
    name: "feedback",
    /**
     * 页面的初始数据
     */
    fileId: [],
    data: {
        id: 0,
        reason: '',
        type: 1,
        newsId: 0,
        userId: 0,
        isSubmit: true,
        isChoose: true,
        placeholderText: '请填写反馈内容',
        files: []   
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(option) {
        var that = this;   

        if(option['type'] || option['userId'] || option['id'] || option['newsId']){
            that.setNavigationBarTitle(option['type']);
            that.setData({
                type: option['type'] || 1,
                userId: option['userId'] || 0,
                id: option['id'] || 0,
                newsId:  option['newsId'] || 0
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
    setNavigationBarTitle: function(type){
        var that = this,
            titleText = "",
            placeholderText = "";
        
            switch(parseInt(type)){
                case 1:
                    titleText = "建议反馈";
                    placeholderText = "请填写建议反馈内容";
                break;
                case 2:
                    titleText = "举报";
                    placeholderText = "请填写举报原因";
                break;
            }
            that.setData({
                placeholderText: placeholderText 
            });
            wx.setNavigationBarTitle({
                title: titleText
            });
    },
    // 获取建议或举报
    getInputReason: function(e){
        var that = this,
            reason = e.detail.value;
            if(reason!=""){
                that.setData({
                    reason: reason,
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
            type = that.data.type;
        if(type == '1' || type == 1){
            that.addFeedback();
        }else if(type == '2' || type == 2){
            that.addInform();
        }
    },
    /**
     * 举报
     */
    addInform: function(){
        var that = this,
            data = that.data,
            image = that.fileId.join(",");

        if(!image || image==""){
            app.showFailMsg("请上传图片");
            return;
        }
        app.addInform({
            newsId: data.newsId,
            userId: data.userId,
            reason: data.reason,
            image: image
        },
        {
            success: function(res){
                app.onShowModal({
                    showCancel: false,
                    content: res.msg
                }, function(){
                    wx.redirectTo({
                        url: '/pages/detail/detail?id=' + data.id
                    });
                });
            },
            error: function(res){
                app.showFailMsg(res.msg);
            }
        });
    },
    // 提交建议
    addFeedback: function(){
        var that = this,
            data = that.data,
            content = data.reason,
            image = that.fileId.join(",");

        if(!image || image==""){
            app.showFailMsg("请上传图片");
            return;
        }
        app.addFeedback({
            content: content,
            image: image
        },{
            success: function(res){
                app.onShowModal({
                    showCancel: false,
                    content: res.msg
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
    },
    /**
     * 查看图片
     */
    imageHandler: function(e) {
        var that = this,
            url = e.currentTarget.id;
            wx.previewImage({
                current: url, // 当前显示图片的http链接
                urls: that.data.files // 需要预览的图片http链接列表
            });
    },
    /*
     * 选择图片
    */
    chooseImage: function (e) {
        var that = this,
            filesArr = that.data.files;

            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    var tempFilePaths = res.tempFilePaths;
                        filesArr = filesArr.concat(tempFilePaths);
                    that.uploadFile({path: filesArr});
                }
            });
    },
    /*
     * 上传文件
     */
    uploadFile: function(data){
        var that = this;

            wx.showLoading();
            uploadImage({
                filePath: data.path[0]
            },
            {
                success: function(res){
                    wx.hideLoading();
                    that.fileId.push(res.fileId);
                    that.setData({
                        files: data.path,
                        isChoose: false
                    });
                },
                error: function(res){
                    wx.hideLoading();
                    that.setData({
                        isChoose: true
                    });
                },
                complete: function(res){

                }
            });
    }
});
