var setData={};
var ss
$(function(){
	chrome.storage.local.get(["setData"],function(items){
		if(items.setData) setData=JSON.parse(items.setData)
		setSetData();
	})
	$(document).on('change',"#patterns",function(){
		dspSetData();
	})
	function setSetData(){
		$("#patterns").empty();
		$("#patName").val("");
		$("#host").val("");
		$("#path").val("");
		$("#ext").val("");
		$("#mesExtId").val("");
		for(var key in setData)$("#patterns").append($("<option>"+key+"</option>"))
		dspSetData();
	}
	function dspSetData(){
		var ckey=$("#patterns option:selected").val();
		if(ckey){
			$("#patName").val(ckey);
			$("#host").val(setData[ckey].host);
			$("#path").val(setData[ckey].path);
			$("#ext").val(setData[ckey].ext);
			$("#mesExtId").val(setData[ckey].mesExtId);
		}
	}
	$(document).on("click","#set",function(){
		setData[$("#patName").val()]=
		{
			"host":$("#host").val(),
			"path":$("#path").val(),
			"ext":$("#ext").val(),	
			"mesExtId":$("#mesExtId").val(),	
		}
		chrome.storage.local.set({"setData":JSON.stringify(setData)});
		setSetData();
	})
	$(document).on("click","#del",function(){
		var ckey=$("#patterns option:selected").val();
		delete setData[ckey];
		setSetData();
	})
	$(document).on("click","#cl",function(){
		setData={};
		chrome.storage.local.remove("setData");
		setSetData();
	})
})