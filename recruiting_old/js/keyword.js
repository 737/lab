$(document).ready(function() {
	var _KEY_WORD_EDIT_TPL = "#keyword_edit";
	var _KEY_WORD_LIST_ITEM_TPL = "#keyword_list_item";
	var keyword = keyword || {};
	
	keyword.clonedItem = null;
	keyword._colnedCount = 0;
	
	keyword.init = function () {
		wcm.ajaxGet({url: wcm.getApiURL("keyWordList")},
			function(result) {
				if (result.length > 0) {
					var _jsonDta = {};
					for (var i = 0; i < result.length; i++) {
						_jsonDta.keyword_id = result[i].id;
						_jsonDta.keyword_name = result[i].name;
						_jsonDta.keyword_code = result[i].keycode;
						_jsonDta.reply_id = result[i].reply_id;
						_jsonDta.reply_type = result[i].reply_type;
						_jsonDta.fuzzy = result[i].fuzzy;
						$("#keyword-list-group").append($(_KEY_WORD_LIST_ITEM_TPL).render(_jsonDta));
					}
				}
			}
		)
	}();
	
	keyword.showEditForm = function (selector, formInitData) {
		keyword.hideEditForm();
	
		var _templateHtml = "";
	
		if (!formInitData) {
			formInitData = {keyword_id: "", keyword_name: "", keyword_code: "", fuzzy: true, reply_id: "", reply_type: ""};
		}
	
		_templateHtml = $(_KEY_WORD_EDIT_TPL).render(formInitData);
	
		if (typeof selector === 'string') {
			$(selector).append(_templateHtml);
		} else if (typeof selector === 'object') {
			keyword.clonedItem = selector.clone();
			selector.replaceWith(_templateHtml);
		}
	};
	
	keyword.hideEditForm = function (replaceItem) {
		var selector = $(".list-group-item .keyword-form").parent();
		
		if (selector.length > 0) {
			if (replaceItem) {
				selector.replaceWith(replaceItem);
			} else {
				if (keyword.clonedItem !== null) {
					selector.replaceWith(keyword.clonedItem);
				} else {
					$(selector).remove();
				}
			}
			keyword.clonedItem = null;
		}
	};
	
	keyword.collectFormDataToJson = function (formSelector) {
		var formData = formSelector.formToArray();
		var formDataToJson = {};
		for (var i = 0; i < formData.length; i++) {
			switch (formData[i].name) {
				case "keyword_id":
					formDataToJson.keyword_id = formData[i].value;
					break;
				case "keyword_name":
					formDataToJson.keyword_name = formData[i].value;
					break;
				case "fuzzy":
					formDataToJson.fuzzy = formData[i].value;
					break;
				case "keyword_code":
					formDataToJson.keyword_code = formData[i].value;
					break;
				case "reply_id":
					formDataToJson.reply_id = formData[i].value;
					break;
				case "reply_type":
					formDataToJson.reply_type = formData[i].value;
					break;
			}
		}
		
		 return formDataToJson;
	};
	
	keyword.save = function () {
		var formSelector = $('.list-group-item .keyword-form');
		var _data = keyword.collectFormDataToJson(formSelector);
		var _url = wcm.getApiURL("addKeyword");
		if (_data.keyword_id) {
			_url = wcm.getApiURL("updateKeyword");
		}
		wcm.ajaxPost({url: _url, data: _data}, 
				function (result) {
				_data.keyword_id = result;
				keyword.hideEditForm($(_KEY_WORD_LIST_ITEM_TPL).render(_data));
		});
	};
	
	keyword.del = function (id, callback) {
		wcm.ajaxDelete({url: wcm.getApiURL("deleteKeyWord"), data: {keyword_id: id}}, callback);
	};
	
	keyword.saveText = function (text, callback) {
		if (text.length > 0) {
			wcm.ajaxPost({url: wcm.getApiURL("saveKeywordReplyText"), data: {content: text}}, 
					function (result) {
					callback(result);
			});
		}
	};
	keyword.getActiveKeywordInfo = function () {
		var _hiddenFormSelector = $("#keyword-list-group").find(".list-hidden-value.active");
		var _form_data = keyword.collectFormDataToJson(_hiddenFormSelector);
		return _form_data;
	}
	
	keyword.bindReplyInfo = function (data, callback) {
		wcm.ajaxPost({url: wcm.getApiURL("bindKeywordReplyInfo"), data: data}, callback);
	}
	
	keyword.unbindReplyInfo = function (id) {
		wcm.ajaxPost({url: wcm.getApiURL("unbindKeywordReplyInfo"), data: {keyword_id: id}}, function () {
			wcm.alert("alert-success", "解除绑定成功!");
		});
	}
	
	keyword.clearOldReplyInfo = function (filter) {
		var selectors = $(".tab-content-wrapper .tab-pane");
		var _clearContent = function (selector) {
			if (selector.find("textarea").length > 0) {
				selector.find("textarea").val("");
			} else {
				selector.empty();
			}
		};
		
		for (var i = 0; i < selectors.length; i++) {
			if ('notActive' === filter) {
				if ($(selectors[i]).attr("class") !== "tab-pane clearfix active") {
					_clearContent($(selectors[i]));
				}
			} else {
				_clearContent($(selectors[i]));
			}
		}
	}
	
	keyword.getReplyInfo = function (_url, _data, callback) {
		wcm.ajaxGet({url: _url, data: _data}, function (result) {
			callback(result);
		});
	};
	
	keyword.renderedHtml = function (result, type, reply_id) {
		var _container = "";
		
		switch (type) {
		case "1" :
			_container = $("#msg_content_replymsg");
			_container.find("textarea").val(result);
			break;
		case "2" :
			_container = $("#msg_img_replymsg ");
			
			break;
		case "3" :
			_container = $("#msg_imgmsg_replymsg");
			if (result.length == 1) {
				metariaApi.renderData("../tmpl/singleTextMsgTpl.html", _container, [{createTime: "", newsId: reply_id, items: result}]);
			} else {
				metariaApi.renderData("../tmpl/multipleTextMsgTpl.html", _container, [{createTime: "", newsId: reply_id, items: result}]);
			}
			break;
		case "4" :
			_container = $("#msg_audio_replymsg");
			metariaApi.renderData("../tmpl/audioMsgTpl.html", _container, result);
			break;
		case "5" :
			_container = $("#msg_video_replymsg");
			metariaApi.renderData("../tmpl/videoMsgTpl.html", _container, result);
			break;
		case "6" :
			_container = $("#msg_music_replymsg");
			metariaApi.renderData("../tmpl/musicMsgTpl.html", _container, result);
			break;
		}
	
		$(".tab-content-wrapper .tab-pane").removeClass('active');
		_container.addClass('active');
	}
	
	keyword.selectItem = function (context) {
		var _selectItem = $(context).clone();
		$(".modal").modal('hide');
		var _type = $(".msg-reply-conf-nav li.active").attr('type');
		var _infoContainer = metariaApi.getReplyInfoTplContainerApi(_type);
		_infoContainer.container.empty().append(_selectItem);
		$(".tab-content-wrapper .tab-pane").removeClass('active');
		_infoContainer.container.addClass('active');
	}
	
	$("#add-keyword-btn").click(function () {
		keyword.showEditForm("#keyword-list-group");
	});
	
	$("#keyword-list-group").on('click', '.edit-keyword', function () {
		var _hiddenFormSelector = $(this).parent().find(".list-hidden-value");
		keyword.showEditForm($(this).parent(), keyword.collectFormDataToJson(_hiddenFormSelector));
	});
	
	$("#keyword-list-group").on('click', '.delete-keyword', function () {
		var _that = this;
		keyword.hideEditForm();
		var _hiddenFormSelector = $(this).parent().find(".list-hidden-value");
		var _form_data = keyword.collectFormDataToJson(_hiddenFormSelector);
		keyword.del(_form_data.keyword_id, function () {
			$(_that).parent().remove();
		});
	});
	
	$("#keyword-list-group").on('click', '.save-keyword', function () {
		keyword.save();
	});
	
	$("#keyword-list-group").on('click', '.edit-reply-keyword-info', function () {
		var _hidden_form_data = keyword.collectFormDataToJson($(this).parent().find(".list-hidden-value"));
		$("#keyword-list-group a.list-group-item").removeClass("active");
		$(this).parent().addClass("active");
		$(this).parent().find(".list-hidden-value").addClass("active");
		keyword.hideEditForm();
		$(".keyword-reply-tip").hide();
		$(".reply-content").show();
		
		if (_hidden_form_data.reply_id) {
			$(".msg-reply-conf-nav li").removeClass("active");
			$(".msg-reply-conf-nav li[type=" + _hidden_form_data.reply_type + "]").addClass("active");
			// get reply info and set tab class active
			var _url = metariaApi.getReplyInfoApi(_hidden_form_data.reply_type);
			var _requestData = metariaApi.coverData(_hidden_form_data.reply_id, _hidden_form_data.reply_type);
			keyword.getReplyInfo(_url, _requestData, function (result) {
				// render reply info
				keyword.renderedHtml(result, _hidden_form_data.reply_type, _hidden_form_data.reply_id);
			});
		} else {
			keyword.clearOldReplyInfo();
			$(".msg-reply-conf-nav li").removeClass("active");
			$(".msg-reply-conf-nav li:first").addClass("active");
			$(".tab-content-wrapper .tab-pane").removeClass('active');
			$(".tab-content-wrapper .tab-pane:first").addClass('active');
		}
	});
	
	$("#keyword-list-group").on('click', '.cancel-save-keyword', function () {
		keyword.hideEditForm();
	});
	
	$(".keyword-reply-message").on('click', 'ul > li', function () {
		var _type = $(this).attr("type");
		var _selector = $(".modal-body.news-list");
		var _modal = function () {
			_selector.empty();
			$(".modal").modal('show');
		};
		
		switch(_type) {
			case "1":				//文本
				break;
			case "2": 				//图片
				_modal();
				//TODO
				break; 
			case "3": 				//图文
				_modal();
				metariaApi.renderTextMessageApi(_selector);
				break;
			case "4": 				//音频
				_modal();
				metariaApi.renderAudioApi(_selector);
				break;
			case "5": 				//视频
				_modal();
				metariaApi.renderVideoApi(_selector);
				break;
			case "6": 				//视频
				_modal();
				metariaApi.renderMusicApi(_selector);
				break;
		}
	});
	
	$(".msg-reply-save").click(function () {
		var _type = $(".msg-reply-conf-nav li.active").attr("type");
		var _reply_id = null;
		var _keywordInfo = keyword.getActiveKeywordInfo();
		var _bindReplyInfo = function (replyId, type, keywordId) {
			if (replyId && type && keywordId) {
				keyword.bindReplyInfo({keyword_id: parseInt(keywordId), reply_id: parseInt(replyId), reply_type: parseInt(type)}, function (id) {
					keyword.clearOldReplyInfo('notActive');
					$("#keyword-list-group").find(".list-group-item.active").find("input[name=reply_type]").val(_type);
					$("#keyword-list-group").find(".list-group-item.active").find("input[name=reply_id]").val(id);
					wcm.alert("alert-success", "绑定成功!");
				});
			}
		}
		
		switch (_type) {
		case 1:
			keyword.saveText($("#msg_content_replymsg").find("textarea").val(), function (result){
				_reply_id = result.id;
				_bindReplyInfo(_reply_id, _type, _keywordInfo.keyword_id);
			});
			break;
		case "2":
			_reply_id = $(".tab-content-wrapper .tab-pane.active .img-template").attr("data-id");
			_bindReplyInfo(_reply_id, _type, _keywordInfo.keyword_id);
			break;
		case "3":
			_reply_id = $(".tab-content-wrapper .tab-pane.active .news-template").attr("id");
			_bindReplyInfo(_reply_id, _type, _keywordInfo.keyword_id);
			break;
		case "4":
			_reply_id = $(".tab-content-wrapper .tab-pane.active .audio-template").attr("data-id");
			_bindReplyInfo(_reply_id, _type, _keywordInfo.keyword_id);
			break;
		case "5":
			_reply_id = $(".tab-content-wrapper .tab-pane.active .video-template").attr("data-id");
			_bindReplyInfo(_reply_id, _type, _keywordInfo.keyword_id);
			break;
		case "6":
			_reply_id = $(".tab-content-wrapper .tab-pane.active .music-template").attr("data-id");
			_bindReplyInfo(_reply_id, _type, _keywordInfo.keyword_id);
			break;
		}
	});
	
	$(".msg-reply-del").click(function () {
		keyword.clearOldReplyInfo();
		var _keywordInfo = keyword.getActiveKeywordInfo();
		keyword.unbindReplyInfo(_keywordInfo.keyword_id);
	});
	

	$(".modal-body.news-list").on('click', '.news-template', function () {
		keyword.selectItem(this);
	});
	
	$(".modal-body.news-list").on('click', '.music-template', function () {
		keyword.selectItem(this);
	});
	
	$(".modal-body.news-list").on('click', '.video-template', function () {
		keyword.selectItem(this);
	});
	
	$(".modal-body.news-list").on('click', '.audio-template', function () {
		keyword.selectItem(this);
	});
});