//connect to websocket
socket = io.connect("http://localhost:8000", {query: "name="+ $("#name").val()});
keyinputs = [false, false];
var canvas = document.getElementById("canvas");
var graphics = canvas.getContext("2d");
var width = $("#canvas").width();
var height = $("#canvas").height();
var splasscreen =   new Image();
splasscreen.src="img/Splasscreen.png"

var status = "Startup";

var lobby;

//splasscreen
$("#canvas").ready(function(){
	graphics.drawImage(splasscreen,0,0,width ,height);
	setTimeout(function(){
		status  = "Browser";
		graphics.beginPath();		
		graphics.fillStyle = "#FFFFFF";
		graphics.fillRect(0,0, width,height);
		socket.emit("serverListRefresh", []);
	}, 2000); 
});

//draw game if lobby is set
setInterval(function() {
	if(status == "Browser"){
	
	}
	
	if(status == "Ingame"){
		if( lobby === undefined){
			return;
		}
		graphics.beginPath();		
		graphics.fillStyle = "#FFFFFF";
		graphics.fillRect(0,0, width,height);
		var center= new point(width/2,height/2);
		var radius = 280;
		var points = [];
		var count= lobby.currentlyplaying;
		if(count < 4)
			count = 4;
		for(var i = 0 ; i < count;i++){
			var angle = Math.PI * 2 / count * i + (1/4 *Math.PI) ;
			var x =Math.cos(angle) *radius + center.x;
			var y =Math.sin(angle) *radius + center.y;
			points.push(new point(x,y));
		}
		for(var i = 1 ; i < points.length;i++){
			graphics.moveTo(points[i-1].x,points[i-1].y);
			graphics.lineTo(points[i].x,points[i].y);
			graphics.stroke();
		}
		graphics.moveTo(points[0].x,points[0].y);
		graphics.lineTo(points[points.length-1].x,points[points.length-1].y);
		graphics.stroke();
		for(var i = 0 ; i < lobby.users.length;i++){
			var angle = Math.PI * 1/2 * i + (1/4 *Math.PI);
			var barlength = ( Math.sin((2 *Math.PI / count)/2)*radius*2) ;
			var x = 0;
			var y = 0;
			if(i % 2){
				x = Math.cos(angle) *radius + center.x + (Math.sin(45*Math.PI/180 + angle -  (1/2 *Math.PI)	) *barlength / 100 * lobby.users[i].location);
				y = Math.sin(angle) *radius + center.y + (Math.cos(45*Math.PI/180 + angle -  (1/2 *Math.PI)) *barlength / 100 * lobby.users[i].location);
			} else{
				x = Math.cos(angle) *radius + center.x - (Math.sin(45*Math.PI/180 + angle -  (1/2 *Math.PI)) *barlength / 100 * lobby.users[i].location);
				y = Math.sin(angle) *radius + center.y - (Math.cos(45*Math.PI/180 + angle -  (1/2 *Math.PI)) *barlength / 100 * lobby.users[i].location);
			}
			graphics.beginPath();		
			graphics.translate( x, y );
			graphics.rotate(angle+  (1	/4 *Math.PI));
			graphics.rect(-100/2,-10/2, 100,10);	
			graphics.fillStyle = "#FF0000";
			graphics.fill();
			graphics.setTransform(1, 0, 0, 1, 0, 0);
		}
	}
}, 1000/30);

socket.on("gameupdate", function (data) {
	lobby = data;
});
socket.on("lobbies", function (data) {
	lobbies = data;
});

//name change
$("#name").change(function(){
	console.log("changing name");
	socket.emit("namechange", $("#name").val());
});

//input

//listeners
window.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 37: // Left
      keyinputs[0] = true;
    break;
    case 39: // Right
      keyinputs[1] = true;
    break;
  }
}, false);


window.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
   case 37: // Left
      keyinputs[0] = false;
    break;
    case 39: // Right
      keyinputs[1] = false;
    break;
  }
}, false);

setInterval(function (){
	socket.emit("updateKeys", keyinputs);
} , 1000/20);

function point(x,y){
	this.x = x;
	this.y = y; 
}