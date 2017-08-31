$(function(){
	chrome.storage.local.get(["host","path","ext","mesExtId"],function(items){
		console.log(items)
		if(items.host) $("#host").val(items.host);
		if(items.path) $("#path").val(items.path);
		if(items.ext) $("#ext").val(items.ext);
		if(items.mesExtId) $("#mesExtId").val(items.mesExtId);
	})
	$(document).on("click","button",function(){
		chrome.storage.local.set({
			"host":$("#host").val(),
			"path":$("#path").val(),
			"ext":$("#ext").val(),	
			"mesExtId":$("#mesExtId").val(),	
		})
	})
})