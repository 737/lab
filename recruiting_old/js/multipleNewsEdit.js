$(function() {
	var _currentIndex;
	var _addedData = {};
	var _oldData = {};
	var _newsId;
	(function init() {
		initData();
	})();
	function initData() {
		_newsId = location.hash.slice(1);
		if(!!$.isNumeric(_newsId)) {
			_newsId = Number(_newsId);
			wcm.ajaxGet({url: wcm.getApiURL("newsEdit"), data: {newsId: _newsId}}, initRender);
		} else {
			noneDataHandle();
		}
	}
	function initRender(result) {
		_currentIndex = result.length + 1;
		$.each(result, function(key, value) {
			_oldData[key+1] = {};
			_oldData[key+1].newsItemId = value.id;
			_oldData[key+1].title = value.title;
			_oldData[key+1].description = value.description;
			_oldData[key+1].newsImageId = value.news_image_id,
			_oldData[key+1].url = value.url;
		});
		$("#multiple_news_actions .top").append($("#main-news-tmpl").render(result[0]));
		$("#multiple_news_actions .form-action").append($("#news-action-tmpl").render(result));
		result.shift(0);
		$("#multiple_news_actions .bottom").append($("#sub-news-tmpl").render(result));
		$("#multiple_news_actions .news-action:first-child").show();
	}
	function noneDataHandle() {
		
	}
	//selected edit item
	$("#multiple_news_actions").on("click", ".edit-news", function(event) {
		$(".news-action").hide();
		var $thismodule = $(this).closest(".news-index");
		var thisindex = $thismodule.attr("data-index");
		var $thistmpl  = $("#action" + thisindex);
		var top = parseInt($thismodule.offset().top) - 50;
		if(!!$thistmpl.length) {
			$thistmpl.css({"margin-top": top}).fadeIn();
			return;
		};
		var $dom = $($("#news-action-empty-tmpl").render({index: thisindex}));
		$(".form-action").append($dom);
		$dom.css({'margin-top': top}).fadeIn();
	});
	//add sub tempalte
	$("#multiple_news_actions").on("click", ".add-sub-template", function(event) {
		$(".bottom").append($("#sub-news-empty-tmpl").render({index: _currentIndex}));
		_addedData[_currentIndex] =  _addedData[_currentIndex]|| {};
		_currentIndex++;
	});
	//delete
	$("#multiple_news_actions").on("click", ".delete-news", function() {
		if($(".sub-template").length < 2) {
			alert("无法删除,多条图文至少需要2条消息");
			return;
		}
		var $subtmpl = $(this).closest(".sub-template");
		var index = $subtmpl.attr("data-index");
		$("#action" + index).remove();
		$("#action1").fadeIn();
		var itemid = $subtmpl.attr("data-id");
		if(!!itemid) {
			_oldData[index]['delete'] = true;
		} else {
			_addedData = _.omit(_addedData, index);
		}
		$subtmpl.remove();
	});
	//edit title
	$("#multiple_news_actions").on("keyup", ".action-title", function(event) {
		var $actiondom = $(this).closest(".news-action");
		var index = $actiondom.attr("data-index");
		var itemid = $actiondom.attr("data-id");
		var val = $(this).val();
		$("#module" + index).find(".title").text(val);
		if(!!itemid) {
			_oldData[index].title = val;
			return;
		}
		_addedData[index].title = val;
	});
	//update img
	$("#multiple_news_actions").on("change", ".file-inline", function(event) {
		var $form = $(this).closest("form");
		var index = $(this).closest(".news-action").attr("data-index");
		var itemid = $(this).closest(".news-action").attr("data-id");
		$form.ajaxSubmit({
			success: function(result) {
				if(result.code == 200) {
					$form.next().html('<img src="' + result.data.newsImageUrl + '" id="' + result.data.newsImageId + '" width=135 height=80 /><a class="cover-delete" href="javascript:void(0)">删除</a>');
					$("#module" + index).find(".cover-img").html('<img src="' + result.data.newsImageUrl + '" id="' + result.data.newsImageId + '" width=100% height=100% />');
					if(!!itemid) {
						_oldData[index].newsImageId = result.data.newsImageId;
						return;
					}
					_addedData[index].newsImageId = result.data.newsImageId;
				}
			},
			error: function(error) {
				console.log("error: ", error);
			}
		});
	});
	//delete img
	$("#multiple_news_actions").on("click", ".cover-delete", function(event) {
		var $previewbox = $(this).closest(".preview-imgs");
		var index = $(this).closest(".news-action").attr("data-index");
		var itemid = $(this).closest(".news-action").attr("data-index");
		$("#module" + index).find(".cover-img").empty();
		$previewbox.empty();
		if(!!itemid) {
			_oldData[index] = _.omit(_oldData[index], "newsImageId");
			return;
		}
		_addedData[index] = _.omit(_addedData[index], "newsImageId");
	});
	//edit description
	$("#multiple_news_actions").on("blur", ".action-description", function(event) {
		var index = $(this).closest(".news-action").attr("data-index");
		var itemid = $(this).closest(".news-action").attr("data-id");
		if(!!itemid) {
			_oldData[index].description = $(this).val();
			return;
		}
		_addedData[index].description = $(this).val();
	});
	//edit url
	$("#multiple_news_actions").on("blur", ".link", function(event) {
		var index = $(this).closest(".news-action").attr("data-index");
		var itemid = $(this).closest(".news-action").attr("data-id");
		if(!!itemid) {
			_oldData[index].url = $(this).val();
		}
		_addedData[index].url = $(this).val();
	});
	//save
	$("#multiple_news_actions").on("click", ".save", function(event) {
		var _of = validationFormData(_oldData);
		var _nf = validationFormData(_addedData);
		console.log(_of, _nf);
		if(_of && _nf) {
			addNews(_of, _nf);
		}
	});
	function validationFormData(_formData) {
		var newData = [];
		var regexurl = /^[\S]+\.[\S]+$/;
		var flag = true;
		$.each(_formData, function(key, value) {
			if(!value.title || value.title.trim() == "") {
				wcm.alert("alert-danger", "标题不能为空");
				$(".news-action").hide();
				showCurrentTmpl(key);
				flag = false;
				return false;
			} else if(!value.newsImageId) {
				wcm.alert("alert-danger", "图片不能为空");
				$(".news-action").hide();
				showCurrentTmpl(key);
				flag = false;
				return false;
			} else if(!value.description || value.description.trim() == "") {
				wcm.alert("alert-danger", "摘要不能为空");
				$(".news-action").hide();
				showCurrentTmpl(key);
				flag = false;
				return false;
			} else if(!value.url || value.url.trim() == "" || !value.url.match(regexurl)) {
				wcm.alert("alert-danger", "链接不符合url格式");
				$(".news-action").hide();
				showCurrentTmpl(key);
				flag = false;
				return false;
			}
			newData.push(value);
		});
		if(!!flag)
			return newData;
		return false;
	}
	function addNews(oldData, newData) {
		wcm.ajaxPost({url: wcm.getApiURL("newsEdit"), data: {newsId: _newsId, oldNewsItems: oldData, addedNewsItems: newData}}, function(result) {
			location.href = baseURL + "admin/material";
		});
    }
    function showCurrentTmpl(index) {
    	var $dom = $("#action" + index);
    	var top = parseInt($("#module" + index).offset().top) - 50;
    	if(!!$dom.length) {
    		$dom.css({'margin-top': top}).fadeIn();
    		return;
    	};
		var $newdom = $($("#news-action-tmpl").render({index: index}));
		$(".form-action").append($newdom);
		$newdom.css({'margin-top': top}).fadeIn();
    }
});