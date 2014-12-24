$(document).ready(function(){
	var tool = $('#header .tool a')
	var tool_active = $('#header .tool .active')
	tool.bind('mouseover',function(){
	if ($(this).hasClass('active'))
	{
		
	}
	else
	{
	      $(this).addClass('hover')
	      tool_active.removeClass('hover')
	}
	  });
	  tool.bind('mouseout',function(){
	    $(this).removeClass('hover')
	    tool_active.addClass('hover')
	  })
	
	
});


