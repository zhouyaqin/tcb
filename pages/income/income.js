
// 获取全局应用程序实例对象
var app = getApp();

// 引用图表js文件 ----- size: 29KB
var Charts = require('../../libs/chart/wxcharts-min');
var lineChart = null;


// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '同城帮-收益管理',
            path: '/pages/income/income'
        }
    },
    /**
     * 页面名称
     */
    name: "income",
    /**
     * 页面的初始数据
     */

    data: {
        windowWidth: '',
        windowHeight: '',
        isData: false   
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad() {
        var that = this;   
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    windowWidth: res.windowWidth,
                    windowHeight: res.windowHeight
                });
            }
        });
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
        var that = this;
        var data = [89, 120, 212, 214, 341, 124, 321, 124, 153, 102, 289, 320],
            time = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        that.myCharts(data, time);

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
    /*
     * 用户点击右上角转发
     */
    onShareAppMessage: function () {
       // return custom share data when user share.
    },
    /*
     * 页面滚动触发事件的处理函数
     */
    onPageScroll: function() {
        // Do something when page scroll
    },
    /**
     * 当前是 tab 页时，点击 tab 时触发
     */ 
    onTabItemTap(item) {
        console.log(item.index)
        console.log(item.pagePath)
        console.log(item.text)
    },
    touchHandler: function (e) {
      lineChart.scrollStart(e);
    },
    moveHandler: function (e) {
      lineChart.scroll(e);
    },
    touchEndHandler: function (e) {
      lineChart.scrollEnd(e);
      lineChart.showToolTip(e, {
        format: function (item, category) {
          return category + ' ' + item.name + ':' + item.data
        }
      });   
    },
    /**
     * 图表插件
     */
    myCharts: function(data, time) {
        var that = this;
        if (data.length != 0) {
          that.setData({
             isData: true
          });
          lineChart = new Charts({
                canvasId: 'myChart',
                type: 'line',
                categories: time || '',
                series: [{
                    name: '金额',
                    color: "#b1b4bd",
                    data: data
                }],
                extra: {
                    lineStyle: 'curve'
                },
                yAxis: {
                    min: 0,
                    disabled: false,
                    fontColor: "#363638"
                },
                xAxis: {
                    disableGrid: true,
                    fontColor: "#363638"
                },
                width: that.data.windowWidth-40,
                height: 210,
                dataLabel: true,
                dataPointShape: true,
                enableScroll: true,
            });
        }else{
            that.setData({
             isData: false
            });
        }
    }
});
