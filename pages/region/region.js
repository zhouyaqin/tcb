
// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '同城帮-定位',
            path: '/pages/region/region'
        }
    },
    /**
     * 页面名称
     */
    name: "region",
    /**
     * 页面的初始数据
     */
    allRegionData: {},
    data: {
        searchInput: '',
        postion: "深圳",
        province: '选择省',
        city: '选择市',
        county: '区/县',
        town: '乡镇',
        index: 1,
        isShow: 1,
        page1: 0,
        page2: 0,
        page3: 0,
        provinceList: [],
        cityList: [],
        countyList: [],
        inputShowed: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(option) {
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
        var that = this,
            userInfo = wx.getStorageSync("userInfo");
        that.setData({
            userInfo: userInfo,
            postion: userInfo.district
        });
       that.getRegionTree();   
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
    inputTyping: function (e) {
        this.setData({
            searchInput: e.detail.value
        });
    },
    onConfirmSearchSubmit: function(e){
        var that = this,
            county = that.data.searchInput;
        that.searchRegion(county);
    },
    onSearchSubmit: function(e){
        var that = this,
            county = that.data.searchInput;
        that.searchRegion(county);
    },
    // 获取省市区县数据
    getRegionTree: function(){
        var that = this;
        app.getRegionTree({},{
           success: function(res){
              var data = res.data, nodes = [], allData = {};
              that.parseTree(data, nodes, allData);
              that.parseData(nodes);
              that.allRegionData = allData; 
           },
           error: function(res){
              app.showFailMsg(res.msg);
           }
        });
    },
    // 切换省市区
    onNavChange: function(e){
       var that = this,
           page1 = that.data.page1,
           page2 = that.data.page2,
           page3 = that.data.page3,
           index = e.currentTarget.id;

           if(page1==0){
              if(index>1){
                 return; 
              }
           }
           if(page2==0){
              if(index>2){
                 return; 
              }
           }
           if(page3==0){
              if(index>3){
                 return; 
              }
           }
           that.setData({
              index: index,
              isShow: index
           }); 
    },
    // 获取省
    onProvince: function(e){
        var that = this,
            code = e.currentTarget.id,
            name = that.allRegionData[code].name,
            children = that.allRegionData[code].children;

            that.setData({
               isShow: 2,
               page1: 1,
               page2: 0,
               page3: 0,
               index: 2,
               province: name,
               city: '选择市',
               county: '区/县',
               town: '乡镇',
               cityList: children
            });
    },
    // 获取市
    onCity: function(e){
        var that = this,
            code = e.currentTarget.id,
            name = that.allRegionData[code].name,
            children = that.allRegionData[code].children;
            that.setData({
               isShow: 3,
               page1: 1,
               page2: 1,
               page3: 0,
               index: 3,
               city: name,
               county: '区/县',
               town: '乡镇',
               countyList: children
            });
    },
    // 获取区县
    onCounty: function(e){
        var that = this,
            userInfo = that.data.userInfo,
            code = e.currentTarget.id,
            name = that.allRegionData[code].name,
            adcode = that.allRegionData[code].adcode;
            that.setData({
               isShow: 4,
               page1: 1,
               page2: 1,
               page3: 1,
               index: 4,
               county: name
            });
            userInfo.district = name;
            userInfo.adcode = adcode;
            wx.setStorageSync("userInfo", userInfo);
            wx.navigateBack({
              delta: -1
            })
    },
    // 解析树形数据
    parseTree:function(data, nodes, allData) {
        var  that = this;
        for (var k = 0; k < data.length; k++) {
            var item = data[k];
            var node = {
                    code: item.code,
                    type: item.type,
                    name: item.name
                };
            if(item.children && item.children.length){
                that.parseTree(item.children, nodes, allData);
            }
            allData[item.code] = item;
            nodes.push(node);
        }
    },
    // 解析数据
    parseData(data){
        var that = this,
            provinceList = [],
            cityList = [],
            countyList = [];

        if(data && data.length){
            for(var i = 0; i < data.length; i++ ){
                var item = data[i];
                if(item.type == 1){
                    provinceList.push(item);
                    that.setData({
                      provinceList: provinceList
                    });
                }else if(item.type == 2){
                    cityList.push(item);
                    that.setData({
                      cityList: cityList
                    });
                }else if(item.type == 3){
                    countyList.push(item);
                    that.setData({
                      countyList: countyList
                    });
                }
            }
        } 
    },
    // 搜索区县
    searchRegion: function(county){
       var that = this, userInfo = that.data.userInfo;

       app.searchRegion({
          xian: county
       },{
          success: function(res){
             var data = res.data;
             if(data && data!=null){
                userInfo.district = data.name;
                userInfo.adcode = data.adcode;
                wx.setStorageSync("userInfo", userInfo);
                wx.navigateBack({
                  delta: -1
                });
             }else{
                app.showFailMsg("暂未开放");
             }
          },
          error: function(res){
            app.showFailMsg(res.msg);
          }
       });

    }
});
