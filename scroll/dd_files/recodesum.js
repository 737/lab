M.Page.recodeSumPage = M.createClass();
M.extend(M.Page.recodeSumPage.prototype,
{
    context: {},
	submittext:"处理中...",
	typelist:{},
	innlist:{},
	consumedetail:{},
	innid:'',
	sendstatus:0,
	tabmenu:{"income":"收入","pay":"支出"},
	tabexamp:{"income":"备注，如：201客人肖万凯买13号普洱茶饼一个。","pay":"备注，如：大床房卫生间花洒换新"},
	tpl_type:'<div value="${id}" t="${tag}"><a href="javascript:;">${name}</a></div>',
	tpl_inn:' <div value="${innid}"><a href="javascript:;" class="on">${innname}</a></div>',
	tpl_pay:'<div value="${paytypecode}"><a href="javascript:;">${paytypename}</a></div>',
    init: function () {
        this.initDOM();
        this.initEvent();
    },
    initDOM: function () {
		this.context.fromdate=$("#fromdate");
		this.context.enddate=$("#enddate");
		this.context.searchbtn=$("#searchbtn");
		this.context.addstatistics=$("#addstatistics");
		this.context.incomestatisticsform=$("#incomestatisticsform");
		this.context.paystatisticsform=$("#paystatisticsform");
		this.context.incometypelist=$("#incometypelist");
		this.context.paytypelist=$("#paytypelist");
		this.context.incomedate=$("#incomedate");
		this.context.paydate=$("#paydate");
		this.context.hide_data=$("#hide_data");
		this.context.detail=$("#detail");
		this.context.innidlist=$("#innidlist");
		this.context.searchbtn=$("#searchbtn");
		this.context.searchform=$("#searchform");
		this.context.edititem=$("#addstatistics").find("a");
		this.context.editpop=$("#editPop");
		this.context.incometypeitem=$("#incometypeitem");
		this.context.paytypeitem=$("#paytypeitem");
		var innid=this.context.searchform.attr("innid");
		this.context.innidlist.val(innid);
		this.context.add_incomeitem=$("#add_incomeitem");
		this.context.add_payitem=$("#add_payitem");
		this.context.pickerarea = $("#pickerarea");
		this.context.consumecashierform=$("#consumecashierform");
		this.context.consumehiddedata=$("#consumehiddedata");
		this.context.cashierqrcodedownload=$("#cashierqrcodedownload");
		
//		this.context.fromdate.datepicker({ showOtherMonths: true,selectOtherMonths: true});
//	   	this.context.enddate.datepicker({ showOtherMonths: true,selectOtherMonths: true});
//	   	this.context.incomedate.datepicker({ showOtherMonths: true,selectOtherMonths: true});
//	   	this.context.paydate.datepicker({ showOtherMonths: true,selectOtherMonths: true});
	   	
	   	this.context.men_recodesum=$("#men_recodesum");
	   	this.context.recodesumform=$("#recodesumform");
	   	this.context.addrecodedate=$("#addrecodedate");
	   	this.context.recodetypelist=$("#recodetypelist");
	   	this.context.recodesum_hidedata=$("#recodesum_hidedata");
	   	this.context.body=$("body");
	   	this.context.addrecodedate.datepicker({ showOtherMonths: true,selectOtherMonths: true});
	   	
    },
    initEvent:function() {
    	this.context.men_recodesum.bind("click",this.recodesum_click.toEventHandler(this));
		this.context.edititem.bind("click",this.edititem_click.toEventHandler(this));
		this.context.recodesumform.bind("click",this.recodesumform_click.toEventHandler(this));
		this.context.recodetypelist.bind("click",this.recodetypelist_click.toEventHandler(this));
		this.context.consumecashierform.bind('click',this.cashierform_click.toEventHandler(this));
    },
    cashierform_click:function(e){
	   	 var ele = M.EventEle(e);
	   	 var t=ele.attr("tag");
	   	 if(t=='pos'||t=='qrcode'||t=="msg"){
	   		 this.context.body.find("div.graylayer").removeClass("deepgraylayer");
	   		 this.qrOpened=false;
	   		 this._handlecashiertypeform(t);
	   	 }else if(t=="close"){
	   		this.context.body.find("div.graylayer").removeClass("deepgraylayer");
	   		 this._closepopup();
	   		 this.qrOpened=false;
	   	 }else if(t=="sendmsg"){
	   		 this.cashiermsg(ele);
	   	 }
	   	 if(t=='qrcode'){
	   		this.context.body.find("div.graylayer").addClass("deepgraylayer");
	   		 this.qrOpened=true;
	         	 this._longPolling();
	   	 }
	   	 if(t=='pos'){
	   		 this.updatecashiergateway();
	   	 }
	   	
   },
   updatecashiergateway:function(){
	   	var accountid=this.context.consumehiddedata.attr("cashierid");
	   	var posstatus=this.context.consumehiddedata.attr("posstatus");
	   	if(!M.isEmpty(posstatus)&&posstatus==1){
	   		return;//已更新过则不进行更新
	   	}
	   	var innid=this.context.recodesumform.find("div[t=innlist]").children("span").attr("value");
	   	var data={"a":"updatecashiergateway","accountid":accountid,"type":2,"innid":innid};
	   	 M._getjson("ajax.php",data,this.updatecashiergateway_finished.toEventHandler(this));
   	
   },
   updatecashiergateway_finished:function(d){
	   	if(d.status=="success"){
	   		this.context.consumehiddedata.attr("posstatus",1);
	   	}else{
	   		M.error(d.msg)
	   	}
   },
   _handlecashiertypeform:function(type){
	   	 var tpl=this.context.consumecashierform.find("div[tag=paytypelist]");
	   	 tpl.find("li").removeClass("checked");
	   	 tpl.find("i[tag="+type+"]").parents("li").addClass("checked");
	   	 this.context.consumecashierform.find("div[tag=msg]").hide();
	   	 this.context.consumecashierform.find("div[tag=qrcode]").hide();
	 	this.context.consumecashierform.find("div[tag=pos]").hide();
	   	 this.context.consumecashierform.find("div[tag="+type+"]").show(); 
	   
   },
   _longPolling:function(){
       if (!this.qrOpened) {
           return;
       }
       var aid = this.context.consumehiddedata.attr("cashierid");
       var trade_no = this.context.consumehiddedata.attr("trade_no");
       var data = {"a":"getpaystatus","out_trade_no":aid,"trade_no":trade_no};
       M._getjson("ajax.php",data,this.getpaystatus_finished.toEventHandler(this));
   },
   getpaystatus_finished:function(d){
       var data = d.info;
       if ('202' == data.code) {
           this._longPolling();
       } else{
    	   this.context.body.find("div.graylayer").removeClass("deepgraylayer");
    	    this.context.consumecashierform.find("div[tag=pay]").hide();
	       	var tpl=this.context.consumecashierform.find("div[tag=payresult]").show();
	       	tpl.find("span[tag=gateway]").html(data.gateway);
	       	tpl.find("span[tag=totalprice]").html(data.total_fee);
	       	if('200' == data.code){
	       		tpl.find("div[tag=success]").show();
	       		tpl.find("div[tag=fail]").hide();
	       	}else{
	       		tpl.find("div[tag=success]").hide();
	       		tpl.find("div[tag=fail]").show();
	       	}
       }
   },
   _handlepaytype:function(innid){
	   var inn={};
	   var innlist=this.innlist;
	   for(var i=0;i<innlist.length;i++){
		   if(innlist[i].innid==innid){
			   inn=innlist[i];
		   }
	   }
	   if(M.isEmpty(inn.box)||inn.box.length==0){
		   this.context.consumecashierform.find("div[tag=paytypelist]").find("li[tag=pos]").attr("status",0).hide();
	   }else{
		   this.context.consumecashierform.find("div[tag=paytypelist]").find("li[tag=pos]").attr("status",1).show();
	   }
	   
   },
   cashier:function(){
	    var innid=this.context.recodesumform.find("div[t=innlist]").children("span").attr("value");
	    this._handlepaytype(innid);
	   	var detail=this.consumedetail;
	    this.context.consumecashierform.find("div[tag=pay]").show();
       	this.context.consumecashierform.find("div[tag=payresult]").hide();
       	var paytype='qrcode';
       	var posstatus= this.context.consumecashierform.find("div[tag=paytypelist]").find("li[tag=pos]").attr("status");
       	if(posstatus==1){
       		paytype='pos';
       		this.context.consumecashierform.find("div[tag=paytypelist]").find("li[tag=qrcode]").parents("div[tag=paytypelist]").attr("style","");
       	}else{
       		this.context.consumecashierform.find("div[tag=paytypelist]").find("li[tag=qrcode]").parents("div[tag=paytypelist]").attr("style","width:260px");
       	}
   		this.context.consumecashierform.find("div[tag=qrcode]").show();
	   	this.context.consumehiddedata.attr("posstatus",0);
	   	var data={"a":"getpayinfo","paytype":paytype};
	   	data.accountid=this.context.consumehiddedata.attr("cashierid");	
	   	data.desc='其他消费';
	   	data.appendmoney=detail.money;
	   	data.innname=this.context.recodesumform.find("div[t=innlist]").children("span").text();
	   	if(data.appendmoney==0){
    		return;
    	}
	   	 M._getjson("ajax.php", data,this.getpay_finished.toEventHandler(this));
   },
   getpay_finished:function(d){
       if(d.status=="success"){
           var info = d.info;
           var data = info.data;
           var paytype=d.req.paytype;
           this._handlecashiertypeform(paytype);
           this.context.consumehiddedata.attr("trade_no",data.trade_no)
           this.context.consumecashierform.find("img[tag=qrcode]").attr("src",data.pay_qr);
       	   this.context.consumecashierform.find("div[tag=msgdesc]").children("a").attr("href",data.pay_url); 
       	   var innname=d.req.innname;
       	   var appendmoney=d.req.appendmoney;
       	   var msgtpl=this.context.consumecashierform.find("div[tag=msgdesc]");
       	   var msg='您在&lt;'+innname+'&gt的消费需支付'+appendmoney+'元，请点击以下链接以完成支付[支持支付宝和信用卡支付]。';
       	   msgtpl.find("span").html(msg);
       	   msgtpl.find("a").html("href",data.pay_url).html(data.pay_url);
	       
           M.Popup(this.context.consumecashierform, {"hideclass": "modal cashier fade", "showclass": "modal cashier fade in", "dragable": true});
       	  if(paytype=='qrcode'){
       		this.context.body.find("div.graylayer").addClass("deepgraylayer");
       	  }
           if(paytype=='qrcode'||paytype=='pos'){
           	this.qrOpened=true;
           	this._longPolling();
           }
           if(paytype=='pos'){
           	this.updatecashiergateway();
           }
       }else{
           M.error(d.msg);
       }
   },
   _showcashiermsg:function(){
   	
   },
   cashiermsg:function(ele){
       var phone = this.context.consumecashierform.find("input[name=phone]").val();
       var msg=this.context.consumecashierform.find("div[tag=msgdesc]").children("span").text();
       var href=this.context.consumecashierform.find("div[tag=msgdesc]").children("a").attr("href");
       var msgcon=msg+href;
       if(!M.isEmpty(phone)){
           var re= /^(13|15|18)[0-9]{9}$/ ;
               if(!re.test(phone))
               {
                   alert("请输入正确的手机号");
                   return false;
           }else{
               alert("短信已发送，客人成功支付后，您会在房态页收到提醒。");
           }
       }else{
           alert('手机号不能为空');
           return;
       }
       //hasphone为0更新订单添加手机号
//       var hasphone = this.context.cashiermsgPop.find("input[tag=phone]").attr("hasphone");
       M._getjson("ajaxmsg.php",{"a":"sendpaymsg","phone":phone,"msgcon":msgcon,"other":'记一笔',"type":'2'},this.cashiermsg_finished.toEventHandler(this));
       this._closepopup();
   },
   cashiermsg_finished:function(d){
       if(d.status=="success"){
           var data = d.data;
           //M.success("发送成功");
           //this.context.consumecashierform.removeClass("btn btn-primary btn-small").addClass("btn btn-cancel btn-small").attr("flag", "disabled").text("已发送");
       }else{
           M.error((d.msg));
       }
   },
    saverecodesum:function(ele,msg){
    	var data={};
    	var tpl_type=this.context.recodesumform.find("li[tag=typelist]");
		var tpl_pay=tpl_type.find("div[t=paytypelist]");
		var tpl_consume=tpl_type.find("div[t=consumelist]");
		data.typeid=tpl_consume.children("span").attr("value");
		data.typename=tpl_consume.children("span").text();
		data.paytypecode=tpl_pay.children("span").attr("value");
		data.paytypename=tpl_pay.children("span").text();
    	data.type=this.context.recodesum_hidedata.attr("recodetype");    	
    	data.innid=this.context.recodesumform.children().find("div[t=innlist]").children("span").attr("value");
    	data.date=this.context.addrecodedate.val();
    	data.money=M.getVal(this.context.recodesumform.children().find("input[name=money]"));
    	data.remark=M.getVal(this.context.recodesumform.children().find("textarea[name=remark]"));
    	var tab=this.tabmenu[data.type];
    	if(M.isEmpty(data.typeid))
		{
			alert("请选择"+tab+"项目");
			return;
		}
    	if(isNaN(data.money)||data.money==0)
		{
			alert("请输入"+tab+"金额");
			return;
		}
    	if(M.isEmpty(data.paytypecode))
		{
			alert("请选择支付方式");
			return;
		}
    	if(this.sendstatus==1){
    		M.error("处理中请稍等....");
    	}
    	this.sendstatus=1;
    	data.a='saverecodesum';
    	 M._getjson("/ajax2.php",data, this.saverecodesum_finished.toEventHandler(this));    		
    },
    saverecodesum_finished:function(d){
    	this.sendstatus=0;
    	if(d.status=="success"){
    		
    		var paytypecode=d.req.paytypecode;
    		if(paytypecode=='shouyintai'){
				this.consumedetail=d.req;
				this.context.consumehiddedata.attr("cashierid",d.cashierid);
				this.context.consumecashierform.find("span[tag=totalprice]").html("&yen;"+d.req.money);
				this.context.consumecashierform.find("input[name=phone]").val('');
				this.cashier();
			}else{
				M.success("添加成功");
			}    	
           this.context.recodesumform.children().find("a[tag=closebtn]").click();
    	}else{
    		alert(d.msg);
    	}
    	
    },
    recodesum_click:function(){
    	var tpl_inn=this.context.recodesumform.children().find("div[t=innlist]").attr("value","");
    	this.sendstatus=0;
    	var datetime=this.getdatetime();
    	var nowdate=M.timeformat(datetime,'Y-m-d');
    	this.context.addrecodedate.val(nowdate);
    	this.context.recodesum_hidedata.attr("recodetype","income");
    	this.context.recodesumform.find('input[tag=tab_income]').attr("checked","checked");
    	this.context.recodesumform.find('input[tag=tab_pay]').attr("checked",false);
    	M.emptyVal(this.context.recodesumform.find("input[name=money]"));
    	M.emptyVal(this.context.recodesumform.find("textarea[name=remark]"));
    	if(M.isEmpty(this.typelist.income)){    		
    		M._getjson("/ajax2.php", {"a":"getuserwatertypelist"},this.getuserwatertypelist_finished.toEventHandler(this)); 
    	}else{
    		var html=$.tmpl(this.tpl_inn,this.innlist);
    		var innid=this.innid; 
    		var tpl_inn=this.context.recodesumform.children().find("div[t=innlist]").attr("value",innid);
    		tpl_inn.children("div").hide().children("div").html(html);
    		this.inn=M.DropdownList(tpl_inn,this.innchange.toEventHandler(this),{});
    		var tpl_type=this.context.recodesumform.find("li[tag=typelist]");
    		var tpl_pay=tpl_type.find("div[t=paytypelist]");
    		var tpl_consume=tpl_type.find("div[t=consumelist]");
    		tpl_pay.children("span").attr("value","cash").text('现金');
    		tpl_consume.children("div").hide();
    		tpl_pay.children("div").hide();
    		M.DropdownList(tpl_pay,null,{});
    		M.DropdownList(tpl_consume,null,{});
    		this.initrecodesumform("income", "收入");
    		M.Popup(this.context.recodesumform,{"hideclass":"modal sm fade","showclass":"modal sm fade in","dragable":true,"drag":this.dragincome.toEventHandler(this)});
    	}
    },
    innchange:function(){
    	var tpl_inn=this.context.recodesumform.children().find("div[t=innlist]");
    	var pay_type=this.context.recodesumform.find("input[name=record]:checked").attr("tag");
    	var innid=tpl_inn.children("span").attr("value");
    	var tpl_type=this.context.recodesumform.find("li[tag=typelist]");
		var tpl_pay=tpl_type.find("div[t=paytypelist]");
    	if(innid==0){
    		var value=tpl_pay.children("span").attr("value");
			if(!M.isEmpty(value)&&value=='shouyintai'){
				tpl_pay.children("span").attr("value","cash").text('现金');
			}
    		tpl_pay.find("div[tag=option][value=shouyintai]").hide();
    	}else{
    		if(pay_type=='tab_income'){
    			tpl_pay.find("div[tag=option][value=shouyintai]").show();
    		}
    		
    	}
    },
    getuserwatertypelist_finished:function(d){
    	if(d.status=="success"){
    		var list=d.typelist;
    		this.typelist=list;
    		var innlist=d.innlist;
    		this.innlist=innlist;
    		this.innid=d.innid;
    		var checkowner=d.checkowner;
    		if(checkowner==1){
    			this.context.cashierqrcodedownload.show();
    		}else{
    			this.context.cashierqrcodedownload.hide();
    		}
    		var html=$.tmpl(this.tpl_inn,innlist);
    		var tpl_inn=this.context.recodesumform.children().find("div[t=innlist]").attr("value",this.innid);
    		tpl_inn.children("div").hide().children("div").html(html);
    		var tpl_type=this.context.recodesumform.find("li[tag=typelist]");
    		var paytypelist=d.paytypelist;
    		var html_pay=$.tmpl(this.tpl_pay,paytypelist);
    		var tpl_pay=tpl_type.find("div[t=paytypelist]");
    		var tpl_consume=tpl_type.find("div[t=consumelist]");
    		tpl_pay.find("div[tag=list]").html(html_pay);
    		tpl_pay.find("div[value=shouyintai]").addClass('new');
    		M.DropdownList(tpl_pay,null,{});
    		this.inn=M.DropdownList(tpl_inn,this.innchange.toEventHandler(this),{});
    		var type_html=$.tmpl(this.tpl_type,this.typelist);
    		tpl_consume.find("div[tag=list]").html(type_html);
    		tpl_pay.children("span").attr("value","cash").text('现金');
    		tpl_consume.children("div").hide();
    		tpl_pay.children("div").hide();
    		M.DropdownList(tpl_consume,null,{});
    		this.initrecodesumform("income", "收入");   		
    		M.Popup(this.context.recodesumform,{"hideclass":"modal sm fade","showclass":"modal sm fade in","dragable":true});
    	}
    },
    dragincome:function(){
    	var display=this.context.recodetypelist.css("display");
    	var ele=this.context.recodesumform.children().find("div[tag=buttons]");
        if(display=="none"){
        	return;
        }
    	var top = ele.offset().top+ ele.outerHeight()+ 2;
    	var left = ele.offset().left;
    	this.context.recodetypelist.css({"top":top,"left":left,"z-index":1060}).show() ;
	    M.stopevent(ele);	    
    },
    recodesumform_click:function(e){
    	var ele = M.EventEle(e);
        var t = ele.attr("tag");
        var elet=ele.attr("t");
        if(M.isEmpty(elet))
        	elet='';
        var parents=ele.parents("div[t=innlist]");
        if(parents.length==0&&elet!='innlist'){
        	var tpl=this.context.recodesumform.children().find("div[t=innlist]");
        	var style=tpl.children("div").css("display");
        	if(style!="none"){
        		tpl.removeClass("droplist_on").children("div").hide();
        	}
        }
        var parents=ele.parents("div[t=consumelist]");
        if(parents.length==0&&elet!='consumelist'){
        	var tpl=this.context.recodesumform.children().find("div[t=consumelist]");
        	var style=tpl.children("div").css("display");
        	if(style!="none"){
        		tpl.removeClass("droplist_on").children("div").hide();
        	}
        }
        var parents=ele.parents("div[t=paytypelist]");
        if(parents.length==0&&elet!='paytypelist'){
        	var tpl=this.context.recodesumform.children().find("div[t=paytypelist]");
        	var style=tpl.children("div").css("display");
        	if(style!="none"){
        		tpl.removeClass("droplist_on").children("div").hide();
        	}
        }
        if(t=="closebtn"){
        	this.context.recodetypelist.css("display","none");
        }
        if(t=="addsave"){
        	this.saverecodesum();
        }
        if(t!='buttons'&&t!='selecttype')
        {
        	this.context.recodetypelist.css("display","none");
        }
        if(t=='tab_income'){
        	this.initrecodesumform("income","收入");
        }
        if(t=='tab_pay'){
        	this.initrecodesumform("pay","支出");
        }
    },
    initrecodesumform:function(type,tabmsg){    	
    	this.context.recodesum_hidedata.attr("recodetype",type);
    	this.context.recodesum_hidedata.attr("typeid","");
    	this.context.recodesum_hidedata.attr("typename","");
    	this.context.recodesumform.children().find("span[tag=datetip]").html(tabmsg+'日期');
    	this.context.recodesumform.children().find("span[tag=inntip]").html(tabmsg+'来自');
    	var tpl_type=this.context.recodesumform.find("li[tag=typelist]");
    	var tpl_consume=tpl_type.find("div[t=consumelist]");
    	var tpl_pay=tpl_type.find("div[t=paytypelist]");
    	tpl_consume.find("div[tag=list]").children("div").hide();
    	tpl_consume.find("div[tag=list]").children("div[t="+type+"]").show();
		tpl_consume.children("span").attr("value","").html('选择'+tabmsg+'项目');
		var msg=this.tabexamp[type];
		var tpl=this.context.recodesumform.find("textarea[name=remark]");
		var remark=M.getVal(tpl);
		if(type=='pay'){
			var value=tpl_pay.children("span").attr("value");
			if(!M.isEmpty(value)&&value=='shouyintai'){
				tpl_pay.children("span").attr("value","cash").text('现金');
			}
			tpl_pay.find("div[tag=option][value=shouyintai]").hide();
		}else{
			tpl_pay.find("div[tag=option][value=shouyintai]").show();
		}
		if(M.isEmpty(remark)){
			tpl.attr("placeholder",msg);
			//var tpl_remark=this.context.recodesumform.children().find("textarea[name=remark]").attr("placeholder",this.tabexamp[type]);
	    	M.emptyVal(tpl);
		}
		
    },
    recodetypelist_click:function(e){
    	var ele = M.EventEle(e);
    	var id=ele.attr("tid");
    	var name=ele.text();
    	this.context.recodesum_hidedata.attr("typename",name).attr("typeid",id);
    	this.context.recodesumform.children().find("span[tag=selecttype]").html(name);
    	this.context.recodetypelist.css("display","none");
    },
	edititem_click:function(e){
		this.context.editpop.find("ul[class=nav-tabs]").children("li:first").attr("class","active");
		this.context.editpop.find("ul[class=nav-tabs]").children().eq(1).attr("class","");
		this.context.paytypeitem.css("display","none");
		this.context.incometypeitem.css("display","block");
		this.context.editpop.css("display","block");
	},
	getdatetime:function(){
		var date=M.getTime();
		return date;
	},
	editpop_click:function(e){
		var ele = M.EventEle(e);
        var t = ele.attr("tag");
		if(t=="closebtn"){
        	this.context.editpop.css("display","none");
        }
		if(t=="incomeitem"){
        	this.context.editpop.find("ul[class=nav-tabs]").children("li:first").attr("class","active");
			this.context.editpop.find("ul[class=nav-tabs]").children().eq(1).attr("class","");
			this.context.paytypeitem.css("display","none");
			this.context.incometypeitem.css("display","block");
		
        }
		if(t=="payitem"){
			this.context.editpop.find("ul[class=nav-tabs]").children("li:first").attr("class","");
        	this.context.editpop.find("ul[class=nav-tabs]").children().eq(1).attr("class","active");
			this.context.incometypeitem.css("display","none");
			this.context.paytypeitem.css("display","block");	
        }
		if(t=="addincomeitem"){
			var incomeitem=M.getVal(this.context.add_incomeitem);
			var type=this.context.add_incomeitem.attr("itemtype");
			if(M.isEmpty(incomeitem)){
    			alert("请输入新增项目名称");
    			return ;
    		}

			if(/.*[\u4e00-\u9fa5]+.*$/.test(incomeitem)) 
			{ 
					var length=incomeitem.length;
					if(length>6){
						alert("中文名称不能超过6个字符");
						return false;
					}
			}
			if(/.*[a-z]+.*$/.test(incomeitem)){
				var length=incomeitem.length;
				if(length>12){
					alert("英文名称不能超过12个字符");
					return false;
				}
			} 
			M.emptyVal(this.context.add_incomeitem);
    		M._getjson("/ajax2.php",{"a":"adduserwatertype","typename":incomeitem,"type":type},this.addincomeitem_finished.toEventHandler(this));
					
		}
		if(t=="addpayitem"){
			var payitem=M.getVal(this.context.add_payitem);
			var type=this.context.add_payitem.attr("itemtype");
			if(M.isEmpty(payitem)){
    			alert("请输入新增项目名称");
    			return ;
    		}
			M.emptyVal(this.context.add_payitem);
    		M._getjson("/ajax2.php",{"a":"adduserwatertype","typename":payitem,"type":type},this.addpayitem_finished.toEventHandler(this));
		}
		if(t == "incomedelete"){
			this.delincomeitem(ele);
		}
		if(t == "paydelete"){
			this.delpayitem(ele);
		}
		if(t == "incomeedit"){
			this.editincomeitem(ele);
		}
		if(t == "payedit"){
			this.editpayitem(ele);
		}
		if(t == "saveincome"){
			this.saveincome(ele);
		}
		if(t == "savepay"){
			this.savepay(ele);
		}
	},
	addincomeitem_finished:function(e){
    	if(e.status=="success"){
    		 var data=e.data;
			 var id=data.typeid;
    		 var html='<li id="'+data.typeid+'"><label>'+data.typename+'</label><a href="javascript:;" tag="incomeedit" title="修改" class="edit">修改</a><a href="javascript:;"  tag="incomedelete" title="删除" class="delete"></a></li>';
			 var list='<li id="'+data.typeid+'"><a tag="type" typeid="45" href="javascript:;">'+data.typename+'</a></li>';
    		 this.context.incometypeitem.children("ul").children("li:last").before(html);
			 this.context.incometypelist.children("ul").children("li:last").before(list);
    	}else{
    		alert(e.msg);
    	}
    },
	addpayitem_finished:function(e){
    	if(e.status=="success"){
    		 var data=e.data;
			 var id=data.typeid;
    		 var html='<li id="'+data.typeid+'"><label>'+data.typename+'</label><a href="javascript:;"  tag="payedit" title="修改" class="edit">修改</a><a href="javascript:;"  tag="paydelete" title="删除" class="delete"></a></li>';
			 var list='<li id="'+data.typeid+'"><a tag="type" typeid="45" href="javascript:;">'+data.typename+'</a></li>';
    		 this.context.paytypeitem.children("ul").children("li:last").before(html);
			 this.context.paytypelist.children("ul").children("li:last").before(list);
    	}else{
    		alert(e.msg);
    	}
    },

   
    NoUndefined:function(str)
    {
    	return M.isEmpty(str)?"":str;
    },
    _closepopup:function()
    {
    	M.ClosePopup();
    },
    destroy: function () {

    }
});