<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript" src="${baseURL }js/jquery.form.js"></script>
<script type="text/javascript" src="${baseURL }js/material.js"></script>
<script type="text/javascript" src="${baseURL }js/underscore-min.js"></script>
<div id="material" class="material">
	<div>
		<ul class="nav nav-tabs">
		  <li class="active"><a href="#pt_box">图文消息</a></li>
		  <li><a href="#picture_box">图片</a></li>
		  <li><a href="#audio_box">音频</a></li>
		  <li><a href="#music_box">音乐</a></li>
		  <li><a href="#video_box">视频</a></li>
		</ul>
	</div>
	<div class="tab-content">
		<div id="pt_box" class="pt-box tab-pane active">
			<div class="row">
				<div class="col-lg-4 list1">
					<div class="pt-features">
						<a href="${baseURL }admin/material/single/add">
							<i class="one-pt-icon"></i>
							<strong>单图文消息</strong>
						</a>
						<a href="${baseURL }admin/material/multiple/add">
							<i class="some-pt-icon"></i>
							<strong>多图文消息</strong>
						</a>
					</div>
				</div>
				<div class="col-lg-4 list2">
				</div>
				<div class="col-lg-4 list3">
				</div>
			</div>
			<div id="paginationpt" class="pagination"></div>
		</div>
		<div id="picture_box" class="picture-box tab-pane">
			<div class="row">
				<div class="col-lg-12">
					<div class="picture-actions">
						<form enctype="multipart/form-data"  id="update_image_file"  class="upload-file-form" role="form" action="${baseURL }image" method="post">
							<div class="row">
								<div class="col-lg-4">
									<input accept="image/jpeg" class="form-control" id="image_upload" type="file" name="multipartFile" class="file-inline">
								</div>
								<div class="col-lg-4">
									<button class="btn btn-success" id="submit-img">上传</button>
								</div>
							</div>
							
						</form>
					</div>
					<div id="picture_list" class="picture-list"></div>
				</div>
			</div>
			<div id="paginationimg" class="pagination"></div>
		</div>
		<div id="audio_box" class="audio-box tab-pane ">
			<div class="row">
				<div class="col-lg-12">
					<div class="audio-actions">
						<form enctype="multipart/form-data"  id="update_audio_file"  class="upload-file-form" role="form" action="${baseURL }voice" method="post">
							<div class="row">
								<div class="col-lg-4">
									<div class="form-group">
										<input placeholder="名称" class="form-control" name="name" />
									</div>
								</div>
								<div class="col-lg-4">
									<div class="form-group">
										<input accept="audio/mpeg" id="audio_upload" type="file" name="multipartFile" class="file-inline form-control">
									</div>
								</div>
								<div class="col-lg-4">
									<button class="btn btn-success" id="submit_audio">上传</button>
								</div>
							</div>
						</form>
					</div>
					<div id="audio_list" class="audio-list"></div>
				</div>
			</div>
			<div id="paginationaudio" class="pagination"></div>
		</div>
		<div id="music_box" class="music-box tab-pane">
			<div class="row">
				<div class="col-lg-12">
					<div class="music-actions">
						<form enctype="multipart/form-data"  id="update_music_file"  class="upload-file-form" role="form" action="${baseURL }music" method="post">
							<div class="row">
								<div class="col-lg-6">
									<div class="form-group">
										<input placeholder="主题" class="form-control" name="title" />
									</div>
								</div>
								<div class="col-lg-6">
									<div class="form-group form-control">
										<label class="form-tip inline">背景图片:</label><input accept="image/jpeg" id="music_upload" type="file" name="multipartFile" class="file-inline inline">
									</div>
								</div>
								<div class="col-lg-6">
									<div class="form-group">
										<input placeholder="音乐链接" class="form-control" name="musicUrl" />
									</div>
								</div>
								<div class="col-lg-6">
									<div class="form-group">
										<input placeholder="音乐链接" class="form-control" name="hqMusicUrl" />
									</div>
								</div>
								<div class="col-lg-6">
									<div class="form-group">
										<input placeholder="描述" class="form-control" name="description" />
									</div>
								</div>
								<div class="col-lg-1">
									<button class="btn btn-success" id="submit_music">上传</button>
								</div>
							</div>
						</form>
					</div>
					<div id="music_list" class="music-list">
						
					</div>
				</div>
			</div>
			<div id="paginationmusic" class="pagination"></div>
		</div>
		<div id="video_box" class="video-box tab-pane ">
			<div class="row">
				<div class="col-lg-12">
					<div class="video-actions">
						<form enctype="multipart/form-data"  id="update_video_file"  class="upload-file-form" role="form" action="${baseURL }video" method="post">
							<div class="row">
								<div class="col-lg-3">
									<div class="form-group">
										<input placeholder="主题" class="form-control" name="title" />
									</div>
								</div>
								<div class="col-lg-3">
									<div class="form-group">
										<input accept="video/mp4" id="video_upload" type="file" name="multipartFile" class="file-inline form-control">
									</div>
								</div>
								<div class="col-lg-3">
									<div class="form-group">
										<input placeholder="描述" class="form-control" name="description" />
									</div>
								</div>
								<div class="col-lg-3">
									<button class="btn btn-success" id="submit_video">上传</button>
								</div>
							</div>
						</form>
					</div>
					<div id="video_list" class="video-list row">

					</div>
				</div>
			</div>
			<div id="paginationvideo" class="pagination"></div>
		</div>
		<div id="ddd"></div>
	</div>
