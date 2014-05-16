$(function() {
	var _pageSize = 10;
	(function init() {
		getNewsList(1);
		getImages(1);
		getAudios(1);
		getMusices(1);
		getVideos(1);
	})();
	//tabs
	var $tabs = $("#material .nav-tabs li");
	$("#material").on("click", ".nav-tabs li a", function(event) {
		$(this).tab("show");
	});
	//get news
	function getNewsList(pageNum) {
		wcm.ajaxGet({url: wcm.getApiURL("newsList"), data: {page_num: parseInt(pageNum), page_size: _pageSize}}, newsRender);
	}
	var $paginationpt = $("#paginationpt");
	function newsRender(result) {
		var news = result.list;
		if(news.lenght == 0) {
			$paginationpt.empty();
			return;
		}
		var len, listnum;
		for (var i=0; i < news.length; i++) {
			news[i].createTime = wcm.formatTime("yyyy年MM月dd日", news[i].createTime);
			len = news[i].items.length;
			listnum = (i % 3 < 2) ? (i % 3 + 2) : (i % 3 - 1);
			if(len == 1) {
				wcm.ajaxGet({url: "../tmpl/singleNewsTmpl.html", async: false, dataType: "html"}, function(html) {
					$("#material .list" + listnum).append($.templates(html).render(news[i]));
				});
			} else {
				wcm.ajaxGet({url: "../tmpl/multipleNewsTmpl.html", async: false, dataType: "html"}, function(html) {
					$("#material .list" + listnum).append($.templates(html).render(news[i]));
				});
			}
		}
		if(!result.pagination.totalPage) {
			$paginationpt.empty();
			return;
		}
		if(parseInt(result.pagination.pageNum) > parseInt(result.pagination.totalPage)) {
			wcm.alert("alert-danger", "超出最大页");
			return;
		}
		$paginationpt.bootstrapPaginator({
			currentPage: result.pagination.pageNum,
			totalPages: result.pagination.totalPage,
			numberOfPages: 5,
			onPageChanged: function(event, oldPage, newPage) {
				getNewsList(newPage);
			}
		});
	}
	$("#material").on("click", ".pt-box .delete-news", function(event) {
		var flag = confirm("确认删除?");
		if(!!flag) {
			wcm.ajaxDelete({url: wcm.getApiURL("newsDelete"), data: {newsId: parseInt($(this).closest(".news-template").attr("id"))}}, function(result) {
				location.reload();
			});
		}
	});
	$("#material").on("click", ".pt-box .edit-news", function(event) {
		var type = $(this).hasClass("single") ? "single" : "multiple";
		location.href = baseURL + "admin/material/" + type + "/edit#" + $(this).closest(".news-template").attr("id");
	});
	//picture box
	var $pictureList = $("#picture_list"),
		  $paginationimg = $("#paginationimg");
	function getImages(_currentPage) {
		wcm.ajaxGet({url: wcm.getApiURL("image"), data: {page_size: _pageSize, page_num: parseInt(_currentPage)}}, function(result) {
			if(!result.list.length) {
				$pictureList.append("<div class='none-data'>暂时没有图片</div>");
			} else {
				$pictureList.append($("#picture-item-tmpl").render(result.list));
			}
			if(!result.pagination.totalPage) {
				$paginationimg.empty();
				return;
			}
			if(parseInt(result.pagination.pageNum) > parseInt(result.pagination.totalPage)) {
				wcm.alert("alert-danger", "超出最大页");
				return;
			}
			$paginationimg.bootstrapPaginator({
				currentPage: result.pagination.pageNum,
				totalPages: result.pagination.totalPage,
				numberOfPages: 5,
				onPageChanged: function(event, oldPage, newPage) {
			        $pictureList.empty();
					getImages(newPage);
				}
			});
		});
	}
	$("#material").on("click", "#submit-img", function(event) {
		event.preventDefault();
		var img = $("#image_upload").val();
		if(!img) {
			wcm.alert("alert-danger", "请选择上传图片");
			return;
		}
		$("#update_image_file").ajaxSubmit({
			success: function(result) {
				if(result.code == 200) {
					$pictureList.empty();
					getImages(1);
					return;
				}
				wcm.alert("alert-danger", result.message);
			},
			error: function(error) {
				wcm.alert("alert-danger", "上传图片失败,请稍后重试.");
			}
		});
	});
	$("#material").on("click", ".delete-img", function() {
		var flag = confirm("确定删除该图片？");
		if(!!flag) {
			var $item = $(this).closest(".picture-list-item");
			var id = $item.attr("data-id");
			wcm.ajaxDelete({url: wcm.getApiURL("image"), data: {id: parseInt(id)}}, function() {
				$item.remove();
				wcm.alert("alert-success", "删除成功");
			});
		}
	});
	//audio
	var $audioList = $("#audio_list"),
	      $paginationaudio = $("#paginationaudio");
	function getAudios(_currentPage) {
		wcm.ajaxGet({url: wcm.getApiURL("voice"), data: {page_size: _pageSize, page_num: parseInt(_currentPage)}}, function(result) {
			if(!result.list.length) {
				$audioList.append('<div class="none-data">暂时没有数据</div>');
			} else {
				$audioList.append($("#audio-item-tmpl").render(result.list));
			}
			if(!result.pagination.totalPage) {
				$paginationaudio.empty();
				return;
			}
			if(parseInt(result.pagination.pageNum) > parseInt(result.pagination.totalPage)) {
				wcm.alert("alert-danger", "超出最大页");
				return;
			}
			$paginationaudio.bootstrapPaginator({
				currentPage: result.pagination.pageNum,
				totalPages: result.pagination.totalPage,
				numberOfPages: 5,
				onPageChanged: function(event, oldPage, newPage) {
					$audioList.empty();
					getAudios(newPage);
				}
			});
		});
	}
	$("#material").on("click", "#submit_audio", function(event) {
		event.preventDefault();
		var $form = $("#update_audio_file");
		var audio_name = $form.find("input[name=name]").val().trim();
		var audio = $("#audio_upload").val();
		if(!audio_name || !audio) {
			wcm.alert("alert-danger", "请补充完提交信息");
			return;
		}
		$form.ajaxSubmit({
			success: function(result) {
				if(result.code == 200) {
					$audioList.empty();
					getAudios(1);
					return;
				}
				wcm.alert("alert-danger", result.message);
			},
			error: function(error) {
				wcm.alert("alert-danger", "上传语音消息失败,请稍后重试.");
			}
		});
	});
	$("#material").on("click", ".audio-box .btn-play", function() {
		var $this = $(this);
		var audioId = $(this).attr("data-id");
		var $audio = $("#audio" + audioId)[0];
		if($audio.error) {
			wcm.alert("alert-danger", "暂时无法播放该语音信息");
			return;
		}
		$this.addClass("playing disabled");
		$audio.play();
		$audio.addEventListener("ended", function(event) {
			$this.removeClass("playing disabled");
			$audio.removeEventListener("ended");
		}, false);
	});
	$("#material").on("click", ".delete-audio", function() {
		var flag = confirm("确定删除该语音消息？");
		if(!!flag) {
			var $item = $(this).closest(".audio-list-item");
			var id = $item.attr("data-id");
			wcm.ajaxDelete({url: wcm.getApiURL("voice"), data: {id: parseInt(id)}}, function() {
				$item.remove();
				wcm.alert("alert-success", "删除成功");
			});
		}
	});
	//music
	var $musicList = $("#music_list"),
	      $paginationmusic = $("#paginationmusic");
	function getMusices(_currentPage) {
		wcm.ajaxGet({url: wcm.getApiURL("music"), data: {page_size: _pageSize, page_num: parseInt(_currentPage)}}, function(result) {
			if(!result.list.length) {
				$musicList.append('<div class="none-data">暂时没有数据</div>');
			}  else {
				$musicList.append($("#music-item-tmpl").render(result.list));
			}
			if(!result.pagination.totalPage) {
				$paginationmusic.empty();
				return;
			}
			if(parseInt(result.pagination.pageNum) > parseInt(result.pagination.totalPage)) {
				wcm.alert("alert-danger", "超出最大页");
				return;
			}
			$paginationmusic.bootstrapPaginator({
				currentPage: result.pagination.pageNum,
				totalPages: result.pagination.totalPage,
				numberOfPages: 5,
				onPageChanged: function(event, oldPage, newPage) {
					$musicList.empty();
					getMusices(newPage);
				}
			});
		});
	}
	$("#material").on("click", "#submit_music", function(event) {
		event.preventDefault();
		var $form = $("#update_music_file");
		var regex = /^\S+\.\S+$/;
		var title = $form.find("input[name=title]").val().trim(),
			  img = $form.find("input[type=file]").val().trim(),
			  url = $form.find("input[name=musicUrl]").val().trim(),
			  hqurl = $form.find("input[name=hqMusicUrl]").val().trim(),
			  descr = $form.find("input[name=description]").val().trim();
		if(!title || !img || !url || !hqurl || !descr || !url.match(regex) || !hqurl.match(regex)) {
			wcm.alert("alert-danger", "请补充完提交信息");
			return;
		};
		$form.ajaxSubmit({
			success: function(result) {
				if(result.code == 200) {
					$musicList.empty();
					getMusices(1);
					return;
				}
				wcm.alert("alert-danger", result.message);
			},
			error: function(error) {
				wcm.alert("alert-danger", "上传音乐失败,请稍后重试.");
			}
		});
	});
	$("#material").on("click", ".delete-music", function() {
		var flag = confirm("确定删除该音乐？");
		if(!!flag) {
			var $item = $(this).closest(".music-list-item");
			var id = $item.attr("data-id");
			wcm.ajaxDelete({url: wcm.getApiURL("music"), data:{id: parseInt(id)}}, function(result) {
				$item.remove();
				wcm.alert("alert-success", "删除成功");
			});
		}
	});
	$("#material").on("click", ".music-play", function(event) {
		var $playBtn = $(this).find(".fa");
		var ifPlay = $playBtn.hasClass("fa-play");
		var $this = $(this);
		var ifHq = $(this).hasClass("hq");
		var id = $(this).attr("data-id");
		var $music;
		if(ifHq) {
			var $music = $("#music" + id)[0];
		} else {
			var $music = $("#hqmusic" + id)[0];
		}
		if(ifPlay) {
			if($music.error) {
				wcm.alert("alert-danger", "音乐无法播放");
				return;
			}
			$playBtn.removeClass("fa-play").addClass("fa-pause");
			$music.play();
			$music.addEventListener("ended", function() {
				$this.removeClass("fa-pause").addClass("fa-play");
				$music.removeEventListener("ended");
			}, false);
		} else {
			$playBtn.removeClass("fa-pause").addClass("fa-play");
			$music.pause();
		}
	});
	//video
	var $videoList = $("#video_list") ;
		 $paginationvideo = $("#paginationvideo");
	function getVideos(_currentPage) {
		wcm.ajaxGet({url: wcm.getApiURL("video"), data: {page_size: _pageSize, page_num: parseInt(_currentPage)}}, function(result) {
			console.log(result);
			if(!result.list.length) {
				$videoList.append("<div class='none-data'>暂时没有数据</div>");
			} else {
				$videoList.append($("#video-item-tmpl").render(result.list));
			}
			if(!result.pagination.totalPage) {
				$paginationvideo.empty();
				return;
			}
			if(parseInt(result.pagination.pageNum) > parseInt(result.pagination.totalPage)) {
				wcm.alert("alert-danger", "超出最大页");
				return;
			}
			$paginationvideo.bootstrapPaginator({
				currentPage: result.pagination.pageNum,
				totalPages: result.pagination.totalPage,
				numberOfPages: 5,
				onPageChanged: function(event, oldPage, newPage) {
					$videoList.empty();
					getVideos(newPage);
				}
			});
		});
	}
	$("#material").on("click", "#submit_video", function(event) {
		event.preventDefault();
		var $form = $("#update_video_file");
		var video_title = $form.find("input[name=title]").val().trim();
		var video_descr = $form.find("input[name=description]").val().trim();
		var video = $("#video_upload").val();
		if(!video_title || !video_descr || !video) {
			wcm.alert("alert-danger", "请补充完提交信息");
			return;
		}
		$form.ajaxSubmit({
			success: function(result) {
				if(result.code == 200) {
					$videoList.empty();
					getVideos(1);
					return;
				}
				wcm.alert("alert-danger", result.message);
			},
			error: function(error) {
				wcm.alert("alert-danger", "上传图片失败,请稍后重试.");
			}
		});
	});
	$("#material").on("click", ".delete-video", function(event) {
		var flag = confirm("确定删除该视频?");
		if(!!flag) {
			var $dom = $(this).closest(".video-list-item");
			wcm.ajaxDelete({url: wcm.getApiURL("video"), data: {id: parseInt($dom.attr("data-id"))}}, function(result) {
				$dom.parent().remove();
			});
		}
	});
});