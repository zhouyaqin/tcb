
// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '同城帮-我的发帖',
            path: '/pages/mymsg/mymsg'
        }
    },
    /**
     * 页面名称
     */
    name: "mymsg",
    /**
     * 页面的初始数据
     */
    myNewsList: [],
    showImgList: {},
    data: {
       myNewsList: [],
       showImgList: {},
       isBottom: false,
       pageNum: 0,
       currentPage: 1,
       totalPage: 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad() {
        this.init();
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
    init: function() {
        this.myNewsList = [];
        this.showImgList = {};
        this.getMyNews(1);
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
              that.getMyNews(current);
          }else{
              that.setData({
                  isBottom: true
              });
          }
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
                that.getMyNews(1);
                that.myNewsList = [];
                that.showImgList = {};
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
        var that = this, myNewsList = that.data.myNewsList;

        app.addLike({
            id: id,
            type: type
        },{
            success: function(res){
               var data = res.data;
               if(data == 1 || data == '1'){
                  myNewsList[index].isLiked = data;
                  myNewsList[index].likeIcon = '/static/images/ico_24/15.png';
                  myNewsList[index].likeAmount++;
               }else{
                  myNewsList[index].isLiked = data;
                  myNewsList[index].likeIcon = '/static/images/ico_24/5.png';
                  myNewsList[index].likeAmount--;
               }
               that.myNewsList = myNewsList;
               that.setData({
                  myNewsList: that.myNewsList
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
    getMyNews: function(current){
        var that = this,
            userInfo = wx.getStorageSync("userInfo")||{};

        wx.showLoading();
        app.getMyNews({
            longitude: userInfo.location[0] || "",
            latitude: userInfo.location[1] || "",
            current: current
        }, {
            success: function(res){
                wx.hideLoading();
                var data = res.data,
                    list = data.list;

                if(list && list.length){
                    for(var i = 0, len = list.length; i < len; i++){
                        var item = list[i];
                        item.type = 2;
                        item.index = (current-1)*10+i;
                        item.likeIcon = item.isLiked == 1 ? '/static/images/ico_24/15.png' : '/static/images/ico_24/5.png';
                        item.content = app.splitContent(item.content, 90);
                        item.createTime = app.getFormatTime(item.createTime, 'yyyy-MM-dd hh:mm:ss');
                        item.imgs = app.getImageData(item.imgs);
                        that.myNewsList.push(item);
                        that.showImgList[item.id] = item.imgs;
                    }
                    that.setData({
                        myNewsList: that.myNewsList,
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
