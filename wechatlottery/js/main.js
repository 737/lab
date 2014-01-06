var ws = ws || {};

ws.config = {
    webHost : {
        dev : 'http://192.168.222.177:31006/',
        staging : '',
        prod : ''
    },
    prizeCount : 8,
    webMode : 'dev',
};

ws.api = (function() {
    var self = {};

    var url = {
        dev : {
            result : 'defined/result.json',
            memberInfo : 'defined/memberInfo.json',
            prizes : 'defined/prizes.json'
        },
        staging : {
            result : 'defined/result.json',
            memberInfo : 'defined/memberInfo.json',
            prizes : 'defined/prizes.json'
        },
        prod : {
            result : 'defined/result.json',
            memberInfo : 'defined/memberInfo.json',
            prizes : 'defined/prizes.json'
        }
    };

    self.get= function(name){
        var urlMode = url[ws.config.webMode];

        if (!urlMode) urlMode = url['dev'];

        return ws.config.webHost[ws.config.webMode] + urlMode[name];
    };

    return self;
})();

ws.base = (function() {
    var self = {
        __json : null,
        $domName : 'Augmentumer',
        $domOPS : 0,
        $domDLHistory : null
    };

    function showInfo(tdata) {
        if (self.$domName.length > 0) {
            self.$domName.html(tdata.id + '&nbsp;&nbsp;' + tdata.en_name);
        }

        if (self.$domOPS.length > 0) {
            self.$domOPS.html(tdata.left_ops);
        }
    };
    self.init = function(){
        this.$domName = $('section[class="turn-user"] > strong');
        this.$domOPS = $('section[class="turn-times"]').find('span');
        this.$domDLHistory = $('section[class="turn-story"] > dl');

        this.syncMemberInfo();
    };
    self.syncMemberInfo = function() {
        var url = ws.api.get('memberInfo'),
            options = this.getAjaxParameters();

        sun.ajax.getJSON(url, options, function(json) {
            self.__json = json;
            showInfo(json.data);
            self.setHistory('init', json.data.lotteryHistory);
        })
    };
    self.getLeftops = function () {
        if (!!self.__json) {
            return self.__json.data.left_ops
        }

        return 0;
    };
    self.lostOneOPS = function() {
        if (!!self.__json) {
            self.__json.data.left_ops = self.__json.data.left_ops - 1;

            showInfo(self.__json.data);
        }

        return 0;
    };
    self.setHistory = function(sAction, sParams) {
        var __tmp = '<dd>·第{0}次：{1}&nbsp;[{2}]</dd>',
            __html = '',
            _formatTime = '';

        if(_.isEmpty(sAction)) {
            return false
        }
        if(sAction === 'init') {
            this.$domDLHistory.children('dd').remove();

            
            _.each(sParams, function(v, i) {
                _formatTime = sun.util.formatTime('MM/dd hh:mm', v.create_time);
                __html += sun.util.stringFormat(__tmp, i + 1, v.name, _formatTime);
            })
        }
        if (sAction === 'insert') {
            var __total = this.$domDLHistory.children('dd').length;
            
            _formatTime = sun.util.formatTime('MM/dd hh:mm', sParams.create_time);
            __html = sun.util.stringFormat(__tmp, __total + 1 , sParams.name, _formatTime);
        }

        this.$domDLHistory.append(__html);
    };
    self.getAjaxParameters = function() {
        var _eid = sun.context.getQueryStringByName('eid');

        return  { eid : _eid };
    };

    return self;
})();

ws.turnLottery = (function() {
    var self = {
        __json : null,
        __prizeList : [],
        $btnLottery : null,
        hmr_btnLottery : null,
        $bgLotteryDesk : null,
        $domPrizeName : null
    };

    function loadPrizesList(){
        var url = ws.api.get('prizes'),
            options = ws.base.getAjaxParameters();

        sun.ajax.getJSON(url, options, function(json) {
            self.__prizeList = json.data;
        })
    };
    function bindTurnBtn() {
        self.hmr_btnLottery = Hammer(self.$btnLottery[0]);
        if (!!self.hmr_btnLottery) {
            self.hmr_btnLottery.on("tap", clickTurnBtn);
        }
    };
    function unbindTurnBtn() {
        if (!!self.hmr_btnLottery) {
            self.hmr_btnLottery.off("tap", clickTurnBtn);
        }
    };
    function clickTurnBtn() {
        var options = ws.base.getAjaxParameters();

        if (ws.base.getLeftops() < 1) {
            alert('亲，您的抽奖机会已经用完了。');
            return false;
        }
        
        // clear the prize result
        showResult('疯狂旋转ing...');

        unbindTurnBtn(); //点击完后马上解绑，不能再次点击

        var url = ws.api.get('result');
        
        sun.ajax.post(url, options, function(json) {
            try {
                if (json['code'] === 200) {
                    self.__json = json;
                    ws.base.lostOneOPS();
                    fnRotate(showResult);
                } else {
                    self.__json = null;
                    showResult('活动已结束');
                    alert('亲，您来晚了，奖品已经抽完啦！');
                }
            } catch(err) {
                showResult('活动已结束');
                alert('亲，您来晚了，奖品已经抽完啦！');
            }
        });
    };
    function fnRotate(fnCallback) {
        var stopAngel = 2160;

        // parse the angel degree
        if ((self.__prizeList.length > 0)&&(!!self.__json)) {
            var indexNum = 0;

            _.each(self.__prizeList, function(v, i) {
                if (v.id === self.__json.data.id) {
                    indexNum = i;
                    return; 
                }
            });

            stopAngel += 360 / ws.config.prizeCount * indexNum;
        }

        self.$bgLotteryDesk.css({ rotate: '0deg' });
        self.$bgLotteryDesk.transition({ rotate: stopAngel + 'deg' }, 8000, 'out', function() {
            bindTurnBtn();
            if(_.isFunction(fnCallback)) {
                fnCallback(self.__json.data.name);
            }
            ws.base.setHistory('insert', self.__json.data);
        });
    };
    function showResult(sTxt) {
        if (self.$domPrizeName.length < 1) {
            return false;
        }
        if (!_.isEmpty(sTxt)) {
            self.$domPrizeName.html(sTxt);
            self.$domPrizeName.parent().textfill({
                minFontPixels : 4,
                maxFontPixels : 25
            });
        } else {
            self.$domPrizeName.html('');
        }
    };
    self.init = function() {
        this.$btnLottery = $("#turn-pointer");
        this.$bgLotteryDesk = $('#turn-desk');
        this.$domPrizeName = $('section[class="turn-result"] > div > span');

        bindTurnBtn();
        showResult('');
        loadPrizesList();
    };

    return self;
})();
