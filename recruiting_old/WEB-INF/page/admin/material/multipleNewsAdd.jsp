<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<script type="text/javascript" src="${baseURL }js/underscore-min.js"></script>
<script type="text/javascript" src="${baseURL }js/jquery.form.js"></script>
<script type="text/javascript" src="${baseURL }js/multipleNewsAdd.js"></script>
<div id="multiple_news_actions" class="multiple-news-add multiple-news-actions">
	<div class="row">
		<div class="col-lg-4">
			<div class="multiple-news-template">
				<div class="content">
					<div class="top">
						<div class="cover news-index" id="module1" data-index="1">
							<div class="cover-content cover-img">封面图片</div>
							<div class="title">标题</div>
							<div class="multiple-template-action" >
								<a href="javascript:void(0);" class="edit-news">
									<i class="fa fa-edit fontsize2"></i>
								</a>
							</div>
						</div>
					</div>
					<hr />
					<div class="bottom" >
						<div class="row sub-template news-index" id="module2" data-index="2">
							<div class="col-lg-8 sub-title title">
								title
							</div>
							<div class="col-lg-4 sub-cover-img">
								<div class="sub-cover-tip cover-img">缩略图</div>
							</div>
							<div class="sub-template-action" >
								<a href="javascript:void(0);" class="edit-news">
									<i class="fa fa-edit fontsize2"></i>
								</a>
								<a href="javascript:void(0);" class="delete-news">
									<i class="fa fa-trash-o fontsize2"></i>
								</a>
							</div>
						</div>
					</div>
				</div>
				<footer>
					<div class="row">
						<div class="col-lg-12">
							<div class="add-icon-box">
								<a class="add-sub-template" href="javascript:void(0);">
									<i class="fa fa-plus"></i>
								</a>
							</div>
						</div>
					</div>
				</footer>
			</div>
		</div>
		<div class="col-lg-8">
			<div class="form-action">
				<div class="news-action" id="action1" data-index="1">
					<div class="inner">
					    <div class="form-group">
					        <label>标题</label>
					        <input class="form-control action-title" type="text" name="title" />
					    </div>
					    <div class="form-group">
					        <label>封面</label>
					        <div class="form-control">
					            <form enctype="multipart/form-data"   class="upload-file-form" role="form" action="${baseURL }news/image" method="post">
					                <input accept="image/jpeg" type="file" name="uploadFile" class="file-inline">
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
					        <input class="form-control link" type="text" name="url" />
					    </div>
					</div>
					<i class="arrow arrow-out"></i>
					<i class="arrow arrow-in"></i>
					</div>
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
<script type="text/x-jsrender" id="sub-news-tmpl">
<div class="row sub-template news-index" id="module{{:index}}" data-index="{{:index}}">
    <div class="col-lg-8 sub-title title">
        title
    </div>
    <div class="col-lg-4 sub-cover-img">
        <div class="sub-cover-tip cover-img">缩略图</div>
    </div>
    <div class="sub-template-action" >
        <a href="javascript:void(0);" class="edit-news">
            <i class="fa fa-edit fontsize2"></i>
        </a>
        <a href="javascript:void(0);" class="delete-news">
            <i class="fa fa-trash-o fontsize2"></i>
        </a>
    </div>
</div>
</script>
<script type="text/x-jsrender" id="news-action-tmpl">
<div class="news-action" id="action{{:index}}" style="display: none;" data-index="{{:index}}">
<div class="inner">
    <div class="form-group">
        <label>标题</label>
        <input class="form-control action-title" type="text" name="title" />
    </div>
    <div class="form-group">
        <label>封面</label>
        <div class="form-control">
            <form enctype="multipart/form-data" class="upload-file-form" role="form" action="${baseURL }news/image" method="post">
                <input accept="image/jpeg" type="file" name="uploadFile" class="file-inline">
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
        <input class="form-control link" type="text" name="url" />
    </div>
</div>
<i class="arrow arrow-out"></i>
<i class="arrow arrow-in"></i>
</div>
</script>
