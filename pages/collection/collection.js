
// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '同城帮-我的收藏',
            path: '/pages/collection/collection'
        }
    },
    /**
     * 页面名称
     */
    name: "collection",
    /**
     * 页面的初始数据
     */
    collectList: [],
    showImgList: {},
    data: {
        showImgList: {},
        collectList: [],
        isBottom: false,
        pageNum: 0,
        currentPage: 1,
        totalPage: 0
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
        this.init();
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
            current = data.currentPage,
            pageNum = data.pageNum;

          current++;
          if(current <= pageNum){
              that.getCollection(current);
          }else{
              that.setData({
                  isBottom: true
              });
          }
    },
    init: function(){
        this.collectList = [];
        this.showImgList = {};
        this.getCollection(1);
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
    cancelCollectHandler: function(e){
      var that = this,
          id = e.target.dataset.value;
          app.onShowModal({
            title: "温馨提示",
            content: "你确定要取消对帖子的收藏吗？"
          }, function(){
              that.deleteCollection(id);
          }); 
    },
    /**
     * 取消收藏
     */
    deleteCollection: function(id){
        var that = this;

        app.deleteCollection({
            id: id
        },{
            success: function(res){
                that.collectList = [];
                that.showImgList = {};
                that.getCollection(1);
            }
        });
    },
    onAddLike: function(e){
        var that = this,
            value = e.currentTarget.id;
        if(value.indexOf(",")>0){
            var arr = value.split(","),
                id = arr[0],
                index = arr[1];
                that.addLike(id, 1, index);
        }
    },
    /**
     * 评论或帖子点赞
     */
     addLike: function(id, type, index){
        var that = this, collectList = that.data.collectList;

        app.addLike({
            id: id,
            type: type
        },{
            success: function(res){
               var data = res.data;
               if(data == 1 || data == '1'){
                  collectList[index].isLiked = data;
                  collectList[index].likeIcon = '/static/images/ico_24/15.png';
                  collectList[index].likeAmount++;
               }else{
                  collectList[index].isLiked = data;
                  collectList[index].likeIcon = '/static/images/ico_24/5.png';
                  collectList[index].likeAmount--;
               }
               that.collectList = collectList;
               that.setData({
                  collectList: that.collectList
               });
            },
            error: function(res){
                app.showFailMsg(res.msg);
            }
        });
     },
    /**
     * 获取收藏列表
     **/
    getCollection: function(current){
        var that = this,
            userInfo = wx.getStorageSync("userInfo")||{},
            longitude = userInfo.location[0],
            latitude = userInfo.location[1];

        app.getCollection({
            longitude: longitude,
            latitude: latitude,
            current: current
        }, {
            success: function(res){
                wx.hideLoading();
                var data = res.data,
                    list = data.list;

                if(list && list.length){
                    for(var i = 0, len = list.length; i < len; i++){
                        var item = list[i];
                        item.type = 4;
                        item.index = (current-1)*10+i;
                        item.likeIcon = item.isLiked == 1 ? '/static/images/ico_24/15.png' : '/static/images/ico_24/5.png';
                        item.content = app.splitContent(item.content, 90);
                        item.createTime = app.getFormatTime(item.createTime, 'yyyy-MM-dd hh:mm:ss');
                        item.imgs = app.getImageData(item.imgs);
                        that.collectList.push(item);
                        that.showImgList[item.id] = item.imgs;
                    }
                    that.setData({
                        collectList: that.collectList,
                        showImgList: that.showImgList,
                        pageNum: data.pages,
                        currentPage: data.current,
                        totalPage: data.total
                    });
                }
            }
        });
    },
     onShowDetail: function(e){
        var that = this,
            data = e.currentTarget.id;
        if(data && data.indexOf(",")>0){
            var arr = data.split(","),
                id = arr[0],
                type = arr[1],
                isLiked = arr[2],
                isCollected = arr[3];
                wx.navigateTo({
                    url: '../detail/detail?id='+id+'&type='+type+'&isLiked='+isLiked+'&isCollected='+isCollected
                });
        } 
     },
     onShowPage: function(e){
        var that = this,
            data = e.target.dataset.value;
        if(data && data.indexOf(",")>0){
            var arr = data.split(","),
                userId = arr[0],
                name = arr[1];
            wx.navigateTo({
                url: '../page/page?userId='+ userId +'&name=' + name
            });
        }
     },
     onShowTemp: function(e){
        var that = this,
            data = e.target.dataset.value;
        if(data && data.indexOf(",")>0){
            var arr = data.split(","),
                categoryId = arr[0],
                categoryName = arr[1];
            wx.navigateTo({
                url: '../temp/temp?categoryId='+ categoryId +'&categoryName=' + categoryName
            });
        }
     },
     onShowCommet: function(e){
        var that = this;
        wx.navigateTo({
            url: '../comment/comment?type=0'
        });
     }
});
