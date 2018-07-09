
const lunar = require('../../utils/lunar.js');

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '同城帮-首页',
            path: '/pages/index/index'
        }
    },
    /**
     * 页面名称
     */
    name: "index",
    /**
     * 页面的初始数据
     */
    dataList: [],
    isShuit: true,
    showImgList: {},
    data: {
        adcode: '',
        position: '龙华新区',
        weatherText: '当地天气状况',
        flag: 1,
        isClassifyGroup: true,
        showFlag: true,
        weather: {},
        isBottom: false,
        showImgList: {},
        imgUrls: [],
        userInfo: {},
        classifyGroup: [],
        dataList: [],
        pageNum: 0,
        currentPage: 1,
        totalPage: 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(option) {
        var that = this, userInfo = wx.getStorageSync("userInfo")||{};

        if(userInfo.userId && userInfo.userId!=""){
            app.toLogin(userInfo.userId);
            app.getPosition(function(res){
                that.init(userInfo);
            });
        }else{
            app.initApp(function(){
                app.getPosition(function(res){
                    that.init(res);
                });
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
            data = that.data,
            userInfo = wx.getStorageSync("userInfo");
            
        if(data.adcode && (data.adcode != userInfo.adcode)){
            that.dataList = [];
            that.showImgList = {};
            that.init(userInfo);
        }
    },
    
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function onHide() {

    },
    /*
     * 页面滚动触发事件的处理函数
     */
    onPageScroll: function(e) {
        var that = this,
            option = {},
            top = e.scrollTop||0;
        if(top<=500){
           option.showFlag = true;
        }
        if(top > 500){
            option.showFlag = false;
        }
        that.setData(option);
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
            flag = data.flag,
            userInfo = data.userInfo,
            adcode = data.adcode,
            current = data.currentPage,
            pageNum = data.pageNum;
        current++;
        if(current <= pageNum){
            that.getByPage(flag, adcode, userInfo.location[0], userInfo.location[1], current);
        }else{
            that.setData({
                isBottom: true
            });
        }
    },
    init: function(userInfo){
        this.setData({
            position: userInfo.district,
            userInfo: userInfo,
            adcode: userInfo.adcode
        });
        this.getBanner();
        this.getCategoryByRegion(userInfo.adcode);
        this.showWeather(userInfo.adcode);
        this.getByPage(1, userInfo.adcode, userInfo.location[0], userInfo.location[1], 1);
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
     onNavChange: function(e){
       var that = this,
           adcode = that.data.adcode,
           userInfo = that.data.userInfo,
           index = e.currentTarget.id;
           that.setData({
              flag: index
           });
           that.dataList = [];
           that.showImgList = {};
           that.getByPage(index, adcode, userInfo.location[0], userInfo.location[1], 1);
     },
     // 获取banner图片
     getBanner: function(){
        var that = this;
        app.getBanner({}, {
            success: function(res){
              var data = res.data;
              if(data.length){
                  that.setData({
                      imgUrls: data
                  });
              }
            }
        });
     },
     /**
      * 获取根据所在区域获取帖子类别
      */
     getCategoryByRegion: function(adcode){
        var that = this;
        app.getCategoryByRegion({
          region: adcode 
        }, {
            success: function(res){
              var data = res.data, classifyGroup = [];

                  if(data.length){
                     var classifyList = app.sliceArray(data, 8);
                     for(var i = 0; i < classifyList.length; i++ ){
                        var item = {
                               classifyList: classifyList[i]
                            }
                        classifyGroup.push(item);
                     }

                     that.setData({
                        classifyGroup: classifyGroup,
                        isClassifyGroup: classifyGroup.length ? true:false
                     });
                  }
                   
            }
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
        var that = this,
            adcode = that.data.adcode,
            userInfo = that.data.userInfo;
            
            app.deleteNews({
                id: id
            },{
                success: function(res){
                    that.getByPage(1, adcode, userInfo.location[0], userInfo.location[1], 1);
                    that.dataList = [];
                    that.showImgList = {};
                }
            });
    },
     /**
     * 根据选择的排序要求分页显示帖子内容
     * @interface  '/news/getByPage'
     * @param {{ Int }} order, 1-智能排序 2-按最新排序 3-按热度排序
     * @param {{ Int }} current, 当前页
     */ 
     getByPage: function(order, adcode, longitude, latitude, current){
        var that = this, userInfo = that.data.userInfo;
            app.getByPage({
              order: order,
              region: adcode,
              longitude: longitude,
              latitude: latitude,
              current: current
            },
            {
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
                            item.index = (current-1)*10+i;
                            item.likeIcon = item.isLiked == 1 ? '/static/images/ico_24/15.png' : '/static/images/ico_24/5.png';
                            item.createTime = app.getFormatTime(item.createTime, 'yyyy-MM-dd hh:mm:ss');
                            item.content = app.splitContent(item.content, 90);
                            if(item.content.length > 90) item.showAll = true; else item.showAll = false;
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
                   wx.hideLoading();
                }
            });
     },
     showWeather: function(adcode){
        var that = this, currentDate = lunar.init();
        that.getWeather(adcode, function(res){
            var weatherText = (res.nighttemp||0) + '~'+ (res.daytemp||0) + '° ' + res.dayweather + ', ';
            weatherText += currentDate.month+'月'+currentDate.day+'日 ('+ currentDate.week +'), 农历' + currentDate.lunar;
            that.setData({
                weatherText: weatherText
            });
        });
     },
     /**
     * 天气预报
     */
    getWeather: function(adcode, callback){
        var that = this;
        app.getWeather({
            adcode: adcode
        },{
            success: function(res){
                var data = res.data;
                if(data){
                    typeof callback === 'function' && callback(data[0]);   
                }
            },
            error: function(res){
                // app.showFailMsg(res.msg);
            }
        });
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
        var that = this, dataList = that.data.dataList;

        app.addLike({
            id: id,
            type: type
        },{
            success: function(res){
               var data = res.data;
               if(data == 1 || data == '1'){
                  dataList[index].isLiked = data;
                  dataList[index].likeIcon = '/static/images/ico_24/15.png';
                  dataList[index].likeAmount++;
               }else{
                  dataList[index].isLiked = data;
                  dataList[index].likeIcon = '/static/images/ico_24/5.png';
                  dataList[index].likeAmount--;
               }
               that.dataList = dataList;
               that.setData({
                  dataList: that.dataList
               });
            },
            error: function(res){
                app.showFailMsg(res.msg);
            }
        });
     },
     // 处理banner
     onBannerHandler: function(e){
        var that = this,
            index = e.currentTarget.id;
            switch(parseInt(index)){
                case 0:
                    wx.navigateTo({
                        url: '../search/search'
                    });
                break;
                case 1:
                    wx.navigateTo({
                        url: '../partner/partner'
                    });
                break;
                case 2:
                    wx.switchTab({
                        url: '../release/release'
                    });
                break;
            }
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
