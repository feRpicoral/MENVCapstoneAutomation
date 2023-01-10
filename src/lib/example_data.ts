import {SkillMap, CapstoneMap, StudentMap, Student, Capstone} from 'src/lib/model-interface'
var fs = require('fs')
var path = require('path')

function get_random_students(num_students: int, num_capstones: int, skills: SkillMap): StudentMap{
	var student_preferences = {};
	for (var s = 1; s <= num_students; s++){
		student_preferences[s] = {}
		var pref_capstones = []
		var possible_capstones = Array(num_capstones).fill(1).map((x, y) => x + y)
		for(var pref = 1; pref <=5; pref ++){
			// pref'th preference capstone
			var index = Math.floor(Math.random() * (possible_capstones.length));
			var capstone = possible_capstones.splice(index, 1)[0];

			student_preferences[s][capstone] = pref
		}
	}
	
	var all_skills = Object.keys(skills)

	let sm: StudentMap = {};
	for (var s = 1; s <= num_students; s++){
		var num_skills = Math.floor(Math.random() * all_skills.length);
		var sk = [];
		for (var i = 0;i< num_skills;i++)
			sk.push(all_skills[i])

		// TODO: Create a random name
		let ss:Student = {"name":`stud-${s}`, "preferences": student_preferences[s], "skills":sk}
		sm[s] = ss
	}


	return sm
}

function get_random_capstones(num_capstones: int, skills: SkillMap): CapstoneMap {
	let cm: CapstoneMap = {};
	var all_skills = Object.keys(skills)
	for(var c = 1; c <= num_capstones; c++){
		// TODO: Create a random capstone
		var num_skills = Math.floor(Math.random() * all_skills.length);
		var sk = [];
		for (var i = 0;i< num_skills;i++)
			sk.push(all_skills[i])
		let cap:Capstone = {"name": `capstone-${c}`, "skills":sk, "minStudents":3, "maxStudents":4}
		cm[c] = cap;
	}

	return cm

}

function get_random_skills(num_skills: int): SkillMap {
	let sm:SkillMap = {};
	for(var sk = 1; sk<= num_skills;sk++){
		sm[sk] = `skill-${sk}`
	}
	return sm
}


export function get_random_case(num_students: int, num_capstones: int, num_skills:int = 0){
	let skills:SkillMap = get_random_skills(num_skills)
	let students:StudentMap = get_random_students(num_students, num_capstones, skills)
	let capstones:CapstoneMap = get_random_capstones(num_capstones, skills)

	return {"students":students, "capstones": capstones}
}



export async function test_example1(){
	var content = fs.readFileSync("data/examples/example-capstone-mapping.json", {encoding: 'utf-8'})
	var capstones = JSON.parse(content)
	var students = fs.readFileSync("data/examples/example-student-mapping.json", {encoding: 'utf-8'})
	students = JSON.parse(students)
	console.log("Printing students")
	console.log(students)
	return {"students":students, "capstones": capstones}
}


export async function test_solver_2022(){
	var content = fs.readFileSync("data/examples/2022-capstone-mapping.json", {encoding: 'utf-8'})
	var capstones = JSON.parse(content)
	var students = fs.readFileSync("data/examples/2022-student-mapping.json", {encoding: 'utf-8'})
	students = JSON.parse(students)
	console.log("Printing students")
	console.log(students)
	return {"students":students, "capstones": capstones}

}