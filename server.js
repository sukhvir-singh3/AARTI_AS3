/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name:Sukhvir Singh 
* Student ID:155312218 
* Date: 1 FEB 
*
* Online (Cyclic) Link: https://happy-puce-seagull.cyclic.app/
*
********************************************************************************/ 


var express = require('express');
var path = require('path');
var dataService = require('./data-service.js');
const fs = require('fs');

var app = express();

app.use(express.static('public'));

var HTTP_PORT = process.env.PORT || 8080;

var onHttpStart = function(){
    console.log("Express http server listening on", HTTP_PORT);
}

//Main File
app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

//About File
app.get('/about', (req, res)=>{
    res.sendFile(path.join(__dirname, '/views/about.html'))
});

//Students File
app.get('/students', (req, res) => {
	dataService.getAllStudents()
		.then((studentsArr) => {
			//var studnet = studentsArr.map((elem, index) => (index + 1) + '. ' + elem.firstName + '<br>');
			//var namesWithoutCommas = studnet.join('');
		    	//res.send(`Student Names:<br>  ${namesWithoutCommas}`);
		    res.send(studentsArr);
		}).catch((err)=>{res.json({ message: err });});
});

//Intenational student File
app.get('/intlstudents', (req, res) => {
	dataService.getInternationalStudents().then((studentsArr) => {
		var student = studentsArr.map(function(elem, index){
			if(elem.isInternationalStudent == true){
				//return (index + 1) + '. ' + elem.firstName + '<br>';
				return elem;
			}
		});	
		//var namesWithoutCommas = student.join('');
    //res.send(`International Students:<br>  ${namesWithoutCommas}`);
    res.send(student);
  }).catch((err)=>{res.json({ message: err });});
});

//Programs File
app.get('/programs', (req, res)=>{
		dataService.getPrograms().then((ProgramArr) => {
			//var progrms = ProgramArr.map((elem, index) => (index + 1) + '. ' + elem.programName + '<br>');
			//var progrmsWithoutCommas = progrms.join('');
		//res.send(`Program Names:<br> ${progrmsWithoutCommas}`)
		res.send(ProgramArr);
	}).catch((err)=>{res.json({ message: err });});
});

app.use((req,res)=>{
	res.status(404),send('Page Not Found');
})
dataService.initialize()
	.then(() => {
		app.listen(HTTP_PORT, () => {
		console.log(`Server running on port: ${HTTP_PORT}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});
