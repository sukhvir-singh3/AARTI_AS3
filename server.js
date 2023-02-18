/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Aarti 
* Student ID: 154931216 
* Date: 17 FEB 
*
* Online (Cyclic) Link: 
*
********************************************************************************/ 


var express = require('express');
var path = require('path');
var dataService = require('./data-service.js');
const fs = require('fs');
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: 'dp0cdwjfg',
  api_key: '464917171124998',
  api_secret: 'CrLvMl5Hb2qtk4iPskc-pKVVFUU',
  secure: true
});

var app = express();
const upload = multer();

app.use(express.static('public'));

var HTTP_PORT = process.env.PORT || 8080;

var onHttpStart = function(){
    console.log("Express http server listening on", HTTP_PORT);
}

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get('/about', (req, res)=>{
    res.sendFile(path.join(__dirname, '/views/about.html'))
});

app.use(express.urlencoded({ extended: true }));

app.get('/students/add', (req, res)=>{
    res.sendFile(path.join(__dirname, '/views/addStudent.html'))
});

app.get('/images/add', (req, res)=>{
    res.sendFile(path.join(__dirname, '/views/addImage.html'))
});

app.post('/images/add',upload.single('imageFile'), (req,res)=>{
	 if(req.file){
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
    
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
    
        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }
    
        upload(req).then((uploaded)=>{
            processForm(uploaded.url);
        });
    }else{
        processForm("");
    }

    function processForm(imageUrl){
         dataService.addImage(imageUrl)
	    .then(() => {
     		 res.redirect("/images");
    		})
    		.catch((err) => {
    		  console.log(err);
     		 res.redirect("/images");
    		});
     }
});


app.get('/images', (req, res)=>{
	dataService.getImages()
		.then((images)=>{
			res.json({images: images});	
		})
		.catch((err)=>{
			res.status(500).json({error: err});
 		});
});

app.post('/students/add', (req, res)=>{
	dataService.addStudent(req.body)
		.then(()=>{
			res.redirect('/students');
		})	
    		.catch((error) => {
      		console.error(error);
     			 res.sendStatus(500);
    		});
});

app.get('/student/:id', (req, res) => {
	  const studentId = req.params.id;

  	dataService.getStudentById(studentId)
    		.then((student) => {
     			 if (student) {
      			  res.json(student);
     			 } else {
    			    res.status(404).json({ message: 'Student not found' });
     			 }
    		})
   		 .catch((err) => {
  	    res.status(500).json({ message: err });
    });
});

app.get('/students', (req, res) => {
	if(Object.keys(req.query).length === 0){
		dataService.getAllStudents()
			.then((studentsArr) => {
		  	  res.send(studentsArr);
			})
			.catch((err)=>{
				res.json({ message: err });
		 	 });
	}
	else{
		let status = req.query.status;	
		let program = req.query.program;	
		let credential = req.query.credential;	
		
		if(status){
			dataService.getStudentsByStatus(status)
				.then((studentsArr)=>{
					res.json(studentsArr);
				})
				.catch((err)=>{
					res.json({ message: err });
				});
		}
		else if(program){
			dataService.getStudentsByProgramCode(program)
				.then((studentsArr)=>{
					res.json(studentsArr);
				})
				.catch((err)=>{
					res.json({ message: err });
				});
		}
		else if(credential){
			dataService.getStudentsByExpectedCredential(credential)
				.then((studentsArr)=>{
					res.json(studentsArr);
				})
				.catch((err)=>{
					res.json({ message: err });
				});
		}
	}
});

app.get('/intlstudents', (req, res) => {
	dataService.getInternationalStudents().then((studentsArr) => {
		var student = studentsArr.map(function(elem, index){
			if(elem.isInternationalStudent == true){
				//return (index + 1) + '. ' + elem.firstName + '<br>';
				return elem;
			}
		});	
    res.send(student);
  }).catch((err)=>{res.json({ message: err });});
});

app.get('/programs', (req, res)=>{
		dataService.getPrograms().then((ProgramArr) => {
		res.send(ProgramArr);
	}).catch((err)=>{res.json({ message: err });});
});

app.use((req,res)=>{
	res.status(404).send('Page Not Found');
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
