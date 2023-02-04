const fs = require('fs');

let students = [];
let programs = [];

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

module.exports = {
  initialize,
  getAllStudents,
  getInternationalStudents,
  getPrograms
};
