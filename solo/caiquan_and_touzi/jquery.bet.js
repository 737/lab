var runDiceCount = 1;

(function( $, window, undefined ){ 
	var __FILE__ = $("script").last().attr("src");
	var _FILE_IMG_ = __FILE__.substring(0, (__FILE__.length - 13));

	var methods = {
		moraInit: function (settings) {
			settings = settings || {};
			var  _settings = $.extend({
				src	: "",
				style: "display:none",
				width: "30px",
				height: "30px",
				type: 'mora',
				driveData: driveMoraData(),
				
			}, settings);
			
			run.call(this, _settings);
		},
		
		diceInit: function (settings) {
			settings = settings || {};
			var  _settings = $.extend({
				src	: "",
				style: "display:none",
				width: "30px",
				height: "30px",
				type: 'dice',
				driveData: driveDiceData(),
				
			}, settings);

			run.call(this, _settings);
		}
	};
	
	var run = function (settings) {
			var $img = $("<img>", {
			  src: settings.src || "",
			  style: settings.style || "",
			  width: settings.width || "30px",
			  height: settings.height || "30px", 
			});
			
			$(this).append($img);
			
			if (settings.type === 'dice') {
				$img.css("-webkit-transition", "3s linear all");
			}
			
			driveWork.call($img, settings);
	};
		
	var driveWork = function (settings) {
			var _that = this;
			var _random = 0;
			var _maxAlternate = settings.driveData.length - 1;
			var startTime = new Date().getTime();
			
			_that.setIntervalId = setInterval(function() {
				_random = Math.round(Math.random() * (_maxAlternate - 1));
				$(_that).attr("src", settings.driveData[_random]);
				$(_that).show();
				
				if (settings.type === 'dice') {
					$(_that).css("-webkit-transform", "rotatez(" + 2520 * runDiceCount + "deg)");
				}
				
				if ((new Date().getTime()) - startTime > 3000) {
					clearInterval(_that.setIntervalId);
					
					if (typeof settings.callBack === 'function') {
						settings.callBack(_random + 1);
					}
					
					if (settings.type === 'dice') {
						runDiceCount++;
					}
				}
				
			}, 360);
	};
		
	var driveMoraData = function () {
			return ['img/f1.jpg', 'img/f2.jpg', 'img/f3.jpg'];
	};
		
	var	driveDiceData = function () {
			return ['img/t1.jpg', 'img/t2.jpg', 'img/t3.jpg', 'img/t4.jpg', 'img/t5.jpg', 'img/t6.jpg'];
	};
	
	$.fn.runMora = function(settings){
		return methods['moraInit'].call(this, settings);
	};

	$.fn.runDice = function (settings) {
		return methods.diceInit.call(this, settings);
	}
})( jQuery, window );