<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<script type="text/javascript" src="${baseURL }js/jquery.form.js"></script>
<script type="text/javascript" src="${baseURL }js/singleNewsAdd.js"></script>
<div id="single_news_actions" class="single-news-add single-news-actions">
	<div class="row">
		<div class="col-lg-4">
			<div class="news-module">
				<div class="module-title"><div class="title">title</div></div>
				<div class="module-cover">
					封面图片
				</div>
				<div class="module-description">
					<div class="description"></div>
				</div>
			</div>
		</div>
		<div class="col-lg-8">
			<div class="news-action">
				<div class="inner">
					<div class="form-group">
						<label>标题</label>
						<input class="form-control action-title" type="text" name="title" />
					</div>
					<div class="form-group">
						<label>封面</label>
						<div class="form-control">
							<form enctype="multipart/form-data"  id="upload_file_form"  class="upload-file-form" role="form" action="${baseURL }news/image" method="post">
								<input accept="image/jpeg" id="cover_img" type="file" name="uploadFile" class="file-inline">
							</form>
							<div class="preview-imgs"></div>
						</div>
					</div>
					<div class="form-group">
						<label>摘要</label>
						<textarea class="form-control action-description" name="description" rows="6" cols=""></textarea>
					</div>
					<div class="form-group">
						<label>原文链接</label>
						<input id="cover_img" class="form-control" type="text" name="url" />
					</div>
				</div>
				<i class="arrow arrow-out"></i>
				<i class="arrow arrow-in"></i>
			</div>
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