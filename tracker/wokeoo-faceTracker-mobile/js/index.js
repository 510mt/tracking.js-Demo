    window.onload = function() {
    	var flag = true;
    	var clientH = window.screen.height/2;
    	var clientW = window.screen.width;

    	var video = document.getElementById('video');
    	var tips = document.getElementById("tips");

    	var canvas = document.getElementById('canvas');
    	var context = canvas.getContext('2d');

    	var reviewCanvas = document.getElementById('result');
    	var reviewContext = reviewCanvas.getContext('2d');
		
		var full = document.getElementById('full');
   		var fullContext = full.getContext('2d');

    	video.height = clientH;
    	video.width = clientW;

    	canvas.height = clientH;
    	canvas.width = clientW;
    	
    	full.height = clientH;
    	full.width = clientW;

    	reviewCanvas.height = clientH/2;
    	reviewCanvas.width = clientW/2;

    	var config = new function() {
    		this.width = 110;
    	}

    	var tracker = new tracking.ObjectTracker('face');
    	tracker.setInitialScale(1);
    	tracker.setStepSize(1);
    	tracker.setEdgesDensity(0.1);

    	tracking.track('#video', tracker, {
    		camera: true
    	});

    	tracker.on('track', function(event) {
    		context.clearRect(0, 0, canvas.width, canvas.height);
    		var rect = event.data[0];
    		if(flag) {
    			if(rect && rect.width > config.width) {
    				flag = false;
    				//绘制vedio到full的canvas
    				fullContext.drawImage(video, 0, 0, canvas.width, canvas.height);
    				context.strokeStyle = '#FFFF00';
    				context.strokeRect(rect.x, rect.y, rect.width, rect.height);
    				context.font = '11px Helvetica';
    				context.fillStyle = "#fff";
    				context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
    				context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
    				context.fillText('width: ' + rect.width + 'px', rect.x + rect.width + 5, rect.y + 33);
    				context.fillText('height: ' + rect.height + 'px', rect.x + rect.width + 5, rect.y + 44);
    				drawResult(rect);
    		}
    		}
    	});

    	function drawResult(rect) {
    		reviewContext.clearRect(0, 0, reviewCanvas.width, reviewCanvas.height)
    		var width = reviewCanvas.width;
    		var height =  reviewCanvas.height;
    		var left = rect.x-20;
         	var top =(rect.y - 20 > 0) ? (rect.y - 20) : 0;
    		reviewContext.fillStyle = "#ffffff";
    		reviewContext.fillRect(0, 0, reviewCanvas.width, reviewCanvas.height);
  			reviewContext.drawImage(video, 0,0, width, height/0.7);
			//reviewContext.drawImage(full, left, top, width/0.9,height/0.9, 0, 0, width, height);
    		//保存图片发送到后台校验
    		var base64 = reviewCanvas.toDataURL('image/jpeg');
    		sendToDetecte(base64);
    	}

    	function sendToDetecte(photo) {
    		//后台校验
    		console.log("后台检测中");
  			setTimeout(detecte, 0);
    	}

    	function detecte() {
    		//语音播报结果
    		setTimeout(function() {
    			flag = true;
    		}, 0);
    	}
    };