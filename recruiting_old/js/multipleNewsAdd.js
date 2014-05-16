$(function() {
	var _currentIndex = 3;
	var _formData = {1: {}, 2: {}};
	//edit
	$("#multiple_news_actions").on("click", ".edit-news", function(event) {
		$(".news-action").hide();
		var $thismodule = $(this).closest(".news-index");
		var thisindex = $thismodule.attr("data-index");
		var $thistmpl  = $("#action" + thisindex);
		if(!!$thistmpl.length) {
			$thistmpl.fadeIn();
			return;
		};
		var top = parseInt($thismodule.offset().top) - 50;
		var $dom = $($("#news-action-tmpl").render({index: thisindex}));
		$(".form-action").append($dom);
		$dom.css({'margin-top': top}).fadeIn();
	});
	//add 
	$("#multiple_news_actions").on("click", ".add-sub-template", function(event) {
		$(".bottom").append($("#sub-news-tmpl").render({index: _currentIndex}));
		_formData[_currentIndex] =  _formData[_currentIndex]|| {};
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
		$subtmpl.remove();
		_formData = _.omit(_formData, index);
	});
	//edit title
	$("#multiple_news_actions").on("keyup", ".action-title", function(event) {
		var index = $(this).closest(".news-action").attr("data-index");
		var val = $(this).val();
		$("#module" + index).find(".title").text(val);
		_formData[index].title = val;
	});
	//update img
	$("#multiple_news_actions").on("change", ".file-inline", function(event) {
		var $form = $(this).closest("form");
		var index = $(this).closest(".news-action").attr("data-index");
		$form.ajaxSubmit({
			success: function(result) {
				if(result.code == 200) {
					$form.next().html('<img src="' + result.data.newsImageUrl + '" id="' + result.data.newsImageId + '" width=135 height=80 /><a class="cover-delete" href="javascript:void(0)">删除</a>');
					$("#module" + index).find(".cover-img").html('<img src="' + result.data.newsImageUrl + '" id="' + result.data.newsImageId + '" width=100% height=100% />');
					_formData[index].newsImageId = result.data.newsImageId;
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
		$("#module" + index).find(".cover-img").empty();
		$previewbox.empty();
		_formData[index] = _.omit(_formData[index], "newsImageId");
	});
	//edit description
	$("#multiple_news_actions").on("blur", ".action-description", function(event) {
		var index = $(this).closest(".news-action").attr("data-index");
		_formData[index].description = $(this).val();
	});
	//edit url
	$("#multiple_news_actions").on("blur", ".link", function(event) {
		var index = $(this).closest(".news-action").attr("data-index");
		_formData[index].url = $(this).val();
	});
	//save
	$("#multiple_news_actions").on("click", ".save", function(event) {
		validationFormData();
	});
	function validationFormData() {
		var submitData = [];
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
			submitData.push(value);
		});
		if(!!flag) {
			addNews(submitData);
		}
	}
    function addNews(submitData) {
    	wcm.ajaxPost({url: wcm.getApiURL("newsAdd"), data: submitData}, function(result) {
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