var detecting=document.getElementById('detecting');
    window.onload = function() {
    	var flag =true;
  		var clientH = window.screen.height;  
			var clientW = window.screen.width;  
    	
      var video = document.getElementById('video');
      var tips=document.getElementById("tips");
      var detecting=document.getElementById("detecting");
      
      var canvas = document.getElementById('canvas');
      var context = canvas.getContext('2d');
      
      var reviewCanvas= document.getElementById('result');
			var reviewContext=reviewCanvas.getContext('2d');
			
			video.height=clientH/2;
			video.width=clientW/2;
			
			canvas.height=clientH/2;
			canvas.width=clientW/2;
			
			reviewCanvas.height=clientH/4;
			reviewCanvas.width=clientW/4;
			reviewCanvas.style.top=clientH/2+50+"px";
			tips.style.top=clientH/2+20+"px";
			
			detecting.style.width=window.innerWidth-50+"px"
			detecting.style.height=window.innerHeight-50+"px"
			
			var config = new function() {
		    this.width = 150;
		  }
			
      var tracker = new tracking.ObjectTracker('face');
      tracker.setInitialScale(1);
      tracker.setStepSize(2);
      tracker.setEdgesDensity(0.1);

      tracking.track('#video', tracker, { camera: true });

      tracker.on('track', function(event) {
      	context.clearRect(0, 0, canvas.width, canvas.height);
      	if(flag){
					if (event.data[0] && event.data[0].width > config.width) {
							detecting.style.opacity=1;
							flag=false;
		        	var rect = event.data[0];
		        	console.log(rect)
		          context.strokeStyle = '#FFFF00';
		          context.strokeRect(rect.x, rect.y, rect.width, rect.height);
		          context.font = '11px Helvetica';
		          context.fillStyle = "#fff";
		          context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
		          context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
		          context.fillText('width: ' + rect.width + 'px', rect.x + rect.width + 5, rect.y + 33);
	       			context.fillText('height: ' + rect.height + 'px', rect.x + rect.width + 5, rect.y + 44);
		        	drawResult(reviewContext);
	       }
				}
      });

      var gui = new dat.GUI();
      gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
      gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
      gui.add(tracker, 'stepSize', 1, 5).step(0.1);
      gui.add(config, 'width', 150, 300);
      
     function drawResult(reviewContext){
    	reviewContext.clearRect(0, 0, reviewCanvas.width, reviewCanvas.height)
			var width=video.width/2-40;
			var height=video.height/2;
			var left=20;
			var top=0;
			reviewContext.fillStyle="#ffffff";
    	reviewContext.fillRect(0,0,reviewCanvas.width,reviewCanvas.height);
			reviewContext.drawImage(video,left,top,width,height);
			//保存图片发送到后台校验
			var base64 = reviewCanvas.toDataURL('image/jpeg');
			sendToDetecte(base64);
    }
		
		function sendToDetecte(photo){
				//后台校验
				console.log("后台检测中");
				setTimeout(detecte,1000);
		}
		
		function detecte(){
			detecting.style.opacity=0;
			//语音播报结果
			doTTS("早上好，小猪佩奇");
			
			setTimeout(function(){
				flag=true;
			},2000);
		}
		
		function doTTS(text){
			var ttsDiv = document.getElementById('bdtts_div_id');
			var au1 = '<audio id="tts_autio_id" autoplay="autoplay">';
			var sss = '<source id="tts_source_id" src="http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=6&per=1&text='+text+'" type="audio/mpeg">';
			var eee = '<embed id="tts_embed_id" height="0" width="0" src="">';
			var au2 = '</audio>';
			ttsDiv.innerHTML = au1 + sss + eee + au2;
			ttsAudio = document.getElementById('tts_autio_id');
			ttsAudio.play();
		}
		
    };