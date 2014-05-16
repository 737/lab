<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class='keyword'>
    <div class='row'><div class='col-lg-12'><h1>关键字管理</h1></div></div>

    <div class='row'>
        <div class="col-lg-4">
          <div class="panel panel-primary">
            <div class="panel-heading">
              <h3 class="panel-title">关键字列表</h3>
            </div>
            <div class="panel-body">
              <div class="list-group" id='keyword-list-group'></div>
              <hr />
              <div class="add-keyword">
                  <a id='add-keyword-btn'><i class="fa fa-plus"></i> 添加关键字</a>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-8">
               <div class="panel panel-primary">
                   <div class="panel-heading">
                       <h3 class="panel-title">设置回复信息</h3>
                   </div>
                   <div class="panel-body keyword-reply-message">
                       <h3 class="keyword-reply-tip">请选择相应关键字进行回复设置</h3>
                       <div class="reply-content">
                       <div class="alert alert-dismissable alert-info">
			              <button type="button" class="close" data-dismiss="alert">×</button>
		                      回复信息设置只能是如下一种类型，若重新选择一种类型在点击保存按钮后，原设置好的回复信息被自动删除，保存新选择的类型.
			            </div>
                       <div class="reply-wrapper col-lg-10 col-lg-offset-1">
                            <span class="pull-right">
                                <a class="msg-reply-save btn btn-primary btn-sm">保存设置</a>
                                <a class="msg-reply-del btn btn-danger btn-sm">解除设置</a>
                            </span>
				           <ul class="nav nav-tabs msg-reply-conf-nav">
				                <li class="active" type="1">
				                    <a href="#msg_content_replymsg" class="msg-content-reply" data-toggle="tab">文字</a>
				                </li>
				                <li type="2">
                                    <a href="#msg_img_replymsg" class="msg-img-reply" data-toggle="tab" >图片</a>
                                </li>
				                <li type="3">
				                    <a href="#msg_imgmsg_replymsg" class="msg-imgmsg-reply" data-toggle="tab">图文</a>
				                </li>
				                <li type="4">
				                    <a href="#msg_audio_replymsg" class="msg-audio-reply" data-toggle="tab" >音频</a>
				                </li>
				                 <li type="6">
                                    <a href="#msg_music_replymsg" class="msg-music-reply" data-toggle="tab" >音乐</a>
                                </li>
				                <li type="5">
				                    <a href="#msg_video_replymsg" class="msg-video-reply" data-toggle="tab" >视频</a>
				                </li>
				           </ul>

				           <div class="tab-content-wrapper">
				                <div class="tab-content">
				                    <div class="tab-pane clearfix active" id="msg_content_replymsg">
				                        <textarea></textarea>
				                    </div>
				                    <div class="tab-pane clearfix" id="msg_imgmsg_replymsg"></div>
				                    <div class="tab-pane clearfix" id="msg_img_replymsg"></div>
				                    <div class="tab-pane clearfix" id="msg_audio_replymsg"></div>
				                    <div class="tab-pane clearfix" id="msg_video_replymsg"></div>
				                    <div class="tab-pane clearfix" id="msg_music_replymsg"></div>
				                </div>
				           </div>
				        </div>
				        </div>
                   </div>
              </div>
          </div>
    </div>
</div>

<div class="modal fade">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            <h4 class="modal-title">请选择图文消息</h4>
          </div>
          <div class="modal-body news-list clearfix"></div>
        </div>
      </div>
</div>

<script type="text/javascript" src="${ baseURL }js/materialListTmplApi.js"></script>
<script type="text/javascript" src="${ baseURL }js/keyword.js"></script>

<script id="keyword_edit" type="text/x-jsrender">
  <a class='list-group-item'>
  <form role="form" class='keyword-form'>
      <div class="row">
          <div class='col-lg-1'></div>
          <div class='col-lg-7'>
              <input type="hidden" value="{{:keyword_id}}" name="keyword_id">
              <input type="hidden" value="{{:reply_id}}" name="reply_id">
              <input type="hidden" value="{{:reply_type}}" name="reply_type">
              <input class="form-control" name="keyword_name" placeholder="关键字" value="{{:keyword_name}}">
              <input class="form-control" name="keyword_code" placeholder="关键字码" value="{{:keyword_code}}">
              <select class="form-control" name="fuzzy">
                <option {{if fuzzy == 'false'}} selected="selected" {{/if}} value = "false">模糊匹配</option>
                <option {{if fuzzy == 'true'}} selected="selected" {{/if}} value= "true" >完全匹配</option>
              </select>
          </div>
          <div class='col-lg-3 keyword-button-container'>
              <button type="button" class="btn btn-success btn-sm save-keyword">保存</button>
              <button type="button" class="btn btn-default btn-sm cancel-save-keyword">取消</button>
          </div>
      </div>
  </form>
  </a>
</script>
<script id="keyword_list_item" type="text/x-jsrender">
<a href="#" class="list-group-item">
    <form class="list-hidden-value hidden">
    <input type="hidden" value="{{:keyword_id}}" name="keyword_id">
    <input type="hidden" value="{{:fuzzy}}" name="fuzzy">
    <input type="hidden" value="{{:keyword_code}}" name="keyword_code">
    <input type="hidden" value="{{:reply_id}}" name="reply_id">
    <input type="hidden" value="{{:reply_type}}" name="reply_type">
    <input type="hidden" value="{{:keyword_name}}" name="keyword_name">
    </form>
    <span class="badge delete-keyword"><i class="fa fa-trash-o"></i></span>
    <span class="badge edit-keyword"><i class="fa fa-edit"></i></span>
    <span class="badge edit-reply-keyword-info"><i class="fa fa-credit-card"></i></span>
    {{:keyword_name}}
</a>
</script>