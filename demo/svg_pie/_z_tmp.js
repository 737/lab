
        $("save-btn").disabled = false;
        var Rotate = {};
        Rotate.init = function () {
            Rotate.speed = 6; //转速
            Rotate.prizeList = {'i1985' : '一等奖','i1986' : '二等奖','i1987' : '三等奖','i1988' : '四等奖','i1989' : '五等奖'};
            Rotate.isRun = false;
            Rotate.isStop = false;
            Rotate.isFaild = false;
            window.winmsg = null;
        };
        Rotate.getPrizeDeg = function (prizeid) {
            if(Rotate.prizeList['i' + prizeid]){
                if (Rotate.prizeList['i' + prizeid] == '一等奖') return 8;
                if (Rotate.prizeList['i' + prizeid] == '二等奖') return 248;
                if (Rotate.prizeList['i' + prizeid] == '三等奖') return 128;
                if (Rotate.prizeList['i' + prizeid] == '四等奖') return 308;
                if (Rotate.prizeList['i' + prizeid] == '五等奖') return 188;
                if (Rotate.prizeList['i' + prizeid] == '六等奖') return 68;
            }
            return 160;
        }
        Rotate.run = function () {
            Rotate.init();
            Rotate.isRun = true;
            var deg = 0;
            var deg_increment = 18;
            var runCount = 0;

            //开始旋转
            Rotate.getWinResult();
            //获取摇奖结果
            setTimeout(ratateing, Rotate.speed);

            function ratateing() {
                deg += deg_increment;
                Rotate.rotateY('outer', deg);

                if (deg == 360) {
                    deg = 0;
                    deg_increment = 12;
                    if(runCount > 3){
                        deg_increment = 4;
                    }
                    runCount++;
                }

                if(runCount < 4 || !Rotate.isStop){
                    setTimeout(ratateing, Rotate.speed);
                    return;
                }
                //检测中奖情况
                if(winmsg || Rotate.isFaild){
                    checkWin();
                }
                else{
                    setTimeout(ratateing, Rotate.speed);
                }
            }
            //判断中奖情况
            function checkWin(){
                if(Rotate.isFaild){//网络错误
                    if(Rotate.getPrizeDeg(-1) == deg){
                        alert_t('对不起，网络连接错误，请重试');
                        Rotate.isRun = false;
                        return;
                    }
                }
                if(winmsg.iserror){//内部服务器错误
                    if(Rotate.getPrizeDeg(-1) == deg){
                        if(winmsg.errorid == "-100"){
                            alert_t('您的抽奖次数已经用完');
                        }
                        else if(winmsg.errorid == "-101"){
                            alert_t('您的当日抽奖次数已经用完');
                        }
                        else if(winmsg.errorid == "-104"){
                            alert_t('对不起，活动已经停止');
                        }
                        else if(winmsg.errorid == "-401"){
                            alert_t('对不起，活动已经结束');
                        }
                        else{
                            alert_t('对不起，网络连接错误，请重试');
                        }
                        Rotate.isRun = false;
                        return;
                    }
                }
                if(winmsg.iswin){//中奖
                    if(Rotate.getPrizeDeg(winmsg.prizeid) == deg){
                        setTimeout(function(){
                            Rotate.showPrompt();
                            Rotate.isRun = false;
                        }, 2000);
                        return;
                    }
                    if(Rotate.getPrizeDeg(-1) - deg < 160){
                        //Rotate.speed += 1;
                    }
                }
                if(winmsg.isthank){//鼓励奖
                    if(Rotate.getPrizeDeg(-1) == deg){
                        Rotate.isRun = false;
                        alert_t('对不起，您这次没有中奖');
                        return;
                    }
                }

                //继续选装
                setTimeout(ratateing, Rotate.speed);
            }
        };
        Rotate.showPrompt = function(){
            $('prizetype').innerHTML = Rotate.prizeList['i' + winmsg.prizeid];
            $('sncode').innerHTML = winmsg.sn;
            $('promptMsg').style.display = 'block';
            $('panelLottery').style.display = 'none';
        };
        //向服务器请求抽奖
        Rotate.getWinResult = function () {
            var config = {
                method: 'get',
                url: 'ajax.aspx?sn=4315b10729fff86725f1887daeaab482&wid=111521&acid=2758&m=lottery' + '&' + Math.random()
            };

            var request = new x.WebRequest(config);

            request.onSuccess = function (responseText, responseXML) {
                if (responseText.indexOf('ajax_msg:') != -1) {
                    eval("window.winmsg = " + responseText.replace('ajax_msg:', '') + ";");
                    Rotate.isStop = true;
                }
                else {
                    Rotate.isFaild = true;
                    Rotate.isStop = true;
                }
            };

            request.onFailure = function () {
                Rotate.isFaild = true;
                Rotate.isStop = true;
            };

            request.onException = function () {
                Rotate.isFaild = true;
                Rotate.isStop = true;
            };

            request.send(null);
        };

        Rotate.rotateY = function (id, _deg) {
            var element = $(id);debugger;
            element.style.MozTransform = 'rotateZ(' + _deg + 'deg)';
            element.style.WebkitTransform = 'rotateZ(' + _deg + 'deg)';
            element.style.OTransform = 'rotateZ(' + _deg + 'deg)';
            element.style.MsTransform = 'rotateZ(' + _deg + 'deg)';
            element.style.Transform = 'rotateZ(' + _deg + 'deg)';
        };

        $('inner').onclick = function(){
            if(Rotate.isRun){
                return;
            }
            Rotate.run();
        };

        function submitMobile() {
            var mobile = $('tel').value;
            if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(mobile))) {
                alert_t('请输入正确的手机号码');
                $("save-btn").disabled = false;
                return;
            }

            var config = {
                method: 'get',
                url: 'ajax.aspx?sn=4315b10729fff86725f1887daeaab482&wid=111521&acid=2758&m=addmobile' + '&winid=' + winmsg.winid + '&mobile=' + mobile + '&' + Math.random()
            };

            var request = new x.WebRequest(config);

            request.onSuccess = function (responseText, responseXML) {
                $('promptMsg').style.display = 'none';
                $('panelLottery').style.display = 'block';
                $("save-btn").disabled = false;
                alert_t('信息提交成功，我们的工作人员稍后会联系您，请牢记您的SN码');
                //Lottery.recover();
            };
            request.onFailure = function () { };
            request.onException = function () { };

            request.send(null);
        }
        function alert_t(msg){
            $('alertEleMsg').innerHTML = msg;
            $('alertEle').style.display='block';
        };
    
        $("save-btn").disabled = false;
        var Rotate = {};
        Rotate.init = function () {
            Rotate.speed = 6; //转速
            Rotate.prizeList = {'i1985' : '一等奖','i1986' : '二等奖','i1987' : '三等奖','i1988' : '四等奖','i1989' : '五等奖'};
            Rotate.isRun = false;
            Rotate.isStop = false;
            Rotate.isFaild = false;
            window.winmsg = null;
        };
        Rotate.getPrizeDeg = function (prizeid) {
            if(Rotate.prizeList['i' + prizeid]){
                if (Rotate.prizeList['i' + prizeid] == '一等奖') return 8;
                if (Rotate.prizeList['i' + prizeid] == '二等奖') return 248;
                if (Rotate.prizeList['i' + prizeid] == '三等奖') return 128;
                if (Rotate.prizeList['i' + prizeid] == '四等奖') return 308;
                if (Rotate.prizeList['i' + prizeid] == '五等奖') return 188;
                if (Rotate.prizeList['i' + prizeid] == '六等奖') return 68;
            }
            return 160;
        }
        Rotate.run = function () {
            Rotate.init();
            Rotate.isRun = true;
            var deg = 0;
            var deg_increment = 18;
            var runCount = 0;

            //开始旋转
            Rotate.getWinResult();
            //获取摇奖结果
            setTimeout(ratateing, Rotate.speed);

            function ratateing() {
                deg += deg_increment;
                Rotate.rotateY('outer', deg);

                if (deg == 360) {
                    deg = 0;
                    deg_increment = 12;
                    if(runCount > 3){
                        deg_increment = 4;
                    }
                    runCount++;
                }

                if(runCount < 4 || !Rotate.isStop){
                    setTimeout(ratateing, Rotate.speed);
                    return;
                }
                //检测中奖情况
                if(winmsg || Rotate.isFaild){
                    checkWin();
                }
                else{
                    setTimeout(ratateing, Rotate.speed);
                }
            }
            //判断中奖情况
            function checkWin(){
                if(Rotate.isFaild){//网络错误
                    if(Rotate.getPrizeDeg(-1) == deg){
                        alert_t('对不起，网络连接错误，请重试');
                        Rotate.isRun = false;
                        return;
                    }
                }
                if(winmsg.iserror){//内部服务器错误
                    if(Rotate.getPrizeDeg(-1) == deg){
                        if(winmsg.errorid == "-100"){
                            alert_t('您的抽奖次数已经用完');
                        }
                        else if(winmsg.errorid == "-101"){
                            alert_t('您的当日抽奖次数已经用完');
                        }
                        else if(winmsg.errorid == "-104"){
                            alert_t('对不起，活动已经停止');
                        }
                        else if(winmsg.errorid == "-401"){
                            alert_t('对不起，活动已经结束');
                        }
                        else{
                            alert_t('对不起，网络连接错误，请重试');
                        }
                        Rotate.isRun = false;
                        return;
                    }
                }
                if(winmsg.iswin){//中奖
                    if(Rotate.getPrizeDeg(winmsg.prizeid) == deg){
                        setTimeout(function(){
                            Rotate.showPrompt();
                            Rotate.isRun = false;
                        }, 2000);
                        return;
                    }
                    if(Rotate.getPrizeDeg(-1) - deg < 160){
                        //Rotate.speed += 1;
                    }
                }
                if(winmsg.isthank){//鼓励奖
                    if(Rotate.getPrizeDeg(-1) == deg){
                        Rotate.isRun = false;
                        alert_t('对不起，您这次没有中奖');
                        return;
                    }
                }

                //继续选装
                setTimeout(ratateing, Rotate.speed);
            }
        };
        Rotate.showPrompt = function(){
            $('prizetype').innerHTML = Rotate.prizeList['i' + winmsg.prizeid];
            $('sncode').innerHTML = winmsg.sn;
            $('promptMsg').style.display = 'block';
            $('panelLottery').style.display = 'none';
        };
        //向服务器请求抽奖
        Rotate.getWinResult = function () {
            var config = {
                method: 'get',
                url: 'ajax.aspx?sn=4315b10729fff86725f1887daeaab482&wid=111521&acid=2758&m=lottery' + '&' + Math.random()
            };

            var request = new x.WebRequest(config);

            request.onSuccess = function (responseText, responseXML) {
                if (responseText.indexOf('ajax_msg:') != -1) {
                    eval("window.winmsg = " + responseText.replace('ajax_msg:', '') + ";");
                    Rotate.isStop = true;
                }
                else {
                    Rotate.isFaild = true;
                    Rotate.isStop = true;
                }
            };

            request.onFailure = function () {
                Rotate.isFaild = true;
                Rotate.isStop = true;
            };

            request.onException = function () {
                Rotate.isFaild = true;
                Rotate.isStop = true;
            };

            request.send(null);
        };

        Rotate.rotateY = function (id, _deg) {
            var element = $(id);debugger;
            element.style.MozTransform = 'rotateZ(' + _deg + 'deg)';
            element.style.WebkitTransform = 'rotateZ(' + _deg + 'deg)';
            element.style.OTransform = 'rotateZ(' + _deg + 'deg)';
            element.style.MsTransform = 'rotateZ(' + _deg + 'deg)';
            element.style.Transform = 'rotateZ(' + _deg + 'deg)';
        };

        $('inner').onclick = function(){
            if(Rotate.isRun){
                return;
            }
            Rotate.run();
        };

        function submitMobile() {
            var mobile = $('tel').value;
            if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(mobile))) {
                alert_t('请输入正确的手机号码');
                $("save-btn").disabled = false;
                return;
            }

            var config = {
                method: 'get',
                url: 'ajax.aspx?sn=4315b10729fff86725f1887daeaab482&wid=111521&acid=2758&m=addmobile' + '&winid=' + winmsg.winid + '&mobile=' + mobile + '&' + Math.random()
            };

            var request = new x.WebRequest(config);

            request.onSuccess = function (responseText, responseXML) {
                $('promptMsg').style.display = 'none';
                $('panelLottery').style.display = 'block';
                $("save-btn").disabled = false;
                alert_t('信息提交成功，我们的工作人员稍后会联系您，请牢记您的SN码');
                //Lottery.recover();
            };
            request.onFailure = function () { };
            request.onException = function () { };

            request.send(null);
        }
        function alert_t(msg){
            $('alertEleMsg').innerHTML = msg;
            $('alertEle').style.display='block';
        };
    