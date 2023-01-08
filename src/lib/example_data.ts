import {SkillMap, CapstoneMap, StudentMap, Student, Capstone} from 'src/lib/model-interface'
var fs = require('fs')
var path = require('path')

function get_random_students(num_students: int, num_capstones: int): StudentMap{
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

	let sm: StudentMap = {};
	for (var s = 1; s <= num_students; s++){
		// TODO: Create a random name
		let ss:Student = {"name":`stud-${s}`, "preferences": student_preferences[s]}
		sm[s] = ss
	}


	return sm
}

function get_random_capstones(num_capstones: int): CapstoneMap {
	let cm: CapstoneMap = {};
	for(var c = 1; c <= num_capstones; c++){
		// TODO: Create a random capstone
		let cap:Capstone = {"name": `capstone-${c}`, "skills":[], "minStudents":3, "maxStudents":4}
		cm[c] = cap;
	}

	return cm

}


export function get_random_case(num_students: int, num_capstones: int){
	let students:StudentMap = get_random_students(num_students, num_capstones)
	let capstones:CapstoneMap = get_random_capstones(num_capstones)

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