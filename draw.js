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

function getMinute() {

    var date = new Date();
    
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    sec = "00";

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;

}

var second = 0;
var lastUpdate = getDateTime();
var interval = 0;
var lastMinute = getMinute();
var drink = 0;
var tmp = 0;

var randomScalingFactor = function(){ return Math.round(Math.random()*100)};
var barChartDataW = {
  labels: ["0", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"],
  datasets : [
		{
		  fillColor : "rgba(255,0,0,0.5)",
		  strokeColor : "rgba(255,0,0,0.8)",
		  highlightFill: "rgba(220,220,220,0.75)",
		  highlightStroke: "rgba(220,220,220,1)",
		  data : [0,0,0,0,0,0,0,0,0,0,0,0]
		}
  ]
}

var lineChartDataT = {
  labels: ["0", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"],
  datasets : [
		{ 
      fillColor : "rgba(220,220,220,0.2)",
		  strokeColor : "rgba(255,0,0,1)",
		  pointColor : "rgba(255,0,0,1)",
		  pointStrokeColor : "#fff",
		  pointHighlightFill : "#fff",
		  pointHighlightStroke : "rgba(220,220,220,1)",
		  data : [0,0,0,0,0,0,0,0,0,0,0,0]
		}
  ]
}

var lineChartDataH = {
  labels: ["0", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"],
  datasets : [
		{ 
      fillColor : "rgba(220,220,220,0.2)",
		  strokeColor : "rgba(255,0,0,1)",
		  pointColor : "rgba(255,0,0,1)",
		  pointStrokeColor : "#fff",
		  pointHighlightFill : "#fff",
	  	pointHighlightStroke : "rgba(220,220,220,1)",
		  data : [0,0,0,0,0,0,0,0,0,0,0,0]
		}
  ]
}
 
var ctxW = document.getElementById("canvasW").getContext("2d");
var ctxT = document.getElementById("canvasT").getContext("2d");
var ctxH = document.getElementById("canvasH").getContext("2d");
var myLineW = new Chart(ctxW).Bar(barChartDataW, {responsive : true});
var myLineT = new Chart(ctxT).Line(lineChartDataT, {responsive : true});
var myLineH = new Chart(ctxH).Line(lineChartDataH, {responsive : true});
var weight = [0,0,0,0,0,0,0,0,0,0,0,0]
var temperature = [0,0,0,0,0,0,0,0,0,0,0,0]
var humidity = [0,0,0,0,0,0,0,0,0,0,0,0,0]

function updateChart()
{
  $.ajax({
	  success:function(){
	
	    var currentTime = getDateTime();
      var diff = 0;
      
	    var a = Base64.encode(lastUpdate);
	    var b = Base64.encode(currentTime);
         
     	var request_url = "request.php?a=" + a + "&b=" + b;
	
      $.get(request_url, function(data, status){
        var info = JSON.parse(data);
        for(var i=0;i<info.length;i++){
          second = info[i]['Time'].split(":")[2];
          if(info[i]['Weight']<tmp){
            weight[parseInt(second/5)] = tmp-info[i]['Weight'];
            tmp = info[i]['Weight'];
            break;
          }
          else
            weight[parseInt(second/5)] = 0;
          temperature[parseInt(second/5)] = info[i]['Temperature'];
          humidity[parseInt(second/5)] = info[i]['Humidity'];
          tmp = info[i]['Weight'];
          diff = 0;
        }
          if(weight[parseInt(second/5)]!=0)
            drink = 0;
          else
            drink = drink+1;
          var opts = {animation: false};
        
          barChartDataW.labels.shift();
          if(second<5)
            barChartDataW.labels.push(55);
          else
            barChartDataW.labels.push(parseInt(second/5)*5-5);
    
          lineChartDataT.labels.shift();
          if(second<5)
            lineChartDataT.labels.push(55);
          else
            lineChartDataT.labels.push(parseInt(second/5)*5-5);
    
          lineChartDataH.labels.shift();
          if(second<5)
            lineChartDataH.labels.push(55);
          else
            lineChartDataH.labels.push(parseInt(second/5)*5-5);
    
          barChartDataW.datasets[0].data.shift();
          barChartDataW.datasets[0].data.push(weight[parseInt(second/5)]);
          lineChartDataT.datasets[0].data.shift();
          lineChartDataT.datasets[0].data.push(temperature[parseInt(second/5)]);
          lineChartDataH.datasets[0].data.shift();
          lineChartDataH.datasets[0].data.push(humidity[parseInt(second/5)]);   
  
          myLineW = new Chart(ctxW).Bar(barChartDataW, {responsive : true});
          myLineT = new Chart(ctxT).Line(lineChartDataT, {responsive : true});
          myLineH = new Chart(ctxH).Line(lineChartDataH, {responsive : true}); 
        
        if(drink>11)
            alert("Need to drink!");
        
        if(temperature[parseInt(second/5)]>26.7){
          var F=temperature[parseInt(second/5)]*9/5+32;
          var R=humidity[parseInt(second/5)];
          var H=2.05*F+10.14*R-42.379-0.22*F*R-0.007*F*F-0.05*R*R+0.001*F*F*R+0.0009*F*R*R-0.000002*F*F*R*R;
          if(H>90)
            alert("Need to care of heat");
        }
        lastUpdate = currentTime;
    	});
    }
	});
}

function start(){
    setTimeout( function(){
        updateChart();
        interval = 5;
        setInterval( function(){
            updateChart();
        }, interval * 1000);
    }, interval * 1000);    
}


$(window).load(function(){
    var date = new Date()
    interval = 5 - date.getSeconds()%5;
    if(interval == 5)
        interval = 0;
    start();
});