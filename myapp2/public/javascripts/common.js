
// 拿到导航
function getCategory() {
  $.ajax({
    type: 'GET',
    url: '/nav/getNav',
    success: function(data) {
      if (data.code == 0) {
        var newNav = '';
        for (var i = 0; i < data.data.length; i++) {
          newNav += '<a href="'+data.data[i].url+'"><span>'+data.data[i].name+'</span><span class="en">'+data.data[i].alias+'</span></a>';
        }

        $('#topnav').append(newNav)
      }
    }
  })
}

function getConfig() {
  $.ajax({
    type: 'GET',
    url: '/config/getConfig',
    success: function (data) {
      // console.log(data);
      for (var i = 0; i < data.data.length; i++) {
        if (data.data[i].title == "web_careful") {
          $("#well-known h2").html(data.data[i].name + '：');
          $("#well-known h5").html(data.data[i].con);
        }
        if (data.data[i].title == "web_ssnh") {
          $("#web_ssnh h2").html('| '+data.data[i].name+' |');
          $("#web_ssnh .region").html(data.data[i].con);
        }
        if (data.data[i].title == "web_xqqw") {
          $("#web_xqqw h2").html('| '+data.data[i].name+' |');
          $("#web_xqqw .region").html(data.data[i].con);
        }
        if (data.data[i].title == "web_dddd") {
          $("#web_dddd h3").html(data.data[i].name);
          $("#web_dddd p").html(data.data[i].con);
        }
        if (data.data[i].title == "web_dddd") {
          $("#web_dddd h3").html(data.data[i].name);
          $("#web_dddd p").html(data.data[i].con);
        }
        if (data.data[i].title == "web_copy") {
          $(".footer-title").html(data.data[i].con)
        }
      }
    }
  })
}

$(function () {
  getCategory()
  getConfig()
})