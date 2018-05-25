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


// 时间戳转日期格式
function turnTime(str) {
  var date = new Date(str * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  Y = date.getFullYear() + '-';
  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
  h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
  m = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
  s = date.getSeconds();
  return Y+M+D+h+m;
}