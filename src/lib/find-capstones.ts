import {SkillMap, CapstoneMap, StudentMap, Student, Capstone} from 'src/lib/model-interface'

var fs = require('fs')
var path = require('path')
var solver = require("javascript-lp-solver/src/solver")

export async function test(){
	return {"my":"data"}
}

function getCost(preference_number: int): int{
	if (preference_number == 1){
		return 1;
	}
	else if(preference_number == 2){
		return 10;
	}
	else if(preference_number == 3){
		return 20;
	}
	else if(preference_number == 4){
		return 50;
	}
	else if(preference_number == 5){
		return 100;
	}
	else{
		return 100000000000
	}
}

// Alex cost function
// function getCost(preference_number){
// 	if (preference_number == 1){
// 		return 1;
// 	}
// 	else if(preference_number == 2){
// 		return 2;
// 	}
// 	else if(preference_number == 3){
// 		return 3;
// 	}
// 	else if(preference_number == 4){
// 		return 4;
// 	}
// 	else if(preference_number == 5){
// 		return 5;
// 	}
// 	else{
// 		return 100
// 	}
// }


export function init_model(students: StudentMap, capstones: CapstoneMap, allowDrop: boolean = true){
	var model = {};
	model["optimize"] = "cost";
	model["opType"] = "min";
	model["constraints"] = {};
	model["ints"] = {};
	model["variables"] = {};


	// if(capstone_sizes === undefined){
	// 	capstone_sizes = {}
	// 	for(var c = 1;c <= num_capstones; c++){
	// 		capstone_sizes[c] = [3,4]
	// 	}
	// }

	for (const [s, stu] of Object.entries(students)) {
		// student must be assigned to exactly one capstone.
		model["constraints"][`student-${s}`] = {"min":1, "max": 1};
	}

	for (const [c, cap] of Object.entries(capstones)){
		// constraint: capstone should have 3-4 students. Between min and max
		model["constraints"][`capstone-${c}`] = {"min":cap.minStudents, "max":cap.maxStudents};

		if(allowDrop){
			// This binary variable decides if a capstone will be dropped(1) or not(0).
			model["variables"][`capstone-${c}-dropped`] = {}
			model["variables"][`capstone-${c}-dropped`][`capstone-${c}`] = cap.maxStudents
			model["constraints"][`capstone-${c}-dropped`] = {"min":0, "max":1};

			// dropping variable is an integer.
			model["ints"][`capstone-${c}-dropped`] = 1;
		}


	}

	// set constraints
	for (const [s, stu] of Object.entries(students)) {
		for (const [c, cap] of Object.entries(capstones)){
			// Set constraint: A student-capstone matching can be 0 or 1.
			model["constraints"][`student-${s}-capstone-${c}`] = {"min":0, "max":1};

			// Make all the variables integers
			model["ints"][`student-${s}-capstone-${c}`] = 1;
		}
	}

	return model
}

export function set_model_variables(model, students: StudentMap, capstones: CapstoneMap){
	var student_ids = Object.keys(students)
	var capstone_ids = Object.keys(capstones)

	for (const [s, stu] of Object.entries(students)) {
		for (const [c, cap] of Object.entries(capstones)){
			model["variables"][`student-${s}-capstone-${c}`] = {}
			model["variables"][`student-${s}-capstone-${c}`]["cost"] = getCost(stu.preferences[c])


			// TODO: Incorporate the skills into the model.
			// Dissallow some student-capstone assigments based on skills.
			// student_ids.forEach(key => model["variables"][`student-${s}-capstone-${c}`][`student-${key}`] = 0);
			model["variables"][`student-${s}-capstone-${c}`][`student-${s}`] = 1
			// capstone_ids.forEach(key => model["variables"][`student-${s}-capstone-${c}`][`capstone-${key}`] = 0);
			model["variables"][`student-${s}-capstone-${c}`][`capstone-${c}`] = 1

		}
	}

	return model


}




function model_from_preferences(student_preferences, num_students, num_capstones){

	// var num_students = Object.keys(student_preferences).length

	var model = init_model(num_students, num_capstones)

	model = set_model_variables(model, student_preferences, num_students, num_capstones)

	return model

}




export function find_distribution(results, students: StudentMap){


	var result_pref = {"pref-1":0, "pref-2":0, "pref-3":0, "pref-4":0, "pref-5":0, "non-pref":0}
	for (const [key, value] of Object.entries(results)) {
	  // console.log(`${key}: ${value}`);
	  if (["feasible","result","bounded","isIntegral"].indexOf(key) == -1){
	  	if(key.indexOf("dropped") == -1){
		  	var s = key.split("student-")[1].split("-")[0];
		  	var c = key.split("capstone-")[1];
		  	var preference = students[s].preferences[c];
		  	if (preference == undefined){
		  		result_pref["non-pref"] +=1;
		  	}
		  	else{
		  		result_pref[`pref-${preference}`]+=1;
		  	}
	  	}

	  }


	}

	return result_pref

}








export async function test_example2(){
	var content = fs.readFileSync("data/examples/example2-preferences.json", {encoding: 'utf-8'})
	var data = JSON.parse(content)
	var student_preferences = data["student_preferences"]
	var num_students = data["num_students"]
	var num_capstones = data["num_capstones"]


	var content2 = fs.readFileSync("data/examples/example2-capstone-sizes.json", {encoding: 'utf-8'})
	var capstone_sizes = JSON.parse(content2)

	var model = init_model(num_students, num_capstones, capstone_sizes)
	model = set_model_variables(model, student_preferences, num_students, num_capstones)

	fs.writeFileSync("data/examples/example2-model.json", JSON.stringify(model),  {encoding: 'utf-8'})
	var results = await solver.Solve(model);
	var result_pref = find_distribution(results, student_preferences)

	console.log(results);
	console.log(result_pref);

	return JSON.stringify(results);

}

export async function test_solver_2022(){
	var content = fs.readFileSync("public/model-2022.json", {encoding: 'utf-8'})
	var data = JSON.parse(content)
	var model = data["model"]
	var num_students = data["num_students"]
	var num_capstones = data["num_capstones"]


	var content2 = fs.readFileSync("public/2022-preferences.json", {encoding: 'utf-8'})
	var data2 = JSON.parse(content2)
	var student_preferences = data2["student_preferences"]
	// var model = model_from_preferences(student_preferences, num_students, num_capstones);

	console.log(JSON.stringify(model))

	var results = await solver.Solve(model);
	var result_pref = find_distribution(results, student_preferences)

	console.log(results);
	console.log(result_pref);

	return JSON.stringify(results);
}