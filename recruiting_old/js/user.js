$(function() {
	var _groups = null;
	var pageSize = 10;
	var checkedItem = 0;
	var $pagination = $("#pagination");
	(function init() {
		wcm.ajaxGet({url: wcm.getApiURL('userGroups')}, userGroupsRender);
	})();
	function userGroupsRender(groups) {
		_groups = groups;
		getUserList(0, 1);
		if(groups.length == 0) {
			return;
		}
		var $userGroups = $("#user_groups");
		$userGroups.append($("#user_groups_tmpl").render(groups));
		batchGroupsSelectionRender(groups);
	};
	function batchGroupsSelectionRender(groups) {
		$(".batch-box").css({"visibility": "visible"});
		$(".batch-selections").append($("#group_type_tmpl").render({groups:groups}));
		if($(".checkbox:checked").length == 0) {
			$(".batch-box .putin").addClass("disabled");
		}
	};
	function getUserList(groupId, pageNum) {
		wcm.ajaxGet({url: wcm.getApiURL('userList'), data: {group_id: parseInt(groupId), page_size: pageSize, page_num: parseInt(pageNum)}}, userListRender);
	}
	function userListRender(data) {
		var users = data.list;
		var $usersInfo = $("#users-info");
		$usersInfo.empty();
		if(users.length == 0) {
			$usersInfo.html("<div class='none-data'>暂时没有数据</div>");
			$pagination.empty();
			return;
		}
		$usersInfo.append($("#group_user_tmpl").render({users: users, groups: _groups}));
		$pagination.bootstrapPaginator({
			currentPage: data.pagination.pageNum,
			totalPages: data.pagination.totalPage,
			numberOfPages: 5,
			onPageChanged: function(event, oldPage, newPage) {
				var groupId = $(".user-group.active").length == 0 ? 0 : $(".user-group.active").attr("id");
				getUserList(groupId, newPage);
			}
		});
	}
	var $groupTextBox = $("#group_text");
	var $groupText = $("#group_text .text");
	//seach
	$("#user").on("click", "#user_search", function(event) {
		var groupid = $(".user-group.active").length == 0 ? 0 : $(".user-group.active").attr("id");
		wcm.ajaxGet({url: wcm.getApiURL('userList'), data: {group_id: parseInt(groupid), keyword: $("#keyword_search").val()}}, userListRender);
	});
	$("#user").on("click", "#keyword_search", function(event) {
		if(event.keyCode == 13) {
			var groupid = $(".user-group.active").length == 0 ? 0 : $(".user-group.active").attr("id");
			wcm.ajaxGet({url: wcm.getApiURL('userList'), data: {group_id: parseInt(groupid), keyword: $(this).val()}}, userListRender);
		}
	});
	$("#add_btn").on("click", function() {
		$groupTextBox.removeClass("hide");
	});
	$groupTextBox.on("keypress", ".text", function(event) {
		if(event.keyCode === 13) {
			addUserGroup($groupText.val());
		}
	});
	$groupTextBox.on("click", ".add", function(event) {
		addUserGroup($groupText.val());
	});
	$groupTextBox.on("click", ".cancel", function(event) {
		$groupTextBox.addClass("hide");
	});
	$("#checkall").on("click", function(event) {
		var $batchGroup = $(".batch-selections .putin");
		if($(this).prop("checked")) {
			$("input.checkbox").prop("checked", true);
			$batchGroup.removeClass("disabled");
			checkedItem = $("input.checkbox").length;
			return;
		}
		$("input.checkbox").prop("checked", false);
		checkedItem = 0;
		$batchGroup.addClass("disabled");
	});
	$("#user").on("click", "input.checkbox", function() {
		var $batchGroup = $(".batch-selections .putin");
		if($(this).prop("checked")) {
			checkedItem++;
			$batchGroup.removeClass("disabled");
		} else {
			checkedItem--;
			if(checkedItem == 0)
				$batchGroup.addClass("disabled");
		}
	});
	$("#user").on("click", ".batch-selections .putin", function(event) {
		var cGroupId = $(".user-group.active").length ? $(".user-group.active").attr("id") : 0;
		var nGroupId = $(this).prev().find("button.dropdown-toggle").attr("id");
		var users = [];
		$.each($("input.checkbox:checked"), function(i, dom) {
			users.push(parseInt($(dom).closest(".user-info").attr("id")));
		});
		userBatchMove(users, cGroupId, nGroupId);
	});
	$("#user").on("click", ".single-selections .putin", function(event) {
		var $dom = $(this).prev().find("button.dropdown-toggle");
		if($(".user-group.active").length == 0) {
			userOneMove($(this).closest(".user-info").attr("id"), 0, $dom.attr("id"), $dom);
		} else {
			userOneMove($(this).closest(".user-info").attr("id"), $(".user-group.active").attr("id"), $dom.attr("id"), $dom);
		}
	});
	$("#user").on("click", ".group-edit", function(event) {
		var $infoShow = $(this).closest(".info-show");
		$infoShow.addClass("hide");
		$infoShow.closest(".user-group").append($("#group_edit_tmpl").render());
	});
	$("#user").on("click", ".group-delete", function(event) {
		var flag = confirm("确认删除?");
		if(!!flag) {
			var $currentGroup = $(this).closest(".user-group");
			deleteUserGroup($currentGroup.attr("id"), $currentGroup);
		}
	});
	$("#user").on("keypress", ".info-edit .text", function(event) {
		if(event.keyCode === 13) {
			var val = $(this).val();
			editUserGroup($(this).closest(".user-group ").attr("id"), $(this).val(), $(this).closest(".info-edit"));
		}
	});
	$("#user").on("click", ".info-edit .add", function(event) {
		var val = $(this).prev().val();
		editUserGroup($(this).closest(".user-group ").attr("id"), val, $(this).closest(".info-edit"));
	});
	$("#user").on("click", ".info-edit .cancel", function(event) {
		var $dom = $(this).closest(".info-edit");
		$dom.prev().removeClass("hide");
		$dom.remove();
	});
	$("#user").on("click", ".getusers", function(event) {
		if(event.target.hasAttribute("getgroups")) {
			getUserList($(this).attr("id"), 1);
			var $closestUserGroup = $(this).closest(".user-group");
			$(".user-group").removeClass("active");
			if($closestUserGroup.length) {
				$closestUserGroup.addClass("active");
			}
		}
	});
	$("#user").on("click", ".dropdown-menu li", function(event) {
		var $prev = $(this).closest(".dropdown-menu").prev();
		var $select = $(this).find("a");
		$prev.attr("id", $select.attr("id"));
		$prev.find("span:first-child").text($select.text());
	});
	function addUserGroup(groupName) {
		if(!groupName || groupName.trim() == "") {
			return;
		}
		wcm.ajaxPost({url: wcm.getApiURL("addGroup"), data: {group_name: groupName}}, function(groupId){
			$("#user_groups").append($("#user_groups_tmpl").render({id: groupId, name: groupName}));
			$groupText.val('');
			$groupTextBox.addClass('hide');
			updateGroupSelection();
		});
	};
	function editUserGroup(groupId, groupName, $target) {
		if(!groupName || groupName.trim() == "") {
			wcm.alert("alert-danger", "分组信息不能为空");
			return;
		}
		wcm.ajaxPut({url: wcm.getApiURL("editGroup"), data: {group_id: parseInt(groupId), group_name: groupName}}, function(result) {
			var $prevtarget = $target.prev();
			$target.remove();
			$prevtarget.find("span:first-child").text(groupName);
			$prevtarget.removeClass("hide");
			updateGroupSelection();
		});
	};
	function deleteUserGroup(groupId, $removedDom) {
		wcm.ajaxDelete({url: wcm.getApiURL("deleteGroup"), data: {group_id: parseInt(groupId)}}, function(response) {
			$removedDom.remove();
			updateGroupSelection();
		});
	}
	function userOneMove(userId, cGroupId, nGroupId, $dom) {
		wcm.ajaxPost({url: wcm.getApiURL("userMove"), data: {user_id: parseInt(userId), current_group_id: parseInt(cGroupId), target_group_id: parseInt(nGroupId)}}, function(result) {
			if($(".user-group.active").length == 0) {
				$dom.attr("id", nGroupId);
				return;
			}
			$dom.closest(".user-info").remove();
		});
	}
	function userBatchMove(users, cGroupId, nGroupId) {
		wcm.ajaxPost({url: wcm.getApiURL("userBatchMove"), data: {user_id: users, current_group_id: parseInt(cGroupId), target_group_id: parseInt(nGroupId)}}, function(result) {
			if($(".user-group.active").length == 0)
				return;
			$.each($("input.checkbox:checked"), function(i, dom) {
				$(dom).closest(".user-info").remove();
			});
		});
	}
	function updateGroupSelection() {
		wcm.ajaxGet({url: wcm.getApiURL("userGroups")}, function(groups) {
			_groups = groups;
			if(groups.length == 0) {
				$(".batch-box").css({"visibility": "hidden"});
				$(".update-selections").empty();
				return;
			}
			$(".batch-box").css({"visibility": "visible"});
			$("#user .update-selections").empty().append($("#group_type_tmpl").render({groups: groups}));
			if($(".checkbox:checked").length == 0) {
				$(".batch-box .putin").addClass("disabled");
			}
		});
	};
});