$(function() {
	var _newsId,
	      _newsItemId;
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
		_newsItemId = result[0].id;
		$("#news_module_box").append($("#news-module-tmpl").render(result));
		$("#news_action_box").append($("#news-action-tmpl").render(result));
	}
	function noneDataHandle() {
		
	}
	$("#single_news_actions").on("click", ".save", function(event) {
		var data = {
				title: $("input[name=title]").val(),
				description: $("textarea[name=description]").val(),
				url: $("input[name=url]").val(),
				newsImageId: parseInt($(".preview-imgs img").attr("id")),
				newsItemId: _newsItemId
			};
		var flag = validationData(data);
		if(!!flag) {
			wcm.ajaxPost({url: wcm.getApiURL("newsEdit"), data: {newsId: _newsId, oldNewsItems: [data]}}, function(result) {
				location.href = baseURL + "admin/material";
			});
		}
	});
	function validationData(data) {
		if(!data.title || data.title.trim() == "") {
			wcm.alert("alert-danger", "标题不能为空");
			return false;
		} else if (!data.newsImageId) {
			wcm.alert("alert-danger", "图片不能为空");
			return false;
		} else if(!data.description || data.description.trim() == "") {
			wcm.alert("alert-danger", "摘要不能为空");
			return false;
		} else if(!data.url || data.url.trim() == "" || !data.url.match(/^[\S]+\.[\S]+$/)) {
			wcm.alert("alert-danger", "链接不符合url格式");
			return false;
		}
		return true;
	}
	//title
	$("#single_news_actions").on("keyup", ".action-title", function(event) {
		$(".module-title .title").html($(this).val());
	});
	//description
	$("#single_news_actions").on("keyup", ".action-description", function(event) {
		$(".module-description .description").html($(this).val());
	});
	//cover image
	$("#single_news_actions").on("change", "#cover_img", function(event) {
		 $("#upload_file_form").ajaxSubmit({
			success: function(result) {
				if(result.code == 200) {
					$(".module-cover").html('<img src="' + result.data.newsImageUrl + '" id="' + result.data.newsImageId + '" width=100% height=100% />');
					$(".preview-imgs").html('<img src="' + result.data.newsImageUrl + '" id="' + result.data.newsImageId + '" width=135 height=80 /><a class="cover-delete" href="javascript:void(0)">删除</a>');
				}
			},
			error: function(error) {
				
			}
		 });
	});
	//delete cover image
	$("#single_news_actions").on("click", ".cover-delete", function(event) {
		$(".module-cover").html("封面图片");
		$(".preview-imgs").html('');
	});
});