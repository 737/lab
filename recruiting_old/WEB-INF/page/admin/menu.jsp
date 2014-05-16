<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript" src="${baseURL }js/menu.js"></script>
<script type="text/javascript" src="${baseURL }js/materialListTmplApi.js"></script>
<div id="menu" class="menu">
	<div class="row">
		<div class="col-lg-12">
			<h1>自定义菜单管理</h1>
			<h4>您最多可以创建3个一级菜单，每个一级菜单下最多可以创建5个二级菜单。</h4>
		</div>
	</div>
	<div class="row">
		<div class="col-lg-4">
			<div class="panel panel-primary">
				<div class="panel-heading">
					<span>菜单列表</span>
					<button class="btn btn-default pull-right apply">应用到微信</button>
				</div>
				<div class="panel-body pd0">
					<div id="menu_list" class="menu-list">
					</div>
					<div id="menu_added" class="menu-added form-group input-group hide">
	            		<input type="text" class="form-control text"/>
	            		<span class="input-group-addon pointer add btn btn-success">保存</span>
	            		<span class="input-group-addon pointer cancel btn btn-info">取消</span>
	            	</div>
					<div class="menu-add">
						<button id="added_btn" class="add-btn add">
							<a href="javascript:void(0);"><i class="fa fa-plus"></i>&nbsp;添加菜单</a>
						</button>
					</div>
				</div>
			</div>
		</div>
		<div class="col-lg-8">
			<div class="panel panel-primary">
				<div class="panel-heading">
					<span>菜单管理</span>
				</div>
				<div class="panel-body minh">
					<div id="setting_content">
						<div class="tip">请选择相应菜单进行设置</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="menu_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="myModalLabel"></h4>
      </div>
      <div class="modal-body row" id="modal_body">
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
<script type="text/javascript">
    $(function() {
        $('#menu_page_btn').addClass('active');
    });
</script>
<script id="menu_edit_tmpl" type="text/x-jsrender">
<div class="menu-edit">
    <div class="form-group input-group margin0">
        <input type="text"  class="form-control"/>
        <span class="input-group-addon pointer add btn btn-success" title="">保存</span>
        <span class="input-group-addon pointer cancel btn btn-info" title="">取消</span>
    </div>
</div>
</script>
<script id="menu_sub_add_tmpl" type="text/x-jsrender">
<div class="menu-sub-add">
	<div class="form-group input-group margin0">
	   	<input type="text"  class="form-control"/>
	    <span class="input-group-addon pointer add btn btn-success" title="">保存</span>
	    <span class="input-group-addon pointer cancel btn btn-info" title="">取消</span>
	</div>
</div>
</script>
<script id="menu_parent_tmpl" type="text/x-jsrender">
<div class="menu-item relative" data-id="{{:menu_id}}">
	<div class="menu-show level0 pointer" data-id="{{:menu_id}}" data-parent={{:parent_id}}>
		<div class="show-wrapper">
        	<span>{{:name}}</span>
       		<span class="absolute pr10">
            	<a href="javascript:void(0);"><i class="fa fa-credit-card menu-action menu-setting" reply_id reply_type></i></a>
				<a href="javascript:void(0);"><i class="fa fa-plus menu-action menu-add-sub"></i></a>
            	<a href="javascript:void(0);"><i class="fa fa-edit menu-action menu-edit"></i></a>
            	<a href="javascript:void(0);"><i class="fa fa-trash-o menu-action menu-delete"></i></a>
        	</span>
		</div>
    </div>
</div>
</script>
<script id="menu_sub_tmpl" type="text/x-jsrender">
<div class="menu-show level1 pointer" data-id="{{:menu_id}}" data-parent="{{:parent_id}}">
	<div class="show-wrapper">
    	<span>{{:name}}</span>
    	<span class="absolute pr10">
        	<a href="javascript:void(0);"><i class="fa fa-credit-card menu-action menu-setting" reply_id reply_type></i></a>
        	<a href="javascript:void(0);"><i class="fa fa-edit menu-action menu-edit"></i></a>
        	<a href="javascript:void(0);"><i class="fa fa-trash-o menu-action menu-delete"></i></a>
    	</span>
	</div>
</div>
</script>
<script id="menu_item_tmpl" type="text/x-jsrender">
<div class="menu-item relative" data-id="{{:id}}">
    <div class="menu-show level0 pointer" data-id="{{:id}}" data-parent={{:parent_id}}>
		<div class="show-wrapper">
        	<span>{{:name}}</span>
        	<span class="absolute pr10">
            	<a href="javascript:void(0);"><i class="fa fa-credit-card menu-action menu-setting" reply_id="{{:reply_id}}" reply_type="{{:reply_type}}"></i></a>
				<a href="javascript:void(0);"><i class="fa fa-plus menu-action menu-add-sub"></i></a>
            	<a href="javascript:void(0);"><i class="fa fa-edit menu-action menu-edit"></i></a>
            	<a href="javascript:void(0);"><i class="fa fa-trash-o menu-action menu-delete"></i></a>
        	</span>
		</div>
    </div>
	{{for submenus}}
		<div class="menu-show level1 pointer" data-id="{{:id}}" data-parent="{{:parent_id}}">
            <div class="show-wrapper">
				<span>{{:name}}</span>
				<span class="absolute pr10">
            		<a href="javascript:void(0);"><i class="fa fa-credit-card menu-action menu-setting" reply_id="{{:reply_id}}" reply_type="{{:reply_type}}"></i></a>
            		<a href="javascript:void(0);"><i class="fa fa-edit menu-action menu-edit"></i></a>
            		<a href="javascript:void(0);"><i class="fa fa-trash-o menu-action menu-delete"></i></a>
        		</span>
			</div>
		</div>
	{{/for}}
</div>
</script>
<script id="menu_setting_tmpl" type="text/x-jsrender">
<div>
	<span class="pull-right">
    	<a class="msg-reply-save btn btn-primary btn-sm">保存设置</a>
    	<a class="msg-reply-del btn btn-danger btn-sm">解除设置</a>
     </span>
	<ul class="nav nav-tabs">
  		<li class="active"><a href="#text_box" data-type="1">文字</a></li>
		<li><a href="#pt_box" data-type="2">图文</a></li>
  		<li><a href="#p_box" data-type="3">图片</a></li>
		<li><a href="#audio_box" data-type="4">音频</a></li>
		<li><a href="#video_box" data-type="5">视频</a></li>
		<li><a href="#music_box" data-type="6">音乐</a></li>
		<li><a href="#url_box" data-type="7">链接</a></li>
	</ul>
</div>
<div class="tab-content">
	<div id="text_box" class="url-box tab-pane active">
    	<textarea class="form-control textarea text"></textarea>
	</div>
	<div id="p_box" class="p-box tab-pane">
		<div class="row" id="menu_p_box"></div>
	</div>
	<div id="pt_box" class="pt-box tab-pane">
		<div class="row" id="menu_pt_box"></div>
	</div>
	<div id="audio_box" class="audio-box tab-pane">
		<div class="row" id="menu_audio_box">
		</div>
	</div>
	<div id="music_box" class="music-box tab-pane">
		<div class="row" id="menu_music_box"></div>
	</div>
	<div id="video_box" class="video-box tab-pane">
		<div class="row" id="menu_video_box"></div>
	</div>
	<div id="url_box" class="url-box tab-pane">
		<div class="row" id="menu_url_box">
			<div class="col-lg-12"><input type="url" class="form-control urlinput" /></div>
		</div>
	</div>
</div>
</script>