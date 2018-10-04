/*Date.prototype.timeIWant = function() {
	var yyyy = this.getFullYear().toString();
	var MM = (this.getMonth()+1).toString();
	var dd  = this.getDate().toString();
	
	var hr  = this.getMinutes().toString();
	var min  = this.getHours().toString();
	var sec  = this.getSeconds().toString();
	
	MM = MM[1] ? MM : "0" + MM;
	dd = dd[1] ? dd : "0" + dd;
	
	hr = hr[1] ? hr : "0" + hr;
	min = min[1] ? min : "0" + min;
	sec = sec[1] ? sec : "0" + sec;
	
	return yyyy + "-" + MM + "-" + dd + " " + hr + ":" + min + ":" + sec;
}*/

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;

}

function getToday() {

    var date = new Date();

    hour = "00";

    min = "00";

    sec = "00";

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;

}

//var ctx = $("#myChart")[0].getContext("2d");
$("#update").bind("click", updateChart);
var lastUpdate = getDateTime();

var randomScalingFactor = function(){ return Math.round(Math.random()*100)};
var barChartData = {
  labels: ["8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
  datasets : [
		{
		  fillColor : "rgba(220,220,220,0.5)",
		  strokeColor : "rgba(220,220,220,0.8)",
		  highlightFill: "rgba(220,220,220,0.75)",
		  highlightStroke: "rgba(220,220,220,1)",
		  data : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		}
  ]
}
 
var ctx = document.getElementById("canvas").getContext("2d");
var myLine = new Chart(ctx).Bar(barChartData, {responsive : true});
var weight = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

function updateData(){
  var opts = {animation: false};        
  for(var i=0;i<16;i++){
    barChartData.datasets[0].data.shift();
    barChartData.datasets[0].data.push(weight[i]);
  }
  myLine = new Chart(ctx).Bar(barChartData, {responsive : true});
}
	
function updateChart()
{
	alert("update");
	
	var currentTime = new Date();
  var tmp = 0;
  var diff = 0;
  
  //per minutes
  
	//var a = Base64.encode(getToday());
	var a = Base64.encode("2015-11-23 18:34:47");
	var b = Base64.encode(lastUpdate);
 
	alert(lastUpdate);
	
	var request_url = "request.php?a=" + a + "&b=" + b;
	
	/*if( __ == 0)
    alert("Warning!");*/
  
  $.get(request_url, function(data, status){
    var test = JSON.parse(data);
    
    for(var i=0;i<test.length;i++){
      if(test[i]['Weight']>tmp)
        diff = test[i]['Weight']-tmp;
      else
        diff = tmp-test[i]['Weight'];
      tmp = test[i]['Weight'];
      weight[currentTime.getHours()-8] = parseInt(weight[currentTime.getHours()-8])+parseInt(diff);
    }
   
		lastUpdate = getDateTime();
    
    var myInterval=setInterval('updateData',1000);
    clearInterval(myInterval);
    updateData();
    myInterval=setInterval('updateData',1000);
	});
}
