var mesExtId;
var hostname;
var pathPt;
var extPt;

chrome.storage.local.get(["host","path","ext","mesExtId"],function(items){
	if(items.host) hostname=items.host;
	if(items.path) pathPt=items.path;
	if(items.ext) extPt=items.ext;
	if(items.mesExtId) mesExtId=items.mesExtId;
})

var ctabUrl;
chrome.browserAction.onClicked.addListener(function(tab){
	ctabUrl=tab.url;
	startNetCheck(tab.id)
});

chrome.debugger.onDetach.addListener(function(tg,reason){
	alert("detach!")
})

var debugee;
function startNetCheck(id){
	debugee={tabId:id}
	chrome.debugger.getTargets(function(res){
		for(var k in res){
			if(res[k].url==ctabUrl){
				if(res[k].attached){
					chrome.debugger.sendCommand( debugee,"Network.enable")
				}else{
					chrome.debugger.attach(debugee, "1.2", function(){
						chrome.debugger.sendCommand( debugee,"Network.enable")
					});
				}
				break;
			}
		}
	})
}

var request={};
chrome.debugger.onEvent.addListener(function(src,method,params){
	if(debugee){
		switch(method){
		  case"Network.requestWillBeSent":
			var $a = $("<a />").attr("href",params.request.url);
			if($a[0].hostname==hostname){				
				var path=$a[0].pathname;			
				var tm=path.split("/");
				var filename=tm[tm.length-1];
				var ext=filename.split(".")[1];
				if(path.match(pathPt) && ext==extPt){
					chrome.browserAction.setIcon({"path":"32on.png"})
					request[params.requestId]={
						url:filename,
						post:params.request.postData
					};
				}
			}
			break;
		  case"Network.loadingFinished":
			if(request[params.requestId]){
				chrome.debugger.sendCommand(
					debugee,
					"Network.getResponseBody", 
					{requestId:params.requestId},
					fcb.bind(null,request[params.requestId])
				)
			}
			break;
		}
	}
})

var rs;
function fcb(req,res){
	if(mesExtId){
		chrome.runtime.sendMessage(mesExtId,{
			"request":req,
			"response":res
		})
	}
	delete req;
	chrome.browserAction.setIcon({"path":"32.png"})
}