var wcm = wcm || {};
wcm.mode = 'staging';
wcm.host = {
    staging: '${base.url}',
};
wcm.url = {
		userGroups: 'group/list',
		addGroup: 'group',
		editGroup: 'group/modify',
		deleteGroup: 'group',
		userList: 'user/list',
		userMove: 'user/move',
		userBatchMove: 'user/batchmove',
		activityList: 'activity/list',
		addActivity: 'activity',
		updateActivity: 'activity',
		deleteActivity: 'activity',
		newsList: "news/list",
		newsAdd: "news",
		message_response: 'cs/conversation', //'defined/message_response.json',
		message_list: 'msg/list', //'defined/message_list.json',
		message_menu: 'msg/label/list',  //'defined/message_menu.json',
		message_PutMenu: 'msg/label',
		message_deleteMenu: 'msg/label/{0}',
		message_postReply: 'cs/reply',
		newsDelete: "news",
		newsEdit: "news/edit",
		keyWordList: "keyword/list",
		addKeyword: "keyword",
		updateKeyword: "keyword/modify",
		deleteKeyWord: "keyword/delete",
		saveKeywordReplyText: "text",
		bindKeywordReplyInfo: "keyword/bind",
		unbindKeywordReplyInfo: "keyword/unbind",
		image: "image",
		voice: "voice",
		music: "music",
		video: "video",
		url: "url",
		menu: "menu",
		menuPublish: "menu/publish",
		menuList: "menu/list",
		bindMenu: "menu/reply/bind",
		unbindMenu: "menu/reply/unbind",
		getTextReply: "text",
		getTextMsgReply: "news/edit",
		getImgReply: "image/one",
		getVideoReply: "video/one",
		getAudioReply: "voice/one",
		getMusicReply: "music/one",
		questions:'/admin/questions',
		
};

wcm.getApiURL = function(name) {
    return wcm.host[wcm.mode] + wcm.url[name];
};

wcm.getQueryStringByName = function(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));

    if (result == null || result.length < 1) {
        return null;
    }
    return result[1];
};
wcm.ajaxGet = function(options, succFunc, errFunc) {
	options.async = 
	$.ajax({
		url: options.url ? options.url : null,
		type: "GET",
		dataType: options.dataType || 'json',
		async: options.async === false ? false : true,
		data: options.data ? options.data : null,
		success: function(result) {
			if(!!result.code && result.code !== 200) {
				console.log("error message: " + result.code + result.message);
				return;
			}
			var data = result.data || result;
			succFunc(data);
		},
		error: function() {
			if(!errFunc)
				return;
			errFunc();
		}
	});
};
wcm.ajaxPost = function(options, succFunc, errFunc) {
	$.ajax({
		url: options.url ? options.url : null,
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json',
		data: typeof(options.data) == 'object' ? JSON.stringify(options.data) : (options.data ? options.data : null),
		success: function(result) {
			if(result.code !== 200) {
				console.log("error message: " + result.code + result.message);
				return;
			}
			var data = result.data;
			succFunc(data);
		},
		error: function(error) {
			if(!errFunc)
				return;
			errFunc(error);
		}
	});
};
wcm.ajaxPut = function(options, succFunc, errFunc) {
	$.ajax({
		url: options.url ? options.url : null,
		type: 'PUT',
		dataType: 'json',
		contentType: 'application/json',
		data: typeof(options.data) == 'object' ? JSON.stringify(options.data) : data,
		success: function(result) {
			if(result.code !== 200) {
				console.log("error message: " + result.code + result.message);
				return;
			}
			var data = result.data;
			succFunc(data);
		},
		error: function(error) {
			if(!errFunc)
				return;
			errFunc(error);
		}
	});
};
wcm.ajaxDelete = function(options, succFunc, errFunc) {
	$.ajax({
		url: options.url ? options.url : null,
		type: "DELETE",
		dataType: 'json',
		contentType: 'application/json',
		data: typeof(options.data) == 'object' ? JSON.stringify(options.data) : options.data,
		success: function(result) {
			if(result.code !== 200) {
				console.log("error message: " + result.code + result.message);
				return;
			}
			var data = result.data;
			succFunc(data);
		},
		error: function(error) {
			if(!errFunc)
				return;
			errFunc(error);
		}
	});
};

Date.prototype.pattern = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, // 小时
        "H+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    var week = {
        "0": "\u65e5",
        "1": "\u4e00",
        "2": "\u4e8c",
        "3": "\u4e09",
        "4": "\u56db",
        "5": "\u4e94",
        "6": "\u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "")
                + week[this.getDay() + ""]);
    }
    for ( var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
                    : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};
wcm.formatTime = function (format, sTime) {
	var _this = new Date();
	if (!!sTime) {
		if (typeof sTime === 'string') {
			sTime = this.replaceAll(sTime, '-', '/');  // IOS 7.1不支持 2012-12-11 00:00:00 这种格式的 new Date()方法
		}
		_this = new Date(sTime);
	}
	
	var o = {
	    "M+": _this.getMonth() + 1, //month
	    "d+": _this.getDate(), //day
	    "h+": _this.getHours(), //hour
	    "m+": _this.getMinutes(), //minute
	    "s+": _this.getSeconds(), //second
	    "q+": Math.floor((_this.getMonth() + 3) / 3), //quarter
	    "S": _this.getMilliseconds() //millisecond
	};
	 if(!format) {
	        format = "yyyy-MM-dd hh:mm:ss";
	    }

	    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (_this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	        if (new RegExp("(" + k + ")").test(format))
	            format = format.replace(RegExp.$1,
	                RegExp.$1.length == 1 ? o[k] :
	                ("00" + o[k]).substr(("" + o[k]).length));
	    return format;
};

wcm.ajaxFormSubmit = function(selector, succFunc, errFunc) {
	selector.ajaxSubmit({
        success: function(result) {
        	if(result.code !== 200) {
				console.log("error message: " + result.code + result.message);
				return;
			}
			var data = result.data;
			succFunc(data);
        },
        error: function () {
        	if(!errFunc)
				return;
			errFunc(error);
        }
    });
}
wcm.alert = function(type, message) {
	var $tmpl = $($("#alert-tmpl").render({
		alerttype: type,
		content: message
	}));
	$("#alert").append($tmpl);
	$tmpl.slideDown(300);
	var timeout = setTimeout(function () {
		$tmpl.slideUp(300, function() {
			$tmpl.remove();
		});
		clearTimeout(timeout);
	}, 2000);

};