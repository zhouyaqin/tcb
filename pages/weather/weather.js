
const weatherIcon = require('../../utils/weather.js');

// 获取全局应用程序实例对象
var app = getApp();


// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '同城帮-天气',
            path: '/pages/weather/weather'
        }
    },
    /**
     * 页面名称
     */
    name: "weather",
    /**
     * 页面的初始数据
     */

    data: {
        windowWidth: '',
        windowHeight: '',
        userInfo: {},
        weather: {},
        todayWeather: {},
        oneWeather: {},
        twoWeather: {},
        threeWeather: {}     
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
        var that = this,
            userInfo = wx.getStorageSync("userInfo");
            that.setData({
                userInfo: userInfo,
                adcode: userInfo.adcode
            })
        that.getWeather(userInfo.adcode);
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
    /**
     * 天气预报
     */
    getWeather: function(adcode){
        var that = this, todayWeather = {}, oneWeather= {}, twoWeather = {}, threeWeather = {};
        app.getWeather({
            adcode: adcode
        },{
            success: function(res){
                var data = res.data;
                if(data){
                    for(var i = 0,len = data.length; i < len; i++){
                        var item = data[i];
                        item.weekText = that.getWeekData(item.week);
                        item.dayweatherIcon = weatherIcon[item.dayweather||''];
                        item.nightweatherIcon = weatherIcon[item.nightweather||''];
                        switch(i){
                            case 0:
                                todayWeather = item;
                            break;
                            case 1:
                                oneWeather = item;
                            break;
                            case 2:
                                twoWeather = item;
                            break;
                            case 3:
                                threeWeather = item;
                            break;

                        }
                    }
                    console.log(todayWeather);
                    that.setData({
                        weather: todayWeather,
                        todayWeather: todayWeather,
                        oneWeather: oneWeather,
                        twoWeather: twoWeather,
                        threeWeather: threeWeather
                    });   
                }
            },
            error: function(res){
                app.showFailMsg(res.msg);
            }
        });
    },
    getWeekData: function(week){
        return ['周日','周一','周二','周三','周四','周五','周六'][week];
    },
    onChangeWeather: function(e){
        var that = this,
            data = that.data,
            weatherData = {},
            index = e.currentTarget.id;
        switch(parseInt(index)){
            case 0:
                data.todayWeather.day = '今天';
                weatherData = data.todayWeather;
            break;
            case 1:
                data.oneWeather.day = '明天';
                weatherData = data.oneWeather;
            break;
            case 2:
                data.twoWeather.day = '后天';
                weatherData = data.twoWeather;
            break;
            case 3:
                data.threeWeather.day = that.getWeekData(data.threeWeather.week);
                weatherData = data.threeWeather;
            break;
        }
        that.setData({
            weather: weatherData
        });
    }

});
