<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<script type="text/javascript" src="${baseURL }js/jquery.form.js"></script>
<script type="text/javascript" src="${baseURL }js/singleNewsEdit.js"></script>
<div id="single_news_actions" class="single-news-edit single-news-actions">
	<div class="row">
		<div class="col-lg-4">
			<div id="news_module_box"></div>
		</div>
		<div class="col-lg-8">
			<div id="news_action_box"></div>
		</div>
	</div>
	<hr />
	<div class="row">
		<div class="col-lg-12">
			<div class="form-actions">
				<button class="btn btn-success save">保存</button>
			</div>
		</div>
	</div>
</div>
<script type="text/javascript">
    $(function() {
        $('#material_page_btn').addClass('active');
    });
</script>
<script type="text/x-jsrender" id="news-module-tmpl">
<div class="news-module">
    <div class="module-title"><div class="title">{{:title}}</div></div>
    <div class="module-cover">
        <img id="{{:news_image_id}}" width="100%" height="100%" alt="" src="{{:image_url}}">
    </div>
    <div class="module-description">
        <div class="description">{{:description}}</div>
    </div>
</div>
</script>
<script type="text/x-jsrender" id="news-action-tmpl">
<div class="news-action">
<div class="inner">
    <div class="form-group">
        <label>标题</label>
        <input class="form-control action-title" type="text" name="title" value="{{:title}}" />
    </div>
    <div class="form-group">
        <label>封面</label>
        <div class="form-control">
            <form enctype="multipart/form-data"  id="upload_file_form"  class="upload-file-form" role="form" action="${baseURL }news/image" method="post">
                <input accept="image/jpeg" id="cover_img" type="file" name="uploadFile" class="file-inline">
            </form>
            <div class="preview-imgs">
				<img id="{{:news_image_id}}" src="{{:image_url}}" width=135 height=80 />
				<a class="cover-delete" href="javascript:void(0)">删除</a>
			</div>
        </div>
    </div>
    <div class="form-group">
        <label>摘要</label>
        <textarea class="form-control action-description" name="description" rows="6" cols="">{{:description}}</textarea>
    </div>
    <div class="form-group">
        <label>原文链接</label>
        <input accept="image/jpeg" id="cover_img" class="form-control" type="text" name="url" value="{{:url}}" />
    </div>
</div>
<i class="arrow arrow-out"></i>
<i class="arrow arrow-in"></i>
</div>
</script>