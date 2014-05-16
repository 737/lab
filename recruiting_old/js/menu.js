$(function() {
	(function init() {
		getMenuList();
	})();
	var $modalDom = $("#menu_modal");
	var $addGroup = $("#menu_added");
	$("#menu").on("click", "#added_btn", function(event) {
		if($(".level0").length > 2) {
			wcm.alert("alert-danger", "最多只能有3个一级菜单");
			return;
		}
		$addGroup.removeClass("hide");
	});
	$addGroup.on("click", ".cancel", function() {
		$addGroup.addClass("hide");
	});
	$addGroup.on("click", ".add", function() {
		addMenu($addGroup.find("input[type=text]").val());
	});
	$("#menu").on("click", ".menu-delete", function() {
		var $item = $(this).closest(".menu-show");
		var flag = confirm("确认删除?");
		if(!flag) {
			return;
		}
		var id = $(this).closest(".menu-show").attr("data-id");
		wcm.ajaxDelete({url: wcm.getApiURL("menu") + "/" + id}, function(response) {
			if($item.hasClass("level0")) {
				$item.parent().remove();
				return;
			}
			$item.remove();
		});
	});
	$("#menu").on("click", ".menu-add-sub", function() {
		var $item = $(this).closest(".menu-item");
		if($item.find(".menu-sub-add").length > 0) {
			return;
		}
		if($item.find(".level1").length > 4) {
			wcm.alert("alert-danger", "每个一级菜单下最多只可以创建5个二级菜单");
			return;
		}
		var parentId = $item.attr("data-id");
		$item.append($("#menu_sub_add_tmpl").render({parent_id: parentId}));
	});
	$("#menu").on("click", ".menu-sub-add .cancel", function() {
		$(this).closest(".menu-sub-add").remove();
	});
	$("#menu").on("click", ".menu-sub-add .add", function() {
		var content = $(this).prev().val();
		var $item = $(this).closest(".menu-item");
		var parentId = $item.attr("data-id");
		addMenu(content, parentId, $item);
	});
	$("#menu").on("click", ".menu-edit", function(event) {
		var $wrapper = $(this).closest(".show-wrapper");
		$wrapper.addClass("hide");
		$wrapper.after($("#menu_edit_tmpl").render());
	});
	$("#menu").on("click", ".menu-edit .cancel", function(event) {
		var $editDom = $(this).closest(".menu-edit");
		$editDom.prev().removeClass("hide");
		$editDom.remove();
	});
	$("#menu").on("click", ".menu-edit .add", function(event) {
		var menuId = $(this).closest(".menu-show").attr("data-id");
		var content = $(this).prev().val();
		editMenu(menuId, content, $(this).closest(".menu-edit"));
	});

	var $settingBox = $("#setting_content");
	var current_reply_id = "";
	var current_reply_type = "";
	var current_menu_id = "";
	var clicked_reply_type = "";
	var $menuItem = null;
	$("#menu").on("click", ".menu-setting", function(event) {
		if(!!$(this).closest(".menu-item").find(".level1").length && $(this).closest(".menu-show").hasClass("level0")) {
			$settingBox.html('<div class="tip">拥有二级菜单的一级菜单无法进行绑定</div>');
			return;
		}
		$menuItem = $(this);
		$settingBox.html($("#menu_setting_tmpl").render());
		current_reply_id = $(this).attr("reply_id");
		clicked_reply_type = $(this).attr("reply_type");
		current_menu_id = $(this).closest(".menu-show").attr("data-id");
		current_reply_type = 1;
		getTextHandle(current_reply_id);
	});
	//tabs
	$("#menu").on("click", ".nav-tabs li a", function(event) {
		$(this).tab("show");
		replyTypeClicked($(this).attr("data-type"));
	});
	$("#menu").on("click", ".msg-reply-save", function() {
		bindHandle();
	});
	$("#menu").on("click", ".msg-reply-del", function() {
		var flag = confirm("确定解除绑定?");
		if(!flag) {
			return;
		}
		unbindHandle();
	});
	var deffered = $.Deferred();
	$("#menu").on("click", ".apply", function() {
		var $this = $(this);
		$this.addClass("disabled");
		deffered.done(function() {
			wcm.ajaxPost({url: wcm.getApiURL("menuPublish")}, function(response) {
				wcm.alert("alert-success", "菜单应用成功");
			});
		}).done(function() {
			$this.removeClass("disabled");
		});
		deffered.resolve("and");
	});
	metariaApi.onModalEvent($modalDom, ".news-template", "#menu_pt_box");
	metariaApi.onModalEvent($modalDom, ".img-template", "#menu_p_box");
	metariaApi.onModalEvent($modalDom, ".audio-template", "#menu_audio_box");
	metariaApi.onModalEvent($modalDom, ".video-template", "#menu_video_box");
	metariaApi.onModalEvent($modalDom, ".music-template", "#menu_music_box");
	function replyTypeClicked(type) {
		switch(type) {
		case "1":
			current_reply_type = 1;
			getTextHandle(current_reply_id);
			break;
		case "2":
			current_reply_type = 2;
			$('#menu_modal').modal("show");
			$("#myModalLabel").text("请选择图文消息");
			getPtHandle();
			break;
		case "3":
			current_reply_type = 3;
			$modalDom.modal("show");
			$("#myModalLabel").text("请选择图片");
			getImgHandle();
			break;
		case "4":
			current_reply_type = 4;
			$modalDom.modal("show");
			$("#myModalLabel").text("请选择图音频消息");
			getAudioHandle();
			break;
		case "5":
			current_reply_type = 5;
			$modalDom.modal("show");
			$("#myModalLabel").text("请选择视频消息");
			getVideoHandle();
			break;
		case "6":
			current_reply_type = 6;
			$modalDom.modal("show");
			$("#myModalLabel").text("请选择音乐消息");
			getMusicHandle();
			break;
		case "7":
			current_reply_type = 7;
			getUrlHandle(current_reply_id);
			break;
		default:
			break;
		}
	}
	function bindHandle() {
		switch(current_reply_type) {
		case 1:
			bindTextHandle();
			break;
		case 2:
			bindPTHandle();
			break;
		case 3:
			bindImgHandle();
			break;
		case 4:
			bindAudioHandle();
			break;
		case 5:
			bindVideoHandle();
			break;
		case 6:
			bindMusicHandle();
			break;
		case 7:
			bindUrlHandle();
			break;
		default:
			break;
		}
	}
	function unbindHandle() {
		switch(current_reply_type) {
		case 1:
			unbindXHRHandle(1);
			break;
		case 2:
			unbindXHRHandle(2);
			break;
		case 3:
			unbindXHRHandle(3);
			break;
		case 4:
			unbindXHRHandle(4);
			break;
		case 5:
			unbindXHRHandle(5);
			break;
		case 6:
			unbindXHRHandle(6);
			break;
		case 7:
			unbindXHRHandle(7);
			break;
		default:
			break;
		}
	}
	var bindedText = "";
	function getTextHandle(reply_id) {
		$(".tab-content .text").val("");
		if(!reply_id || clicked_reply_type != current_reply_type){
			return;
		}
		wcm.ajaxGet({url: wcm.getApiURL("saveKeywordReplayText"), data: {id: parseInt(current_reply_id)}}, function(response) {
			$(".tab-content .text").val(response.content);
			bindedText = response.content;
		});
	}
	function getImgHandle() {
		$("#modal_body").empty();
		$("#menu_p_box").empty();
		wcm.ajaxGet({url: wcm.getApiURL("image")}, function(response) {
			var data = response.list;
			$.each(data, function(key, img) {
				$("#modal_body").append("<div class='col-lg-4 img-template' data-id='" + img.id + "'><img src='" + img.image_url + "' /></div>");
				if(img.id == current_reply_id && clicked_reply_type == current_reply_type) {
					$("#menu_p_box").html("<div class='col-lg-4 img-template' data-id='" + img.id + "'><img src='" + img.image_url + "' /></div>");
				}
			});
		});
	}
	function getPtHandle() {
		$("#modal_body").empty();
		$("#menu_pt_box").empty();
		var _callback = function(news, html) {
			if(news.newsId == current_reply_id && clicked_reply_type == current_reply_type) {
				$("#menu_pt_box").html($.templates(html).render(news));
			}
		};
		metariaApi.renderTextMessageApi($("#modal_body"), _callback);
	}
	function getAudioHandle() {
		$("#modal_body").empty();
		$("#menu_audio_box").empty();
		wcm.ajaxGet({url: wcm.getApiURL("voice")}, function(response) {
			var data = response.list;
			$.each(data, function(key, voice) {
				$("#modal_body").append('<div class="col-lg-6 audio-template" data-id="' + voice.id + '"><div class="content"><div class="title"><span>' + voice.name + '</span></div><audio controls="controls" src="' + voice.voice_url + '">您的浏览器不支持 audio 标签。</audio></div></div>');
				if(voice.id == current_reply_id && clicked_reply_type == current_reply_type) {
					$("#menu_audio_box").html('<div class="col-lg-6 audio-template" data-id="' + voice.id + '"><div class="content"><div class="title"><span>' + voice.name + '</span></div><audio controls="controls" src="' + voice.voice_url + '">您的浏览器不支持 audio 标签。</audio></div></div>');
				}
			});
		});
	}
	function getMusicHandle() {
		$("#modal_body").empty();
		$("#menu_music_box").empty();
		var _callback = function(music, html) {
			if(music.id == current_reply_id && clicked_reply_type == current_reply_type) {
				$("#menu_music_box").html($.templates(html).render(music));
			}
		};
		metariaApi.renderMusicApi($("#modal_body"), _callback);
	}
	function getVideoHandle() {
		$("#modal_body").empty();
		$("#menu_video_box").empty();
		var _callback = function(video, html) {
			if(video.id == current_reply_id && clicked_reply_type == current_reply_type) {
				$("#menu_video_box").html($.templates(html).render(video));
			}
		};
		metariaApi.renderVideoApi($("#modal_body"), _callback);
	}
	var bindedUrl = "";
	function getUrlHandle(reply_id) {
		$(".tab-content .urlinput").val("");
		if(!reply_id || clicked_reply_type != current_reply_type){
			return;
		}
		wcm.ajaxGet({url: wcm.getApiURL("url"), data: {id: parseInt(current_reply_id)}}, function(response) {
			$(".tab-content .urlinput").val(response.url);
			bindedUrl = response.url;
		});
	}
	function bindXHRHandle(reply_id, reply_type, menu_id) {
		if(current_reply_type == clicked_reply_type && reply_id == current_reply_id) {
			return;
		}
		wcm.ajaxPost({
			url: wcm.getApiURL("bindMenu"),
			data: {
				menu_id: menu_id,
				reply_id: reply_id,
				reply_type: reply_type
			}
		}, function(response) {
			wcm.alert("alert-success", "绑定成功");
			$menuItem.attr("reply_id", reply_id).attr("reply_type", reply_type);
			current_reply_id = reply_id;
			clicked_reply_type = reply_type;
		});
	}
	function bindTextHandle() {
		var text = $(".tab-content .text").val();
		if(text.trim() == "" || bindedText == text.trim()) {
			return;
		}
		wcm.ajaxPost({url: wcm.getApiURL("saveKeywordReplayText"), data: {
			content: text.trim()
		}}, function(response) {
			bindXHRHandle(response.id, current_reply_type, parseInt(current_menu_id));
		});
	}
	function bindUrlHandle() {
		var url = $(".tab-content .urlinput").val();
		var regex = /^\S+\.\S+$/;
		if(!url.match(regex)) {
			wcm.alert("alert-danger", "请输入合法的链接");
			return;
		}
		if(url.trim() == bindedUrl) {
			return;
		}
		wcm.ajaxPost({url: wcm.getApiURL("url"),data: {
			url: url.trim()
		}}, function(response) {
			bindXHRHandle(response.id, current_reply_type, parseInt(current_menu_id));
		});
	}
	function bindPTHandle() {
		var $dom = $("#menu_pt_box .news-template");
		if(!!$dom.length) {
			var reply_id = parseInt($dom.attr("id"));
			var reply_type = 2;
			bindXHRHandle(reply_id, reply_type, parseInt(current_menu_id));
		}
	}
	function bindImgHandle() {
		var $dom = $("#menu_p_box .img-template");
		if(!!$dom.length) {
			var reply_id = parseInt($dom.attr("data-id"));
			var reply_type = 3;
			bindXHRHandle(reply_id, reply_type, parseInt(current_menu_id));
		}
	}
	function bindAudioHandle() {
		var $dom = $("#menu_audio_box .audio-template");
		if(!!$dom.length) {
			var reply_id = parseInt($dom.attr("data-id"));
			var reply_type = 4;
			bindXHRHandle(reply_id, reply_type, parseInt(current_menu_id));
		}
	}
	function bindVideoHandle() {
		var $dom = $("#menu_video_box .video-template");
		if(!!$dom.length) {
			var reply_id = parseInt($dom.attr("data-id"));
			var reply_type = 5;
			bindXHRHandle(reply_id, reply_type, parseInt(current_menu_id));
		}
	}
	function bindMusicHandle() {
		var $dom = $("#menu_music_box .music-template");
		if(!!$dom.length) {
			var reply_id = parseInt($dom.attr("data-id"));
			var reply_type = 6;
			bindXHRHandle(reply_id, reply_type, parseInt(current_menu_id));
		}
	}
	function unbindXHRHandle(type) {
		if(!current_reply_id || clicked_reply_type != current_reply_type) {
			return;
		}
		wcm.ajaxPost({url: wcm.getApiURL("unbindMenu"), data: {menu_id: parseInt(current_menu_id)}} , function(response) {
			if(type == 1) {
				$(".tab-content .text").val("");
			} else if(type == 2) {
				$("#menu_pt_box").html("");
			} else if(type == 3) {
				$("#menu_p_box").html("");
			}  else if(type == 4) {
				$("#menu_audio_box").html("");
			} else if(type == 5) {
				$("#menu_video_box").html("");
			} else if(type == 6) {
				$("#menu_music_box").html("");
			} else if(type == 7) {
				$(".tab-content .urlinput").val("");
			}
			wcm.alert("alert-success", "解除绑定成功");
			$menuItem.attr("reply_id", null).attr("reply_type", null);
			current_reply_id = null;
			clicked_reply_type = null;
		});
	}
	function editMenu(menuId, content, $dom) {
		if(content == "" || content.trim().length == 0) {
			wcm.alert("alert-danger", "内容不能为空");
			return;
		}
		content = content.trim();
		wcm.ajaxPut({url: wcm.getApiURL("menu") + "/" + menuId, data: {name: content}}, function(response) {
			var $wrapper = $dom.prev();
			$wrapper.find("span:first").text(content);
			$dom.remove();
			$wrapper.removeClass("hide");
		});
	}
	function getMenuList() {
		wcm.ajaxGet({url: wcm.getApiURL("menuList")}, renderMenuList);
	}
	function renderMenuList(response) {
		$("#menu_list").append($("#menu_item_tmpl").render(response));
	}
	function addMenu(content, parentId, $itemDom) {
		if(content == "" || content.trim().length == 0) {
			wcm.alert("alert-danger", "信息不能为空");
			return;
		}
		content = content.trim();
		parentId = parentId ? parseInt(parentId) : 0;
		wcm.ajaxPost({url: wcm.getApiURL("menu"), data: {parent_id: parentId, name: content}}, function(response) {
			if(!parentId) {
				$("#menu_list").append($("#menu_parent_tmpl").render({menu_id: response, name: content, parent_id: parentId}));
				$addGroup.find("input[type=text]").val("");
				$addGroup.addClass("hide");
				return;
			}
			$itemDom.find(".menu-sub-add").remove();
			$itemDom.append($("#menu_sub_tmpl").render({menu_id: response, name: content, parent_id: parentId}));
		});
	};
});