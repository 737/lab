<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript" src="${baseURL }js/user.js"></script>
<div id="user" class="user">
	<div class="row">
		<div class="col-lg-12">
			<h1>微信后台管理</h1>
		</div>
	</div>
	<div class="row">
		<div class="col-lg-3">
			<div class="panel panel-primary">
				<div id="0" class="panel-heading pointer getusers" getgroups="true">
	                <span getgroups="true">全部用户</span>
	            </div>
	            <div class="panel-body pd0">
	               <div id="user_groups" class="user-groups">
	            	</div>
	            	<div id="group_text" class="group-text form-group input-group hide">
	            		<input type="text" class="form-control text"/>
	            		<span class="input-group-addon pointer add">保存</span>
	            		<span class="input-group-addon pointer cancel">取消</span>
	            	</div>
	            	<div class="user-group-add">
	            		<button id="add_btn" class="add-btn add"><a href="javascript:void(0)"><i class="fa fa-plus"></i>&nbsp;创建分组</a></button>
	            	</div>
	            </div>
			</div>
		</div>
		<div class="col-lg-9">
			<div class="panel panel-primary">
				<div class="panel-heading pd0">
					<div class="col-lg-2">
						<div class="checkbox margin0 inline">
							<label>
								<input id="checkall" type="checkbox" class="checkall" />
								全选
							</label>
						</div>
					</div>
					<div class="col-lg-5">
						<div class="form-group input-group search-group margin0">
							<input id="keyword_search" type="text"  placeholder="search" class="form-control" />
							<span class="input-group-btn">
								<button class="btn btn-default" type="button" id="user_search">
									<i class="fa fa-search"></i>
								</button>
							</span>
						</div>
					</div>
					<div class="col-lg-5 batch-box" style="visibility: hidden;">
						<span>批量分组:</span>
						<div class="update-selections batch-selections"></div>
					</div>
				</div>
				<div id="users-info" class="panel-body pd0">
				</div>
				<div id="pagination" class="pagination"></div>
			</div>
		</div>
	</div>
</div>

<script type="text/javascript">
    $(function() {
        $('#user_page_btn').addClass('active');
    });
</script>
<script id="user_groups_tmpl" type="text/x-jsrender">
{{for #data}}
<div getgroups="true" id="{{:id}}" class="user-group relative pointer getusers">
	<div getgroups="true" class="info-show">
		<span getgroups="true">{{:name}}</span>
		<span class="absolute pr10">
			<a href="javascript:void(0);"><i class="fa fa-edit group-edit group-action pointer"></i></a>
			<a href="javascript:void(0);"><i class="fa fa-trash-o group-delete group-action pointer"></i></a>
		</span>
	</div>
</div>
{{/for}}
</script>
<script id="group_type_tmpl" type="text/x-jsrender">
<div class="btn-group">
<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" id="{{:groups[0].id}}">
	<span class="current-selection">{{:groups[0].name}}</span><span class="caret"></span>
</button>
<ul class="dropdown-menu">
	{{for groups}}
		<li><a href="javascript:void(0);" id="{{:id}}">{{:name}}</a></li>
	{{/for}}
</ul>
</div>
<button class="btn btn-default putin">放入</button>
</script>
<script id="group_user_tmpl" type="text/x-jsrender">
{{for users}}
<div class="user-info clearfix" id="{{:id}}">
	<div class="col-lg-6">
		<div class="checkbox margin0 inline">
			<label>
				<input type="checkbox" class="checkbox" />
			</label>
		</div>
		<div class="inline">
			<img width=60 height=60 alt="" src="{{:avatar}}">
		</div>
		<span class="user-name">(<span>{{:nickname}}</span>)</span>
	</div>
	<div class="col-lg-6 textalignr selector-container update-selections single-selections">
		{{if #parent.parent.data.groups.length > 0}}
		<div class="btn-group">
		  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" id="{{:#parent.parent.parent.data.groups[0].id}}">
			<span class="current-selection">{{:#parent.parent.parent.data.groups[0].name}}</span><span class="caret"></span>
		  </button>
		  <ul class="dropdown-menu">
			{{for #parent.parent.parent.data.groups}}
				<li><a href="javascript:void(0);" id="{{:id}}">{{:name}}</a></li>
			{{/for}}
		  </ul>
		</div>
		<button class="btn btn-default putin">放入</button>
		{{/if}}
	</div>
</div>
{{/for}}
</script>
<script id="group_edit_tmpl" type="text/x-jsrender">
<div class="info-edit" >
	<div class="form-group input-group margin0">
		<input type="text" class="form-control text"/>
		<span class="input-group-addon pointer add btn btn-success" title="">保存</span>
		<span class="input-group-addon pointer cancel btn btn-info" title="">取消</span>
	</div>
</div>
</script>