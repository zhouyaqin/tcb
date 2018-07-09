

/**
 * 计算农历
 * @author: Jonne
 ***/
 	var zyq_lunar = zyq_lunar || {};

	zyq_lunar = {
 		calendarData: [ 0xA4B,   0x5164B, 0x6A5,   0x6D4,   0x415B5, 0x2B6,   0x957,   0x2092F, 0x497,   0x60C96, 
 				0xD4A,   0xEA5,   0x50DA9, 0x5AD,   0x2B6,   0x3126E, 0x92E,   0x7192D, 0xC95,   0xD4A,
 				0x61B4A, 0xB55,   0x56A,   0x4155B, 0x25D,   0x92D,   0x2192B, 0xA95,   0x71695, 0x6CA, 
 				0xB55,   0x50AB5, 0x4DA,   0xA5B,   0x30A57, 0x52B,   0x8152A, 0xE95,   0x6AA,   0x615AA, 
 				0xAB5,   0x4B6,   0x414AE, 0xA57,   0x526,   0x31D26, 0xD95,   0x70B55, 0x56A,   0x96D,
 				0x5095D, 0x4AD,   0xA4D,   0x41A4D, 0xD25,   0x81AA5, 0xB54,   0xB6A,   0x612DA, 0x95B,
 				0x49B,   0x41497, 0xA4B,   0xA164B, 0x6A5,   0x6D4,   0x615B4, 0xAB6,   0x957,   0x5092F,
 				0x497,   0x64B,   0x30D4A, 0xEA5,   0x80D65, 0x5AC,   0xAB6,   0x5126D, 0x92E,   0xC96, 
 				0x41A95, 0xD4A,   0xDA5,   0x20B55, 0x56A,   0x7155B, 0x25D,   0x92D,   0x5192B, 0xA95,
 				0xB4A,   0x416AA, 0xAD5,   0x90AB5, 0x4BA,   0xA5B,   0x60A57, 0x52B,   0xA93,   0x40E95
 		],
 		madd: [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
 		tgString: "甲乙丙丁戊己庚辛壬癸", 
		dzString: "子丑寅卯辰巳午未申酉戌亥", 
		numString: "一二三四五六七八九十", 
		monString: "正二三四五六七八九十冬腊", 
		weekString: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'], 
		sx: "鼠牛虎兔龙蛇马羊猴鸡狗猪",
		cYear:'',
		cMonth: '',
		cDay:'',
		TheDate: '',
		init: function(){
			var that = this,
				currentDate = new Date(), 
				yy = currentDate.getFullYear(), 
				mm = currentDate.getMonth()+1, 
				dd = currentDate.getDate(), 
				ww = currentDate.getDay(), 
				ss = parseInt(currentDate.getTime() / 1000); 
				if (yy < 100) yy = "19" + yy;
				if (mm < 10) mm = "0" + mm;
				if (dd < 10) dd = "0" + dd; 
				return {
					year: yy||'',
					month: mm||'',
					day: dd||'',
					week: that.weekString[ww]||'',
					second: ss||'',
					lunar: that.getLunarDay(yy,mm,dd)
				}
		},
		getBit: function(m,n){ 
			return (m>>n)&1; 
		},
		getLunarDay: function(solarYear, solarMonth, solarDay){  
			var that = this; 
			if(solarYear<1921 || solarYear>2020){ 
				return ""; 
			}else{ 
				solarMonth = (parseInt(solarMonth)>0) ? (solarMonth-1) : 11; 
				that.e2c(solarYear,solarMonth,solarDay); 
				return that.getcDateString(); 
			} 
		},
		//农历转换 
		e2c: function(){
			var that = this; 
				that.TheDate = (arguments.length!=3) ? new Date() : new Date(arguments[0],arguments[1],arguments[2]); 
			var total, m, n, k; 
			var isEnd = false,
			    tmp = that.TheDate.getYear(); 
			if(tmp < 1900){ 
				tmp += 1900; 
			} 
			total = (tmp-1921)*365+Math.floor((tmp-1921)/4)+that.madd[that.TheDate.getMonth()]+that.TheDate.getDate()-38; 
		 
			if(that.TheDate.getYear()%4==0&&that.TheDate.getMonth()>1) { 
				total++; 
			} 
			for(m=0;;m++){ 
				k=(that.calendarData[m]<0xfff)?11:12; 
				for(n=k;n>=0;n--){ 
					if(total<=29+that.getBit(that.calendarData[m],n)){ 
						isEnd = true; break; 
					} 
					total=total-29-that.getBit(that.calendarData[m],n); 
				} 
				if(isEnd) break; 
			} 
			that.cYear = 1921 + m; 
			that.cMonth = k-n+1; 
			that.cDay = total; 
			if(k==12){ 
				if(that.cMonth==Math.floor(that.calendarData[m]/0x10000)+1){ 
					that.cMonth=1-that.cMonth; 
				} 
				if(that.cMonth>Math.floor(that.calendarData[m]/0x10000)+1){ 
					that.cMonth--; 
				} 
			} 
		},
		getcDateString: function(){ 
			var that = this,
				tmp = ""; 
			if(that.cMonth < 1){ 
				tmp += "(闰)"; 
				tmp += that.monString.charAt(-that.cMonth-1); 
			}else{ 
				tmp += that.monString.charAt(that.cMonth-1); 
			} 
			tmp += "月"; 
			tmp += (that.cDay<11)?"初":((that.cDay<20)?"十":((that.cDay<30)?"廿":"三十")); 
			if (that.cDay%10!=0||that.cDay==10){ 
				tmp += that.numString.charAt((that.cDay-1)%10); 
			} 
			return tmp; 
		}

 	}

 module.exports = zyq_lunar;