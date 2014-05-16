var metariaApi = metariaApi || {};
metariaApi.renderTextMessageApi = function (selector, callback) {
	wcm.ajaxGet({url: wcm.getApiURL("newsList"), data: {page_num: 1, page_size: 100000}}, function (result) {
		var news = result.list;
		var len, listnum;
		for (var i=0; i < news.length; i++) {
			news[i].createTime = wcm.formatTime("yyyy年MM月dd日", news[i].createTime);
			len = news[i].items.length;
			if(len == 1) {
				wcm.ajaxGet({url: "../tmpl/singleTextMsgTpl.html", async: false, dataType: "html"}, function(html) {
					selector.append($.templates(html).render(news[i]));
					if(!!callback && typeof(callback) == "function") {
						callback(news[i], html);
					}
				});
			} else {
				wcm.ajaxGet({url: "../tmpl/multipleTextMsgTpl.html", async: false, dataType: "html"}, function(html) {
					selector.append($.templates(html).render(news[i]));
					if(!!callback && typeof(callback) == "function") {
						callback(news[i], html);
					}
				});
			}
		}
	});
};

metariaApi.renderData = function (templateUrl, selector, data) {
	wcm.ajaxGet({url: templateUrl, async: false, dataType: "html"}, function(html) {
		selector.html($.templates(html).render(data));
	});
};

metariaApi.getReplyInfoApi = function (type) {
	var _url = "";

	switch (type) {
	case "1" :
		_url = wcm.getApiURL("getTextReply");
		break;
	case "2" :
		_url = wcm.getApiURL("getImgReply");
		break;
	case "3" :
		_url = wcm.getApiURL("getTextMsgReply");
		break;
	case "4" :
		_url = wcm.getApiURL("getAudioReply");
		break;
	case "5" :
		_url = wcm.getApiURL("getVideoReply");
		break;
	case "6" :
		_url = wcm.getApiURL("getMusicReply");
		break;
	}
	
	return _url;
};

metariaApi.coverData = function (id, type) {
	var _data = {};
	switch (type) {
	case "1" :
		_data = {id: id};
		break;
	case "2" :
		_data = {id: id};
		break;
	case "3" :
		_data = {newsId: id};
		break;
	case "4" :
		_data = {id: id};
		break;
	case "5" :
		_data = {id: id};
		break;
	case "6" :
		_data = {id: id};
		break;
	}
	
	
	return _data;
};

metariaApi.onModalEvent = function($modalDom, subSelector, containerSelector) {
	$modalDom.off("click", subSelector).on("click", subSelector, function(event) {
		var tagName = event.target.nodeName.toUpperCase();
		if(tagName == "AUDIO" || tagName == "VIDEO") {
			return;
		}
		$(containerSelector).html($(this).clone());
		$modalDom.modal("hide");
		($modalDom.find(".modal-body")).empty();
	});
};

metariaApi.renderMusicApi = function(selector, callback) {
	var html = "";
	wcm.ajaxGet({url: "../tmpl/musicMsgTpl.html", async: false, dataType: "html"}, function(htm) {
		html = htm;
	});
	wcm.ajaxGet({url: wcm.getApiURL("music"), data: {page_num: 1, page_size: 100000}}, function(result) {
		var musices = result.list;
		$.each(musices, function(key, music) {
			selector.append($.templates(html).render(music));
			if(!!callback && typeof(callback) == "function") {
				callback(music, html);
			}
		});
	});
};

metariaApi.renderVideoApi = function(selector, callback) {
	var html = "";
	wcm.ajaxGet({url: "../tmpl/videoMsgTpl.html", async: false, dataType: "html"}, function(htm) {
		html = htm;
	});
	wcm.ajaxGet({url: wcm.getApiURL("video"), data: {page_num: 1, page_size: 100000}}, function(result) {
		var videos = result.list;
		$.each(videos, function(key, video) {
			selector.append($.templates(html).render(video));
			if(!!callback && typeof(callback) == "function") {
				callback(video, html);
			}
		});
	});
};

metariaApi.getReplyInfoTplContainerApi = function (type) {
	var _container = null;

	switch (type) {
	case "1" :
		_container = $("#msg_content_replymsg");
		break;
	case "2" :
		_container = $("#msg_imgmsg_replymsg");
		break;
	case "3" :
		_container = $("#msg_img_replymsg");
		break;
	case "4" :
		_container = $("#msg_audio_replymsg");
		break;
	case "5" :
		_container = $("#msg_video_replymsg");
		break;
	case "6" :
		_container = $("#msg_music_replymsg");
		break;
	}
	
	return {container: _container};
};

