const fs = require('fs');
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const upload = multer();

let students = [];
let programs = [];
let images   = [];

function initialize(){
	return new Promise((resolve, reject) => {
		try{
			fs.readFile('./data/students.json', 'utf-8', (err, data) => {
				if (err) 
					throw new Error(err.message);

				students = JSON.parse(data);	
			});

			fs.readFile('./data/programs.json', 'utf-8', (err, data) => {
				if (err) 
					throw new Error(err.message);

				programs = JSON.parse(data);	
			});
		resolve();

		}catch(error){
			reject(error);
		}
	});
}

//initialize();
function getAllStudents() {
  return new Promise((resolve, reject) => {
    if (students.length === 0) return reject("no results returned");
    resolve(students);
  });
}

function getInternationalStudents() {
  return new Promise((resolve, reject) => {
    const internationalStudents = students.filter(student => student.isInternationalStudent);
    if (internationalStudents.length === 0) return reject("no results returned");
    resolve(internationalStudents);
  });
}

function getPrograms() {
  return new Promise((resolve, reject) => {
    if (programs.length === 0) return reject("no results returned");
    resolve(programs);
  });
}

function addImage(imageUrl){
	return new Promise((resolve, reject)=>{
		cloudinary.uploader.upload(imageUrl, { folder: "web_as3" }, (error, result)=>{
			if(error){
				console.log(error);
				reject(error);
			}
			else{
				console.log(result);
				images.push(imageUrl);	
				//resolve(result.secure_url);
				resolve(imageUrl);
		
			}
		});
	});
}

function getImages(){
	return new Promise((resolve, reject)=>{
 cloudinary.api.resources({ type: 'upload', prefix: 'web_as3/' }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        const images = result.resources.map((resource) => {
          return {
            public_id: resource.public_id,
            url: cloudinary.url(resource.public_id)
          };
        });
        resolve(images);
      }
    });
/*
		if(images.length == 0)
			reject('no results returned');		
		else{
			resolve(images);
		}
*/
	});
}

function addStudent(studentData){
	return new Promise((resolve, reject)=>{
		if(studentData.isInternationalStudent === undefined)				
			studentData.isInternationalStudent = false;
		else
			studentData.isInternationalStudent = true;
		var largest = 0;
		students.forEach((student)=>{
			if(largest > parseInt(student.studentID))	
				largest = parseInt(student.studentID);
		});
		largest++;
		studentData.studentID = largest.toString();
		students.push(studentData);
		resolve(studentData);
	});
}

function getStudentsByStatus(status){
	return new Promise((resolve, reject)=>{
		const matchedStudents = students.filter(student => student.status === status);
		if(matchedStudents.length === 0)
			reject('no result found');
		else
			resolve(matchedStudents);
	});
}

function getStudentsByProgramCode(programCode){
	return new Promise((resolve, reject)=>{
		const matchedStudents = students.filter(student => student.program === programCode);
		if(matchedStudents.length === 0)
			reject('no result found');
		else
			resolve(matchedStudents);
	});
}

function getStudentsByExpectedCredential(credential){
	return new Promise((resolve, reject)=>{
		const matchedStudents = students.filter(student => student.expectedCredential === credential);
		if(matchedStudents.length === 0)
			reject('no result found');
		else
			resolve(matchedStudents);
	});
}

function getStudentById(sid){
	return new Promise((resolve, reject)=>{
		const matchedStudents = students.filter(student => student.studentID === sid);
		if(matchedStudents.length === 0)
			reject('no result found');
		else
			resolve(matchedStudents[0]);
	});
}

module.exports = {
  initialize,
  getAllStudents,
  getInternationalStudents,
  getPrograms,
  addImage,
  getImages,
  addStudent,
  getStudentsByStatus,
  getStudentsByProgramCode,
  getStudentsByExpectedCredential,
  getStudentById
};
