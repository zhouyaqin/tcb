
App({
    times: 0,
    touchDot: 0,//触摸时的原点
    interval: "",
    flag_hd: true,
    // host: "http://192.168.0.178:8085",
    host: "https://tcbwxs.zetiantech.com/xcx",
    imgHost: "https://tcboss.zetiantech.com",
    /**
     * 页面名称
     */
    name: "index",
    /*
     * 首次进入app加载
     */
    onLaunch: function() {

    },
    initApp: function(callback){
        var that = this;

        // 微信授权登录
        that.wxLogin(function(code){
              that.getUserInfoData({
                 success: function(res){
                    var userInfo = res.userInfo;
                    var data = {
                          code: code,
                          headImage: userInfo.avatarUrl,
                          nickName: userInfo.nickName,
                          iv: res.iv,
                          encryptedData: res.encryptedData,
                          telephone: ""
                        };
                    wx.setStorageSync("baseInfo", data);
                    that.userRegister(data, callback); 
                 }
              });   
        });
    },
    //绝对路径
    getUrl: function(name) {
        return this.host + "/" + name;
    },
    wxLogin: function(callback){
       var that = this;
       // 微信用户授权登录
        wx.login({
            success: function(res) {
                if (res.code) {
                    typeof callback === 'function' && callback(res.code);
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
            }
        });
    },
    //发送请求
    ajax: function(url, param, type, cb) {
        var that = this,
            token = wx.getStorageSync("userInfo").token || "",
            method = type || 'POST',
            header = {
                'content-type': 'application/x-www-form-urlencoded'
            };

        if (!param) param = {};

        if(token && token!=""){
            header = {
                'content-type': 'application/x-www-form-urlencoded',
                'token': token
            }
        }

        wx.request({
            url: that.getUrl(url),
            data: param,
            method: method,
            header: header,
            success: function(res) {
                var data = res.data;
                  if(typeof data === 'string'){
                      // try{
                        data = JSON.parse(data);
                      /*}catch(e){
                        // console.log(e);
                      }*/
                  }
                  if(data.status == "001"){
                    cb && cb.success && cb.success(data);
                  }else if(data.status == "000"){
                    cb && cb.error && cb.error(data);
                  }
            },
            fail: function(res) {
                wx.hideLoading();
                typeof fail === 'function' && fail(res);
            }
        });
        return;
    },
    imgRequest: function (name, param, fileName, cb) {
        var that = this,
            data = {},
            header = {
              'content-type': 'multipart/form-data'
            };

            if (!param) {
                param = {};
            }

            wx.showLoading();
            wx.uploadFile({
                url: that.getUrl(name), 
                filePath: param.file[0],
                name: fileName,
                method: 'POST',
                header: header,
                formData: data,
                success: function (res) {
                  var data = res.data;
                  if(typeof data === 'string'){
                      try{
                        data = JSON.parse(data);
                      }catch(e){
                        console.log(e);
                      }
                  }
                  if(data.code == "200"){
                    cb && cb.success && cb.success(data);
                  }else {
                    cb && cb.error && cb.error(data);
                  }
                },
                fail: function (res) {
                  cb && cb.fail && cb.fail(res.data);
                },
                complete: function(){
                    wx.hideLoading();
                }
            })
    },
    // 获取url参数值
    getUrlParams: function(url, name) {
        url = url || location.search;
        var sname = name + "=",
            len = sname.length,
            index = url.indexOf(sname),
            result, lastIndex;
        if (index != -1) {
            index += len;
            lastIndex = url.indexOf("&", index);
            result = lastIndex == -1 ? url.substring(index) : url.substring(index, lastIndex);
        }
        return result;
    },
    /*
     * 验证手机号码
     * @param phone {{ String  }} 手机号码
     * @return {{ boolean }}  成功-true  失败-false
     */
    checkPhone: function(phone) {
        if (!phone || phone=="") {
            this.showFailMsg("请输入手机号码");
            return false;
        } else if (!/^1[34578]\d{9}$/.test(phone)) {
            this.showFailMsg("请输入正确的手机号码");
            return false;
        }
        return true;
    },
    /**
     * 格式化日期时间
     * @param  {[ string ]} datestr 时间字符串
     * @param  {[ string ]} format  时间输出格式
     */
    formatDate: function (datestr, format) {
      var date, dates;
      if (typeof datestr == "string") {
        if (datestr.length == 8) {
          date = new Date(datestr.substring(0, 4), datestr.substring(4, 6) - 1, datestr.substring(6, 8));
        } else if (datestr.length == 10) {
          date = new Date(datestr.substring(0, 4), datestr.substring(5, 7) - 1, datestr.substring(8, 10));
        } else if (datestr.length == 16) {
          date = new Date(datestr.substring(0, 4), datestr.substring(5, 7) - 1, datestr.substring(8, 10), datestr.substring(11, 13), datestr.substring(14, 16));
        } else if (datestr.length == 19) {
          date = new Date(datestr.substring(0, 4), datestr.substring(5, 7) - 1, datestr.substring(8, 10), datestr.substring(11, 13), datestr.substring(14, 16), datestr.substring(17, 19));
        }
      } else {
        date = datestr;
      }
      dates = {
        'y': date.getFullYear(),
        'M': this.padLeft(date.getMonth() + 1, "0", 2),
        'd': this.padLeft(date.getDate(), "0", 2),
        'h': this.padLeft(date.getHours(), "0", 2),
        'm': this.padLeft(date.getMinutes(), "0", 2),
        's': this.padLeft(date.getSeconds(), "0", 2)
      };
      format = format || "yyyy-MM-dd";
      return format.replace(/y+/, function (str) {
        return dates.y.toString().substr(-str.length);
      }).replace(/M+/, function (str) {
        return dates.M;
      }).replace(/d+/, function (str) {
        return dates.d;
      }).replace(/h+/i, function (str) {
        return dates.h;
      }).replace(/m+/, function (str) {
        return dates.m;
      }).replace(/s+/, function (str) {
        return dates.s;
      });
    },
    /*
     * 毫秒转化日期
     * @param  {[ number|string ]} time  毫秒数或者秒数
     * @param  {{ string }} format 日期格式
     */
    getFormatTime: function (time, format) {
      var that = this;
      var time = (time + '').length == 13 ? parseInt(time) : parseInt(time) * 1e3;
      var dates = toString(new Date(time));
      format = format || "yyyy-MM-dd";
      return format.replace(/y+/, function (str) {
        return dates.y.toString().substr(-str.length);
      }).replace(/M+/, function (str) {
        return dates.M;
      }).replace(/d+/, function (str) {
        return dates.d;
      }).replace(/h+/i, function (str) {
        return dates.h;
      }).replace(/m+/, function (str) {
        return dates.m;
      }).replace(/s+/, function (str) {
        return dates.s;
      });

      function toString(t) {
        return {
          'y': t.getFullYear(),
          'M': that.padLeft(t.getMonth() + 1, "0", 2),
          'd': that.padLeft(t.getDate(), "0", 2),
          'h': that.padLeft(t.getHours(), "0", 2),
          'm': that.padLeft(t.getMinutes(), "0", 2),
          's': that.padLeft(t.getSeconds(), "0", 2)
        };
      };
    },
    /**
     * 格式化字符串添加不足
     * @param  {[ string ]} str     需要格式化的字符串
     * @param  {[ string ]} padText 格式化字符串不足添加的参数
     * @param  {[ number ]} len     当前字符串的最小长度
     */
    padLeft: function (str, padText, len) {
      str = "" + str
      return str.length < len ? new Array((len + 1) - str.length).join(padText) + str : str;
    },
    /*
     * 验证验证码
     * @param code {{ String  }} 验证码
     * @return {{ boolean }}  成功-true  失败-false
     */
    checkCode: function(code) {
        if (!code || !/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(code)) {
            this.showFailMsg("请输入正确验证码");
            return false;
        }
        return true;
    },
    /*
     * 验证邮箱
     * @param email {{ String  }} 邮箱
     * @return {{ boolean }}  成功-true  失败-false
     */
    checkEmail: function(email) {
        if (!email || !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)) {
            this.showFailMsg("请输入正确邮箱");
            return false;
        }
        return true;
    },
    /*
     * 身份证验证
     * @param code {{ String  }} 验证码
     * @return {{ boolean }}  成功-true  失败-false
     */
    IdentityCodeValid: function(code) {
        var pass = true;
        if (!code || !/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/.test(code)) {
            this.showFailMsg("无效身份证号码");
            pass = false;
        }
        return pass;
    },
    /*
     * 显示提示信息
     * @param msg {{ String  }} 提示信息
     * @return  无
     */
    showFailMsg: function(msg) {
        wx.hideToast();
        wx.showModal({
            title: '提示',
            content: msg,
            confirmColor: "#6fabdd",
            cancelColor: "#dde3e8",
            showCancel: false
        });
    },
    /*
      * 显示提示信息
      * @param msg {{ String  }} 提示信息
      * @return  无
      */
    showTitleMsg: function (title,msg) {
      wx.hideToast();
      wx.showModal({
        title: title,
        content: msg,
        showCancel: false,
        confirmColor:"#6fabdd"
      });
    },

    /*
     * 显示提示信息
     * @param msg {{ String  }} 提示信息
     * @return  无
     */
    showTipMsg: function(msg, icon) {
        wx.showToast({
            title: msg || '',
            icon: icon || '',
            duration: 2000,
            mask: true,
            success:function() {
              setTimeout(function () {
                wx.hideLoading();
              }, 2000);
             
            }
        });
    },

    /*
     * 显示加载信息
     * @param msg {{ String  }} 提示信息
     * @return  无
     */
    showLoadingMsg: function(msg, icon, time) {
        wx.showToast({
            title: msg || '',
            icon: icon || "loading",
            mask: true,
            duration: time || 2000
        });
    },
    /*
     * 显示加载信息
     * @param title {{ String  }} 提示信息
     * @return  无
     */
    showLoading: function(title) {
        wx.showLoading({
            title: title || ''
        });
        setTimeout(function() {
            wx.hideLoading()
        }, 2000);
    },
    /*
     * 显示confirm框
     * @param title {{ String  }} 标题
     * @param content {{ String  }} 内容
     * @param callback {{ Object  }} 回调函数
     * @return  无
     */
    onShowModal: function(option, callback, callback1) {
        wx.showModal({
            title: option.title || "温馨提示",
            content: option.content || "",
            showCancel:  option.showCancel || true,
            confirmColor: option.confirmColor || "#ef7100",
            cancelColor: option.cancelColor || "#b0b3ba",
            confirmText: option.confirmText || "确认",
            cancelText: option.cancelText || "取消",
            success: function(res) {
                if (res.confirm) {
                    callback && callback();
                }else if (res.cancel) {
                    callback1 && callback1();
                }
            }
        })
    },
    /*
     * 显示confirm框
     * @param title {{ String  }} 标题
     * @param content {{ String  }} 内容
     * @param confirmColor {{ String  }} 确定按钮颜色
     * @param cancelColor {{ String  }} 取消按钮颜色
     * @param confirmText {{ String  }} 确定按钮文本
     * @param cancelText {{ String  }} 取消按钮文本
     * @param showCancel {{ boolean  }} 是否显示取消按钮
     * @param confirm {{ Object  }} 确定回调函数
     * @param cancel {{ Object  }} 取消回调函数
     * @return  无
     */
    showModalDialog: function(title, content, modal, confirm, cancel){
        var confirmColor = modal.confirmColor || '#6fabdd',
            cancelColor  = modal.cancelColor || '#dde3e8',
            confirmText  = modal.confirmText  || '确定',
            cancelText   = modal.cancelText || '取消',
            showCancel   = modal.showModal || true;
            wx.showModal({
                title: title,
                content: content,
                showCancel: showCancel,
                confirmColor: confirmColor,
                cancelColor: cancelColor,
                confirmText: confirmText,
                cancelText : cancelText,
                success: function(res) {
                    if(res.confirm) {
                        confirm && confirm(res);
                    }else if(res.cancel) {
                        cancel && cancel(res);
                    }
                },
                fail: function(){

                }
            })
    },
    /**
     * 隐藏加载
     */
    hideLoadingMsg: function() {
        wx.hideToast();
    },
    /*
     * 获取当前坐标
     * @param cb {{ Object }}  回调函数
     * @return params {{ Object }} 坐标集合 wgs84 gcj02
     */
    getCurrentLocation: function(cb) {
        wx.getLocation({
            type: 'gcj02',
            success: function(res) {
                cb && cb.success && cb.success(res);
            },
            fail: function() {
                cb && cb.fail && cb.fail();
            }
        });
    },
    /**
     * 获取定位地址
     */
     getCurrentAddress: function(location, callback){
        wx.request({
            url: 'https://restapi.amap.com/v3/geocode/regeo', //仅为示例，并非真实的接口地址
            data: {
              key: 'ef439c5176157223c87b50c5c9a1218a',
              location: location.join(",")
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                var data = res.data;
                if(data.status == "1"){
                    callback && callback(data);
                }
            }
          });
     },
    /*
     * 获取用户信息
     * @param cb {{ Object }}  回调函数
     * @return params {{ Object }} 用户信息集合
     */
    getUserInfoData: function(cb) {
        wx.getUserInfo({
            withCredentials: true,
            success: function(res) {
              console.log(res);
                cb && cb.success && cb.success(res);
            },
            fail: function(res) {
                cb && cb.fail && cb.fail();
            }
        });
    },
    /* 触摸开始事件
     * 设置方法
     * app.flag_hd = true;
     * clearInterval(app.interval);
     * app.time = 0;
     **/
    touchStartPage: function (event) {
        var that = this;
        that.touchDot = event.touches[0].pageX; // 获取触摸时的原点
        // 使用js计时器记录时间    
        that.interval = setInterval(function () {
          that.time++;
        }, 100);
    },
    // 触摸结束事件
    touchEndPage: function (event, leftBackCall, rightBackCall) {
        var that = this,
            touchDot = that.touchDot,
            time = that.time,
            flag_hd = that.flag_hd,
            touchMove = event.changedTouches[0].pageX;
        // 向左滑动   
        if (touchMove - touchDot <= -40 && time < 10 && flag_hd == true) {
          that.flag_hd = false;
          //执行切换页面的方法
          console.log("向右滑动");
          rightBackCall && rightBackCall();
        }
        // 向右滑动   
        if (touchMove - touchDot >= 40 && time < 10 && flag_hd == true) {
          that.flag_hd = false;
          //执行切换页面的方法
          console.log("向左滑动");
          leftBackCall && leftBackCall();
        }
        clearInterval(that.interval); // 清除setInterval
        that.time = 0;
    },
    // 拆分数组
    sliceArray: function(array, size){
        var result = [];
        for (var i = 0; i < Math.ceil(array.length / size); i++) {
            var start = i * size;
            var end = start + size;
            result.push(array.slice(start, end));
        }
        return result;
    },
    /**
     * 拨打电话
     */
     makePhoneCall: function(telephone){
        var that = this,
            content = "你将要拨打的电话：" + telephone;
            if(!telephone || telephone==""){
               that.showFailMsg("发帖人很懒，不想给手机号");
               return;
            }
            that.onShowModal({
              title: "温馨提示",
              content:  content,
              confirmText: "拨打",
            }, function(){
                wx.makePhoneCall({
                  phoneNumber: telephone
                });
            }); 
    },
    /**
    * 拼接图片
    */
    getImageData: function(imgs){
      var that = this, imgUrls = [], imgFiles = [];
      if(imgs && imgs!=""){
          if(imgs.indexOf(",")>0){
              var imgArr = imgs.split(",");
              for(var i = 0, len = imgArr.length; i < len; i++){
                  var item = imgArr[i],
                      imgPath = that.imgHost + '/'+ item + '.jpg';
                  imgUrls.push(imgPath);
              }
          }else{
              var imgPath = that.imgHost + '/'+ imgs + '.jpg';
              imgUrls.push(imgPath);
          }
      }
      return imgUrls;
    },
    // 打开地图
    openMap: function (latitude, longitude) {
       if((!latitude||latitude=="") || (!longitude||longitude=="")){
         return;
       }
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 12
        });
    },
    // 去空格
    trim: function(str){ 
      return str.replace(/(^\s*)|(\s*$)/g, ""); 
    },
    // 截取限制内容
    splitContent: function(data, core){
       var that = this, content = "";
       if(data && data!=""){
           if(data.length > core){
              content = data.substring(0, core)+'...';
           }else{
              content = data;
           }
       }
       return content;
    },
    // 注册用户
    userRegister: function(data, callback){
        var that = this;
        that.register(data, {
          success: function(res){
             var user = res.data,
                 userInfo = {
                    userId: user.userId,
                    token: user.token,
                    openId: user.openId,
                    headImage: data.headImage,
                    nickName: data.nickName,
                    telephone: ''
                };
             if(user.userId){
                wx.setStorageSync("userInfo", userInfo);
                that.toLogin(user.userId, callback);
             }
          },
          error: function(res){
             // that.userRegister(data);
          }
      });
    },
    /**
     * 用户登录
     */
     toLogin: function(userId, callback){
        var that = this;
        that.login({
            userId: userId
        },
        {
           success: function(res){
              callback&&callback();
           },
           error: function(res){
              // that.toLogin(userId);
           }
        });
     },
    // 获取位置
    getPosition: function(callback){
        var that = this;
        that.getCurrentLocation({
            success: function(res){
                var userInfo = wx.getStorageSync('userInfo'),
                    location = [res.longitude,res.latitude];
                    userInfo.location = location;
                  that.getCurrentAddress(location, function(rs){
                     var regeocode = rs.regeocode,
                         addressComponent = regeocode.addressComponent,
                         adcode = addressComponent.adcode,
                         district = addressComponent.district;

                         that.findRegionByAdcode({
                            adcode: adcode
                           },{
                            success: function(res){
                               var code = res.data;
                               userInfo.adcode = code.adcode;
                               userInfo.district = code.name;
                               wx.setStorageSync("userInfo", userInfo);
                               callback && callback(userInfo);
                            },
                            error: function(){
                               wx.setStorageSync("userInfo", userInfo);
                               callback && callback(userInfo);
                            }
                         });
                         
                  });
              }
          });
    },
    /**
     * 获取userId
     * @interface  '/user/register'
     * @param {{ String }} code,
     * @param {{ String }} headImage
     * @param {{ String }} nickName
     */
    register: function (param, cb) {
       this.ajax('user/register', param, null, cb);
    },
    /**
     * 登录
     * @interface  '/user/login'
     * @param {{ String }} code,
     * @param {{ String }} headImage
     * @param {{ String }} nickName
     */
    login: function (param, cb) {
       this.ajax('user/login', param, null, cb);
    },
    /**
     * 每次进入个人中心时调用
     * @interface  '/user/getUserInfo'
     */
    getUserInfo: function (param, cb) {
       this.ajax('user/getUserInfo', param, null, cb);
    },
    /**
     * 获取banner图片
     * @interface  '/banner/getBanner'
     */
    getBanner: function (param, cb) {
       this.ajax('banner/getBanner', param, null, cb);
    },
    /**
     * 发布帖子
     * @interface  '/news/releaseNews'
     * @param {{ Int }} stick, 是否置顶
     * @param {{ Int }} days 置顶天数
     * @param {{ Int }} cost 置顶费用
     * @param {{ String }} telephone 手机号码
     * @param {{ String }} code, 手机验证码
     * @param {{ Int }} userId  用户Id
     * @param {{ Int }} categoryId
     * @param {{ String }} content
     * @param {{ String }} location 当前位置
     * @param {{ String }} longitude 经度
     * @param {{ String }} latitude 纬度
     * @param {{ String }} imgs 图片id
     */
    releaseNews: function (param, cb) {
       this.ajax('news/releaseNews', param, null, cb);
    },
    /**
     * 获取帖子详情
     * @interface  '/news/getNewsById'
     * @param {{ Int }} id, 帖子Id
     */
    getNewsById: function (param, cb) {
       this.ajax('news/getNewsById', param, null, cb);
    },
    /**
     * 根据所在区域获取帖子类别
     * @interface  '/newsCategory/getCategoryByRegion'
     * @param {{ Int }} regionId, 区域Id
     */
    getCategoryByRegion: function (param, cb) {
       this.ajax('newsCategory/getCategoryByRegion', param, null, cb);
    },
    /**
     * 根据所在区域及帖子类别统计总阅读量和评论量
     * @interface  '/newsCategory/getCategoryCount'
     * @param {{ Int }} region 区域
     * @param {{ Int }} categoryId 类别Id
     */
    getCategoryCount: function (param, cb) {
       this.ajax('newsCategory/getCategoryCount', param, null, cb);
    },
    /**
     * 根据id删除帖子
     * @interface  '/newsCategory/getCategoryByRegion'
     * @param {{ Int }} id, 帖子Id
     */
    deleteNews: function (param, cb) {
       this.ajax('news/deleteNews', param, null, cb);
    },
    /**
     * 获取手机短信验证码
     * @interface  '/news/getAuthCode'
     * @param {{ String }} telephone, 手机号码
     */
    getAuthCode: function (param, cb) {
       this.ajax('news/getAuthCode', param, null, cb);
    },
    /**
     * 根据选择的排序要求分页显示帖子内容
     * @interface  '/news/getByPage'
     * @param {{ Int }} order, 1-智能排序 2-按最新排序 3-按热度排序
     * @param {{ Int }} current, 当前页
     */
    getByPage: function (param, cb) {
       this.ajax('news/getByPage', param, null, cb);
    },
    /**
     * 首页根绝条件全文检索帖子
     * @interface  '/news/searchNews'
     * @param {{ String }} conditon, 检索条件
     * @param {{ Int }} current, 当前页
     */
    searchNews: function (param, cb) {
       this.ajax('news/searchNews', param, null, cb);
    },
    /**
     * 获取当前用户的所有发帖
     * @interface  '/news/getMyNews'
     * @param {{ Int }} current, 当前页
     */
    getMyNews: function (param, cb) {
       this.ajax('news/getMyNews', param, null, cb);
    },
    /**
     * 验证手机短信验证码
     * @interface  '/news/veriAuthCode'
     * @param {{ String }} code, 验证码
     * @param {{ String }} telephone, 手机号码
     */
    veriAuthCode: function (param, cb) {
       this.ajax('news/veriAuthCode', param, null, cb);
    },
    /**
     * 提交合伙人申请
     * @interface  '/agent/addAgent'
     * @param {{ String }} sheng 省
     * @param {{ String }} shi 市
     * @param {{ String }} xian 县
     * @param {{ String }} descp 优势
     * @param {{ String }} name 市
     * @param {{ String }} telephone 手机号码
     */
    addAgent: function (param, cb) {
       this.ajax('agent/addAgent', param, null, cb);
    },
    /**
     * 获取点赞列表
     * @interface  '/agent/addAgent'
     * @param {{ int }} current 当前页
     */
    getLike: function (param, cb) {
       this.ajax('newsLike/getLike', param, null, cb);
    },
    /**
     * 获取点赞列表
     * @interface  '/agent/addAgent'
     * @param {{ int }} id 评论或点赞Id
     * @param {{ int }} type 1表示对帖子点赞，2表对评论点赞
     */
    addLike: function (param, cb) {
       this.ajax('newsLike/addLike', param, null, cb);
    },
    /**
     * 获取评论列表
     * @interface  '/newsComment/getComment'
     * @param {{ int }} current 当前页
     */
    getComment: function (param, cb) {
       this.ajax('newsComment/getComment', param, null, cb);
    },
    /**
     * 删除评论列表
     * @interface  '/newsComment/deleteComment'
     * @param {{ int }} id 评论Id
     */
    deleteComment: function (param, cb) {
       this.ajax('newsComment/deleteComment', param, null, cb);
    },
    /**
     * 发表评论及回复
     * @interface  '/newsComment/addComment'
     * @param {{ int }} pid 父评论ID,如果为一级评论，值为0
     * @param {{ String }} content 评论内容
     * @param {{ int }} newsId 帖子ID
     */
    addComment: function (param, cb) {
       this.ajax('newsComment/addComment', param, null, cb);
    },
    /**
     * 获取纬度消息数 
     * @interface  '/statistics/getUnreadAmount'
     */
    getUnreadAmount: function (param, cb) {
       this.ajax('statistics/getUnreadAmount', param, null, cb);
    },
    /**
     * 根据日期和adcode获取天气（最多获取当前日期的后三天天气） 
     * @interface  '/weather/getWeather'
     * @param {{ String }} adcode 城市编码
     * @param {{ String }} date 日期（格式为 yyyy-MM-dd HH:mm:ss）
     */
    getWeather: function (param, cb) {
       this.ajax('weather/getWeather', param, null, cb);
    },
    /**
     * 分类别展示帖子
     * @interface  '/news/getByCategory'
     * @param {{ Int }} categoryId 类别Id
     * @param {{ String }} region 选择的区域(县城）
     * @param {{ Int }} current 当前页
     */
    getByCategory: function (param, cb) {
       this.ajax('news/getByCategory', param, null, cb);
    },
    /**
     * 分类别展示帖子
     * @interface  '/inform/addInform'
     * @param {{ Int }} userId 被举报用户Id
     * @param {{ String }} reason 举报原因
     * @param {{ String }} image 举报图片地址
     */
    addInform: function (param, cb) {
       this.ajax('inform/addInform', param, null, cb);
    },
    /**
     * 添加关注
     * @interface  '/newsAttent/addAttent'
     * @param {{ Int }} categoryId 帖子类别Id
     */
    addAttent: function (param, cb) {
       this.ajax('newsAttent/addAttent', param, null, cb);
    },
    /**
     * 取消关注
     * @interface  '/newsAttent/deleteAttent'
     * @param {{ Int }} id 关注id
     */
    deleteAttent: function (param, cb) {
       this.ajax('newsAttent/deleteAttent', param, null, cb);
    },
    /**
     * 获取当前用户的关注列表
     * @interface  '/newsAttent/getAttent'
     * @param {{ Int }} id 关注id
     */
    getAttent: function (param, cb) {
       this.ajax('newsAttent/getAttent', param, null, cb);
    },
    /**
     * 添加收藏
     * @interface  '/newsAttent/addAttent'
     * @param {{ Int }} newsId 帖子Id
     */
    addCollection: function (param, cb) {
       this.ajax('newsCollect/addCollection', param, null, cb);
    },
    /**
     * 取消收藏
     * @interface  '/newsCollect/addCollection'
     * @param {{ Int }} id 收藏id
     */
    deleteCollection: function (param, cb) {
       this.ajax('newsCollect/deleteCollection', param, null, cb);
    },
    /**
     * 获取当前用户的收藏列表
     * @interface  '/newsCollect/getCollection'
     * @param {{ Int }} current 当前页
     */
    getCollection: function (param, cb) {
       this.ajax('newsCollect/getCollection', param, null, cb);
    },
    /**
     * 获取所有区域的树状结构
     * @interface  '/region/getRegionTree'
     */
    getRegionTree: function (param, cb) {
       this.ajax('region/getRegionTree', param, null, cb);
    },
    /**
     * 获取所有区域的树状结构
     * @interface  '/region/findRegionByAdcode'
     */
    findRegionByAdcode: function (param, cb) {
       this.ajax('region/findRegionByAdcode', param, null, cb);
    },
    /**
     * 根据县名搜索已开通区域
     * @interface  '/region/searchRegion'
     * @param {{ Int }} xian 县
     */
    searchRegion: function (param, cb) {
       this.ajax('region/searchRegion', param, null, cb);
    },
    /**
     * 点击用户头像时调用调用
     * @interface  '/user/getUserInfoById'
     * @param {{ Int }} userId 用户Id
     */
    getUserInfoById: function (param, cb) {
       this.ajax('user/getUserInfoById', param, null, cb);
    },
    /**
     * 先调用获取短信验证码接口获取验证码，再调用此接口更换手机号
     * @interface  '/user/changeTelephone'
     * @param {{ Int }} code 验证码
     * @param {{ Int }} telephone 新手机号码
     */
    changeTelephone: function (param, cb) {
       this.ajax('user/changeTelephone', param, null, cb);
    },
    /**
     * 获取当前用户的所有发帖
     * @interface  '/news/getUserNews'
     * @param {{ Int }} userId, 当前页
     * @param {{ Int }} current, 当前页
     */
    getUserNews: function (param, cb) {
       this.ajax('news/getUserNews', param, null, cb);
    },
    /**
     * 获取当前用户的系统消息
     * @interface  '/sysMessage/getSysMessage'
     */
    getSysMessage: function (param, cb) {
       this.ajax('sysMessage/getSysMessage', param, null, cb);
    },
    /**
     * 获取当前用户的系统消息
     * @interface  '/feedback/addFeedback'
     * @param {{ String }} content, 建议内容
     * @param {{ String }} image, 图片地址
     */
    addFeedback: function (param, cb) {
       this.ajax('feedback/addFeedback', param, null, cb);
    },
    /**
     * 获取所有指定价格表
     * @interface  '/stickPeriod/getStickPeriod'
     */
    getStickPeriod: function (param, cb) {
       this.ajax('stickPeriod/getStickPeriod', param, null, cb);
    },
    /**
     * 帖子置顶微信支付
     * @interface  '/stickPeriod/payForStick'
     * @param {{ int }} fee, 金额
     */
    payForStick: function (param, cb) {
       this.ajax('stickPeriod/payForStick', param, null, cb);
    },
    /**
     * 获取当天剩余免费发帖数,0或负数表示已经用完额度
     * @interface  '/statistics/getNewsRemainNum'
     * @param {{ String }} categoryId 分类Id
     */
    getNewsRemainNum: function (param, cb) {
       this.ajax('statistics/getNewsRemainNum', param, null, cb);
    }
});