metariaApi.renderAudioApi = function (selector) {
	var html = "";
	wcm.ajaxGet({url: "../tmpl/audioMsgTpl.html", async: false, dataType: "html"}, function(htm) {
		html = htm;
	});
	wcm.ajaxGet({url: wcm.getApiURL("voice"), data: {page_num: 1, page_size: 100000}}, function(result) {
		var audios = result.list;
		$.each(audios, function(key, audio) {
			selector.append($.templates(html).render(audio));
			if(typeof(callback) == "function") {
				callback(music, html);
			}
		});
	});
};

//TODO:: Alex
metariaApi.__NODE_TEMPLATE = '';
metariaApi._bindSelectorEvent = function (nodeSelectore, nodeAppend) {
	nodeSelectore.children('div').off('click');
	nodeSelectore.children('div').on('click', function(evt) {
		var html = $.clone(this);

		evt.preventDefault();
		nodeAppend.html(html);

		// close the wrap
		$('.modal button').trigger("click");
	})
};
/**
* >> metariaApi.getTmplHTML('tmpl_images')
* => [<script id='tmpl_images' type="text/x-jsrender">...</script>]
*/
metariaApi.getTmplHTML = function(sTmplId) {
	var me = this;

	if (me.__NODE_TEMPLATE.length < 1) {
		wcm.ajaxGet(
			{url: "../tmpl/meterailsTempalte.html", async: false, dataType: "html"}, 
			function(rsp) {
				me.__NODE_TEMPLATE = $(rsp);
			}
		);
	}

	return me.__NODE_TEMPLATE.find('#' + sTmplId);;
};
/**
* >> metariaApi.render_news(nodeDialogBox, nodeAppendPlace);
*/
metariaApi.render_images = function (nodeSelectore, nodeAppend) {
	var nodeTmpl = metariaApi.getTmplHTML('tmpl_images'),
		html;

	nodeSelectore.html('');

	wcm.ajaxGet({ 
			url: wcm.getApiURL("image"), 
			data: {page_num: 1, page_size: 100000}
		}, 
		function (rps) {
			html = nodeTmpl.render(rps.list);

			nodeSelectore.append(html);

			metariaApi._bindSelectorEvent(nodeSelectore, nodeAppend);
		}
	);	
};
metariaApi.render_voices = function (nodeSelectore, nodeAppend) {
	var nodeTmpl = metariaApi.getTmplHTML('tmpl_voice'),
		html;

	nodeSelectore.html('');

	wcm.ajaxGet({ 
			url: wcm.getApiURL("voice"),
			data: {page_num: 1, page_size: 100000}
		}, 
		function (rps) {
			html = nodeTmpl.render(rps.list);

			nodeSelectore.append(html);

			metariaApi._bindSelectorEvent(nodeSelectore, nodeAppend);
		}
	);	
};
metariaApi.render_video = function (nodeSelectore, nodeAppend) {
	var nodeTmpl = metariaApi.getTmplHTML('tmpl_video'),
		html;

	nodeSelectore.html('');

	wcm.ajaxGet({ 
			url: wcm.getApiURL("video"),
			data: {page_num: 1, page_size: 100000}
		}, 
		function (rps) {
			html = nodeTmpl.render(rps.list);

			nodeSelectore.append(html);

			metariaApi._bindSelectorEvent(nodeSelectore, nodeAppend);
		}
	);	
};
metariaApi.render_news = function (nodeSelectore, nodeAppend, arrayBindId) {
	// render the Originally data
	var _renderOriginalData = function(html, newsId, aBindId) {
		if (!!aBindId && aBindId.length > 0) {
			newsId = newsId.toString();

			sun.util.each(aBindId, function(v, i){
				if (newsId === v) {
					nodeAppend.html(html);
				}
			});
		}
	};

	wcm.ajaxGet({url: wcm.getApiURL("newsList"), data: {page_num: 1, page_size: 100000}}, function (result) {
		var len, listnum,
			news = result.list,
			html = '',
			tmpUrl = '';

		nodeSelectore.html('');

		for (var i = 0, max = news.length; i < max; i++) {

			news[i].createTime = wcm.formatTime("yyyy年MM月dd日", news[i].createTime);
			len = news[i].items.length;
			
			if(len == 1) {
				tmpUrl = "../tmpl/singleTextMsgTpl.html";
			} else {
				tmpUrl = "../tmpl/multipleTextMsgTpl.html";
			}

			wcm.ajaxGet({url: tmpUrl, async: false, dataType: "html"}, function(html) {
				html = $.templates(html).render(news[i]);

				nodeSelectore.append(html);
				_renderOriginalData(html, news[i].newsId, arrayBindId);
			});
		};

		metariaApi._bindSelectorEvent(nodeSelectore, nodeAppend);
	});
};