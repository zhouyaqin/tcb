
// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        var that = this,
            categoryId = that.data.categoryId,
            categoryName = that.data.categoryName;
        return {
            title: '同城帮-分类模板',
            path: '/pages/temp/temp?categoryId='+ categoryId +'&categoryName=' + categoryName
        }
    },
    /**
     * 页面名称
     */
    name: "temp",
    /**
     * 页面的初始数据
     */
    dataList: [],
    showImgList: {},
    data: {
        userInfo: {},
        isBottom: false,
        categoryId: 0,
        categoryName: '',
        isAttent: 0,
        readAmount: 0,
        commentAmount: 0,
        dataList: [],
        showImgList: {},
        pageNum: 0,
        currentPage: 1,
        totalPage: 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(option) {
        var that = this;   

        if((option['categoryId']) || option['categoryName']){
          wx.setNavigationBarTitle({
              title: option['categoryName']
          });
          that.setData({
             categoryId: option['categoryId'],
             categoryName: option['categoryName']
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
     var that = this,
         userInfo = wx.getStorageSync("userInfo"),
         categoryId = that.data.categoryId,
         region = userInfo.adcode;

         that.getByCategory(categoryId, region, 1);
         that.getCategoryCount(categoryId, region);

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
            userInfo = wx.getStorageSync("userInfo"),
            region = userInfo.adcode,
            categoryId = data.categoryId,
            current = data.currentPage,
            pageNum = data.pageNum;

          current++;
          if(current <= pageNum){
              that.getByCategory(categoryId, region, current);
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
     /**
      * 根据所在区域及帖子类别统计总阅读量和评论量
      */
    getCategoryCount: function(categoryId, region){
        var that = this;
        app.getCategoryCount({
            region: region,
            categoryId: categoryId
        },{
            success: function(res){
                var data = res.data;
                if(data){
                    that.setData({
                        isAttent: data.isAttent,
                        readAmount: data.readAmount,
                        commentAmount: data.commentAmount,
                    });
                }
            }
        });
    },
    /**
    * 获取分类帖子列表
    **/
    getByCategory: function(categoryId, region, current){
        var that = this,
            userInfo = wx.getStorageSync("userInfo") || {},
            longitude = userInfo.location[0],
            latitude = userInfo.location[1];
          app.getByCategory({
            longitude: longitude,
            latitude: latitude,
            categoryId: parseInt(categoryId),
            region: region,
            current: current
          }, {
            success: function(res){
                var data = res.data,
                    list = data.list;

                if(list && list.length){
                    for(var i = 0, len = list.length; i < len; i++){
                        var item = list[i];
                        if(item.userId == userInfo.userId){
                            item.type = 2;
                        }else{
                            item.type = 1;
                        }
                        item.likeIcon = item.isLiked == 1 ? '/static/images/ico_24/15.png' : '/static/images/ico_24/5.png';
                        item.createTime = app.getFormatTime(item.createTime, 'yyyy-MM-dd hh:mm:ss');
                        item.imgs = app.getImageData(item.imgs);
                        that.dataList.push(item);
                        that.showImgList[item.id] = item.imgs;
                    }
                    that.setData({
                        dataList: that.dataList,
                        showImgList: that.showImgList,
                        pageNum: data.pages,
                        currentPage: data.current,
                        totalPage: data.total
                    });
                }
            },
            error: function(res){

            }
          });
    },
    /**
     * 添加关注
     */
    addAttent: function(){
        var that = this,
            data = that.data,
            userInfo = wx.getStorageSync("userInfo"),
            categoryId = that.data.categoryId,
            region = userInfo.adcode;

        app.addAttent({
            categoryId: categoryId
        },{
            success: function(res){
                that.getCategoryCount(categoryId, region);
            }
        });
    },
    /**
     * 取消关注
     */
    deleteAttent: function(){
        var that = this,
            data = that.data,
            userInfo = wx.getStorageSync("userInfo"),
            region = userInfo.adcode,
            categoryId = data.categoryId;

        app.deleteAttent({
            categoryId: categoryId
        },{
            success: function(res){
                that.getCategoryCount(categoryId, region);
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
