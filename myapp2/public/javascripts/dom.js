function GetString(name){
	
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null)return  unescape(r[2]); return null;
    
}

function getTime(){
	var date = new Date();
	//存储各种时间格式，方便以后扩展
  var time = {
    date: date.getTime(),
    year : date.getFullYear(),
    month : date.getFullYear() + "-" + (date.getMonth() + 1),
    day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
  }

  return time
}
