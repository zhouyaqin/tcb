
// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '同城帮-评论',
            path: '/pages/comment/comment'
        }
    },
    /**
     * 页面名称
     */
    name: "comment",
    /**
     * 页面的初始数据
     */
    dataList: [],
    data: {
        windowWidth: '',
        windowHeight: '',
        startX: 0, //开始坐标
        startY: 0,
        type: 0,
        showListFlag: true,
        dataList: [],
        isBottom: false,
        pageNum: 0,
        currentPage: 1,
        totalPage: 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(option) {
        var that = this;   

        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    windowWidth: res.windowWidth,
                    windowHeight: res.windowHeight
                });
            }
        });

        if(option['type'] && option['type']!=""){
          var type = parseInt(option['type']),
              title = ['评论', '赞'][type];
              wx.setNavigationBarTitle({
                  title: title
              });
              that.setData({
                 type: type
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
        var that = this, type = that.data.type;
        that.dataList = [];
        if(type==0){
            that.getComment(1);
        }else{
            that.getLike(1);
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
            type = data.type,
            current = data.currentPage,
            pageNum = data.pageNum;

          current++;
          if(current <= pageNum){
              if(type==0){
                that.getComment(current);
              }else{
                that.getLike(current);
              }
          }else{
              that.setData({
                  isBottom: true
              });
          }
    },
    /**
     * 获取点赞列表
     */
     getLike: function(current){
        var that = this;
            if(current==1){
               that.dataList = [];
            }
            app.getLike({
                current: current || 1
            },{
                success: function(res){
                    var data = res.data;
                    if(data.list){
                        var list = data.list;
                        for(var i = 0, len = list.length; i < len; i++){
                            var item = list[i];
                            item.resContent = app.splitContent(item.resContent, 20);
                            item.replyTime = app.getFormatTime(item.replyTime, 'yyyy-MM-dd hh:mm:ss');
                            item.resImags = app.getImageData(item.resImags)[0];
                            that.dataList.push(item);
                        }
                        that.setData({
                            showListFlag: true,
                            dataList: that.dataList,
                            pageNum: data.pages,
                            currentPage: data.current,
                            totalPage: data.total
                        });
                    }
                },
                error: function(res){
                    app.showFailMsg(res.msg);
                }
            });
     },
     /**
     * 获取点赞列表
     */
     getComment: function(current){
        var that = this;
            if(current==1){
               that.dataList = [];
            }
            app.getComment({
                current: current
            },{
                success: function(res){
                    var data = res.data;
                    if(data.list){
                        var list = data.list;
                        for(var i = 0, len = list.length; i < len; i++){
                            var item = list[i];
                            item.isTouchMove = false;
                            item.resContent = app.splitContent(item.resContent, 20);
                            item.replyContent = app.splitContent(item.replyContent, 30);
                            item.replyTime = app.getFormatTime(item.replyTime, 'yyyy-MM-dd hh:mm:ss');
                            item.resImags = app.getImageData(item.resImags)[0];
                            that.dataList.push(item);
                        }
                        that.setData({
                            showListFlag: false,
                            dataList: that.dataList,
                            pageNum: data.pages,
                            currentPage: data.current,
                            totalPage: data.total
                        });
                    }
                },
                error: function(res){
                    app.showFailMsg(res.msg);
                }
            });
     },
     onDeleteHandler: function(e){
        var that = this,
            type = that.data.type,
            resType = e.target.dataset.id,
            msg = type == 0 ? '帖子':'点赞',
            id = e.currentTarget.id;

            app.onShowModal({
                title: "温馨提示",
                content: "你确定要删除该"+ msg +"吗？"
              }, function(){
                  if(type==0 || type=='0'){
                      that.deleteComment(id);      
                  }else{
                     that.addLike(id, resType);
                  }
              }); 
     },
    // 删除评论
    deleteComment: function(id){
        var that = this;
        app.deleteComment({
            id: id
        },{
           success: function(res){
               that.getComment(1);
           }
        });
    },
    /**
     * 评论或帖子点赞
     */
     addLike: function(id, type){
        var that = this;

        app.addLike({
            id: id,
            type: type || 1
        },{
            success: function(res){
                that.getLike(1);
            },
            error: function(res){
                app.showFailMsg(res.msg);
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
                if(id!=""){
                  wx.navigateTo({
                      url: '../detail/detail?id='+id+'&type=2&isLiked='+isLiked+'&isCollected='+isCollected
                  });
                }
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
    //手指触摸动作开始 记录起点X坐标
     touchstart: function (e) {
        var that = this;
        //开始触摸时 重置所有删除
        that.data.dataList.forEach(function (v, i) {
          if(v.isTouchMove)//只操作为true的
            v.isTouchMove = false;
          });
          that.setData({
           startX: e.changedTouches[0].clientX,
           startY: e.changedTouches[0].clientY,
           dataList: that.data.dataList
          });
     },
     //滑动事件处理
     touchmove: function (e) {
        var that = this,
            index = e.currentTarget.dataset.index,//当前索引
            startX = that.data.startX,//开始X坐标
            startY = that.data.startY,//开始Y坐标
            touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
            touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
            angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY }); //获取滑动角度
      
            that.data.dataList.forEach(function (v, i) {
               v.isTouchMove = false
               //滑动超过30度角 return
               if (Math.abs(angle) > 30) return;
               if (i == index) {
                  if (touchMoveX > startX) //右滑
                    v.isTouchMove = false
                  else //左滑
                    v.isTouchMove = true
               }
            })
            //更新数据
            that.setData({
              dataList: that.data.dataList
            })
     },
     /**
      * 计算滑动角度
      * @param {Object} start 起点坐标
      * @param {Object} end 终点坐标
      */
     angle: function (start, end) {
        var _X = end.X - start.X,
            _Y = end.Y - start.Y
            //返回角度 /Math.atan()返回数字的反正切值
            return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
     }
});
