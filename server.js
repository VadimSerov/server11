const io = require('socket.io');
const http=require('http');
const fs = require('fs');
const server=http.createServer();
const ios = io.listen(server);

var port = 80;
var host = 'localhost';

const defs = {
	css : 'body{'+
	'margin:0;'+
	'padding:0;'+
	'text-align:center;} '+
	'h1{'+
	'background-color:#43853d;'+
	'color:white;'+
	'padding: .5em;'+
	'font-family:"Consolas";}',

 	htm:'<!DOCTYPE html>'+
	'<html>'+
	'<head>'+
	'<meta charset="UTF-8">'+
	'<title>Первый сервер</title>'+
	'<link rel="stylesheet" href="app.css">'+
	'</head>'+
	'<body>'+
	'<h1>Основы node js</h1>'+
	'<button id="but01">Нажать</button>'+
	'<script src="app.js"></script>'+
	'</body>'+
	'</html>',

	js:'const but01=document.getElementById("but01");'+
	'but01.onclick=function(){'+
	'alert("Жесть")}'
}

server.on('request',function(request,response){
	//console.log(request.url);
	if(request.url=='/'){
		response.writeHead(200,{'Content-Type':'text/html'});
		fs.readFile(__dirname+'/content/html/index.html',function(err0,data0){
			if(!isNaN(err0)){
				response.end(data0);
			} else {
				response.end(defs.htm);
			}
		});
	}
 	if(request.url=='/app.js'){
		response.writeHead(200,{'Content-Type':'text/javascript'});
		fs.readFile(__dirname+'/content/js/app.js',function(err1,data1){
			if(!isNaN(err1)){
				response.end(data1);
			}else{
				response.end(defs.js);
			}
		});
	}
	if(request.url=='/app.css'){
		response.writeHead(200,{'Content-Type':'text/css'});
		fs.readFile(__dirname+'/content/css/app.css',function(err2,data2){
			if(!isNaN(err2)){
				response.end( data2);
			} else {
				response.end(defs.css);
			}
		});
	}
});

server.listen(port,host,function(){ 
	console.log('Сервер работает. Слушает хост:',host,' ,  порт:',port)
});

//установить счётчик рассоединений
//n_disconnect=0;

ios.sockets.on('connection', function(socket) {

	socket.on('eventServer', function(data) {
		console.log(data);
		socket.emit('eventClient', { "data": 'Hello Client! You send: '+data });
	});
	socket.on("fnServer",function(data3){
		console.log("Filename: "+data3);
		try {
			var buf = fs.readFileSync(__dirname+'/files/'+data3,"utf8");
			err="";
		}catch{
			err = "No such file.";
			buf = "";
		}
		socket.emit("fnClient",{"err":err,"filename":data3,"data":buf});
	});
	socket.on("wrServer",function(data4){
		console.log("Write file "+data4.filename);
		try{
			fs.writeFileSync(__dirname+'/files/'+data4.filename,data4.data);
			err="";
		}catch{
			err = "Can't write file.";			
		}
		socket.emit("wrClient",{"err":err,"filename":data4.filename});
	});
	//задача file2 -- 1000 задач по программированию Часть II Абрамян М.Э. 2004 --
	socket.on("file2Server",function(data5){
		console.log("Write file "+data5.filename);
		try{
			var nex = 2
			var string5=String(nex);
			for(let i=1;i<data5.n;i++){
				nex += 2 ;
				string5 += " "+String(nex); 
			}
			fs.writeFileSync(__dirname+'/files/'+data5.filename,string5);
			err="";
		}catch{
			err = "Can't write file.";			
		}
		socket.emit("wrClient",{"err":err,"filename":data5.filename});
	});
	//задача file3 -- 1000 задач по программированию Часть II Абрамян М.Э. 2004 --
	socket.on("file3Server",function(data6){
		console.log("Write file "+data6.filename);
		try{
			var buf = [];
			var x=data6.a;
			for(let i=0;i<10;i++){
				buf.push(x);
				x += data6.b;
			}
			//преобразовать в JSON и записать в файл на сервере
			fs.writeFileSync(__dirname+'/files/'+data6.filename, JSON.stringify(buf));
			err="";
		}catch{
			err="Can't write file.";
		}
	});
	// что делать при разъединении с браузером 
	socket.on('disconnect', function() {
		//console.log('user disconnected',n_disconnect++);
	});
});
