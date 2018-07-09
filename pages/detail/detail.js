
// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        var that = this, data = that.data, id = data.id, type=1, isLiked = data.isLiked, isCollected = data.isCollected;
        return {
            title: '同城帮-帖子详情',
            path: '/pages/detail/detail?id='+id+'&type='+type+'&isLiked='+isLiked+'&isCollected='+isCollected
        }
    },
    /**
     * 页面名称
     */
    name: "detail",
    /**
     * 页面的初始数据
     */
    count: 0,
    data: {
        id: '',
        type: 2,
        isLiked: 0,
        isCollected: 0,
        isShared: 0,
        isComment: 0,
        commentLength: 0,
        isBottom: false,
        detailList: [],
        showImgList: {},
        comment: []
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(option) {
        var that = this; 

        if(option['id'] && option['type']){
            that.setData({
                id: option['id'] || '',
                type: option['type'] || 2,
                isCollected: option['isCollected'] || 0,
                isLiked: option['isLiked'] || 0
            });
            that.getNewsById(option['id']);
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
        var that = this,
            id = that.data.id;

        // that.getNewsById(id);
    },
    
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function onUnload() {

    },

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
    /**
     * 查看大图片
     **/
    imageHandler: function(e) {
        var that = this,
            id = e.currentTarget.id,
            url = e.target.dataset.value;
            wx.previewImage({
                current: url, // 当前显示图片的http链接
                urls: that.data.showImgList[id] // 需要预览的图片http链接列表
            });
    },
    onAddLike: function(e){
        var that = this,
            id = e.target.dataset.value,
            type = e.currentTarget.id;
        that.addLike(id, type);
    },
    onAddCollection: function(e){
        var that = this,
            newsId = e.target.dataset.value;
        that.addCollection(newsId);
    },
    /**
     * 评论或帖子点赞
     */
     addLike: function(id, type){
        var that = this, newsId = that.data.id;

        app.addLike({
            id: id,
            type: type
        },{
            success: function(res){
               var data = res.data;
               if(type == '1'){
                   that.setData({
                       isLiked: data,
                   });
               }else{
                   that.getNewsById(newsId);
               }
               
            }
        });
     },
     /**
     * 添加收藏
     */
     addCollection: function(newsId){
        var that = this, isCollected = that.data.isCollected;

        if(isCollected == 1){
            app.showFailMsg("您已收藏该帖子");
            return;
        }
        app.addCollection({
            newsId: newsId
        }, {
            success: function(res){
               that.setData({
                   isCollected: 1
               }); 
            }
        });
     },
     /**
     * 拨打电话
     */
     makePhoneCall: function(e){
        var that = this,
            telephone = e.target.dataset.value;

        if(telephone!=""){
            app.makePhoneCall(telephone);
        }
     },
     /*
      * 获取帖子详情
      */
     getNewsById: function(id){
        var that = this,
            userInfo = wx.getStorageSync("userInfo")||{},
            longitude = userInfo.location[0],
            latitude = userInfo.location[1];
        if(id){
            app.getNewsById({
                longitude: longitude,
                latitude: latitude,
                id: id
            },
            {
                success: function(res){
                    var data = res.data,
                        detailList = [],
                        comment = [],
                        showImgList = [],
                        total = 0,
                        list = data ? [data]:[];
                    that.count = 0;

                      if(list && list.length){
                        for(var i = 0, len = list.length; i < len; i++){
                            var item = list[i];
                            item.createTime = app.getFormatTime(item.createTime, 'yyyy-MM-dd hh:mm:ss');
                            item.imgs = app.getImageData(item.imgs);
                            comment = that.getChildComment(item.comment);
                            detailList.push(item);
                            showImgList[item.id] = item.imgs;
                        }
                        that.setData({
                            detailList: detailList,
                            showImgList: showImgList,
                            isBottom: true,
                            comment: comment,
                            commentLength: that.count
                        });
                    }
                }
            });
        }
     },
     /**
      * 获取子评论
      */
      getChildComment: function(data){
        var that = this, comment = [];
        if(data.length){
           for(var j = 0; j < data.length; j++){
               var item = data[j];
               that.count++;
               item.createTime = app.getFormatTime(item.createTime, 'yyyy-MM-dd hh:mm:ss');
               if(item.sonComment && item.sonComment.length){
                  var sonComment = that.getChildComment(item.sonComment);
                  item.sonComment = sonComment;
               }
               comment.push(item);
           }
        }
        return comment
      },
      // 打开位置
      openMap: function(e){
        var that = this,
            detail = e.currentTarget.id,
            latitude = '',
            longitude = '';
        if(detail!="" && detail.indexOf(",")>0){
            var item = detail.split(",");
            longitude = parseFloat(item[0]);
            latitude = parseFloat(item[1]);
            app.openMap(latitude, longitude);
        }
    },
    /*
     * 删除我的帖子
     */
    deleteHandler: function(e){
      var that = this,
          id = e.target.dataset.value;
          app.onShowModal({
            title: "温馨提示",
            content: "你确定要删除该帖子吗？"
          }, function(){
              that.deleteNews(id);
          }); 
    },
    /**
     * 删除帖子
     */
    deleteNews: function(id){
        var that = this;

        app.deleteNews({
            id: id
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
            }
        });
    }
});