</div>
<script type="text/javascript">
    $(function() {
        $('#material_page_btn').addClass('active');
    });
</script>
<script type="text/x-jsrender" id="picture-item-tmpl">
<div class="row picture-list-item" data-id="{{:id}}">
    <div class="col-lg-6">
        <div class="picture-name"></div>
        <div><img width=100 height=75 alt="" src="{{:image_url}}"></div>
    </div>
    <div class="col-lg-3">
        <div></div>
    </div>
    <div class="col-lg-3">
        <div>
            <!--<a href="javascript:void(0)" class="download-img action"><i class="fa fa-download fontsize2"></i></a>
            <a href="javascript:void(0)" class="edit-img action"><i class="fa fa-edit fontsize2"></i></a>-->
            <a href="javascript:void(0)" class="delete-img action"><i class="fa fa-trash-o fontsize2"></i></a>
        </div>
    </div>
</div>
</script>
<script type="text/x-jsrender" id="audio-item-tmpl">
<div class="row audio-list-item" data-id="{{:id}}">
    <div class="col-lg-6">
        <div class="audio-name">{{:name}}</div>
        <div class="audio-play">
			<div class="play-icon btn btn-play"  data-id="{{:id}}">
				<span class="play-status">点击播放</span>
				<i class="play-status"></i>
			</div>
		</div>
        <div style="display: none;">
			<audio controls="controls" src="{{:voice_url}}" id="audio{{:id}}">
				您的浏览器不支持 audio 标签。
			</audio>
		</div>
    </div>
    <div class="col-lg-3">
        <div class="size"></div>
    </div>
    <div class="col-lg-3">
        <div>
            <!--<a href="javascript:void(0)" class="download-audio action"><i class="fa fa-download fontsize2"></i></a>
            <a href="javascript:void(0)" class="edit-audio action"><i class="fa fa-edit fontsize2"></i></a>-->
            <a href="javascript:void(0)" class="delete-audio action"><i class="fa fa-trash-o fontsize2"></i></a>
        </div>
    </div>
</div>
</script>
<script type="text/x-jsrender" id="music-item-tmpl">
<div class="row music-list-item" data-id="{{:id}}">
<div class="col-lg-3">
	<div class="music-name">{{:title}}</div>
</div>
<div class="col-lg-3 common-music">
	<div class="music-inner">
		<img width=135 height=80 alt="" src="{{:thumb_url}}" />
		<a class="music-play" data-id="{{:id}}"><i class="fa fa-play fontsize2"></i></a>
	</div>
	<div class="music-type">普通播放</div>
</div>
<div class="col-lg-3 hq-music">
	<div class="music-inner">
		<img width=135 height=80 alt="" src="{{:thumb_url}}" />
		<a class="music-play hq" data-id="{{:id}}"><i class="fa fa-play fontsize2"></i></a>
	</div>
	<div class="music-type">高清播放</div>
</div>
<div class="col-lg-3">
	<div>
		<a href="javascript:void(0)" class="delete-music action"><i class="fa fa-trash-o fontsize2"></i></a>
	</div>
</div>
<div style="display: none;">
	<audio id="music{{:id}}" controls="controls" src="{{:music_url}}"></audio>
	<audio id="hqmusic{{:id}}" controls="controls" src="{{:hq_music_url}}"></audio>
</div>
</div>
</script>
<script type="text/x-jsrender" id="video-item-tmpl">
<div class="col-lg-4">
    <div class="video-list-item" data-id="{{:id}}">
        <div class="content">
            <div class="title">{{:title}}</div>
            <div class="cover">
                <video controls="controls" src="{{:video_url}}">
                    您的浏览器不支持 video 标签。
                </video>
            </div>
            <div class="description">{{:description}}</div>
        </div>
        <footer>
            <div class="video-footer"><a href="javascript:void(0);" class="delete-video">删除</a></div>
        </footer>
    </div>
</div>
</script>