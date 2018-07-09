
// 获取全局应用程序实例对象
var app = getApp();


// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '同城帮-合伙人',
            path: '/pages/partner/partner'
        }
    },
    /**
     * 页面名称
     */
    name: "partner",
    /**
     * 页面的初始数据
     */

    data: {
        windowWidth: '',
        windowHeight: '',
        region: '',
        sheng: '广东省',
        shi: '深圳市',
        xian: '龙华新区',
        isSubmit: false,
        region: ['广东省', '深圳市', '龙华新区'] 
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
    onKeyInput: function(e){
       var that = this,
           value = app.trim(e.detail.value);
        if(value !=""){
           that.setData({
              isSubmit: true
           });
        }
    },
    formSubmit: function(e){
        var that = this,
            sheng = that.data.sheng,
            shi = that.data.shi,
            xian = that.data.xian,
            formData = e.detail.value;

        if(sheng=="" || shi=="" || xian==""){
            app.showFailMsg("请选择地区");
            return;
        }
        if(formData.descp == ""){
            app.showFailMsg("请说明你的优势条件");
            return;
        }
        if(formData.name == ""){
            app.showFailMsg("请输入姓名");
            return;
        }
        if(!app.checkPhone(formData.telephone)){
            return;
        }

        formData.sheng = sheng;
        formData.shi = shi;
        formData.xian = xian;
        that.addAgent(formData);
  
    },
    addAgent: function(data){
        var that = this;

        app.addAgent(data, {
            success: function(res){
                app.onShowModal({
                    content: res.msg
                }, function(){
                    wx.switchTab({
                        url: "/pages/index/index"
                    });
                });
            },
            error: function(res){
                app.showFailMsg(res.msg);
            }
        });
    },
    bindRegionChange: function (e) {
        var that = this,
            region = e.detail.value;
            that.setData({
                region: region.join(","),
                sheng: region[0],
                shi: region[1],
                xian: region[2]
            });
    }
});
