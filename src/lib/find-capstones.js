var fs = require('fs')
var path = require('path')
var solver = require("javascript-lp-solver/src/solver")

export async function test(){
	return {"my":"data"}
}

function getCost(preference_number){
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


function init_model(num_students, num_capstones){
	var model = {};
	model["optimize"] = "cost";
	model["opType"] = "min";
	model["constraints"] = {};
	model["ints"] = {};
	model["variables"] = {};

	for (var s = 1; s <= num_students; s++) {
		// student must be assigned to exactly one capstone.
		model["constraints"][`student-${s}`] = {"min":1, "max": 1};
	}

	for (var c = 1; c <= num_capstones; c++){
		// constraint: capstone should have 3-4 students
		model["constraints"][`capstone-${c}`] = {"min":3, "max":4};
	}

	// set constraints
	for (var s = 1; s <= num_students; s++) {
		for (var c = 1; c <= num_capstones; c++){
			// Set constraint: A student-capstone matching can be 0 or 1.
			model["constraints"][`student-${s}-capstone-${c}`] = {"min":0, "max":1};

			// Make all the variables integers
			model["ints"][`student-${s}-capstone-${c}`] = 1;
		}
	}

	return model
}
function get_random_preferences(num_students, num_capstones){
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

	return student_preferences
}

function set_model_variables(model, student_preferences, num_students, num_capstones){
	var students = Array(num_students).fill(1).map((x, y) => x + y)
	var capstones = Array(num_capstones).fill(1).map((x, y) => x + y)

	for (var s = 1; s <= num_students; s++) {
		for (var c = 1; c <= num_capstones; c++){
			model["variables"][`student-${s}-capstone-${c}`] = {}
			model["variables"][`student-${s}-capstone-${c}`]["cost"] = getCost(student_preferences[s][c])

			students.forEach(key => model["variables"][`student-${s}-capstone-${c}`][`student-${key}`] = 0);
			model["variables"][`student-${s}-capstone-${c}`][`student-${s}`] = 1
			capstones.forEach(key => model["variables"][`student-${s}-capstone-${c}`][`capstone-${key}`] = 0);
			model["variables"][`student-${s}-capstone-${c}`][`capstone-${c}`] = 1

		}
	}

	return model


}

function generate_model(){
	var num_students = 100;
	var num_capstones = 30;

	var model = init_model(num_students, num_capstones)


	var student_preferences = get_random_preferences(num_students, num_capstones)
	
	// set student preferences.

	model = set_model_variables(model, student_preferences, num_students, num_capstones)

	return {"model":model, "student_preferences":student_preferences};
}


function model_from_preferences(student_preferences, num_students, num_capstones){

	// var num_students = Object.keys(student_preferences).length

	var model = init_model(num_students, num_capstones)

	model = set_model_variables(model, student_preferences, num_students, num_capstones)

	return model

}

function find_distribution(results, student_preferences){
	var result_pref = {"pref-1":0, "pref-2":0, "pref-3":0, "pref-4":0, "pref-5":0, "non-pref":0}
	for (const [key, value] of Object.entries(results)) {
	  console.log(`${key}: ${value}`);
	  if (["feasible","result","bounded","isIntegral" ].indexOf(key) == -1){
	  	var s = key.split("student-")[1].split("-")[0];
	  	var c = key.split("capstone-")[1];
	  	var preference = student_preferences[s][c];
	  	if (preference == undefined){
	  		result_pref["non-pref"] +=1;
	  	}
	  	else{
	  		result_pref[`pref-${preference}`]+=1;
	  	}
	  	

	  }


	}

	return result_pref

}

export async function test_solver_random_model(){
	
	// var content = fs.readFileSync("public/example-model.json", {encoding: 'utf-8'})
    // var model = JSON.parse(content);
    var ret = generate_model();
    var model = ret["model"];
    var student_preferences = ret["student_preferences"];
	console.log(model);
	console.log(student_preferences);

	var results = await solver.Solve(model);
	var result_pref = find_distribution(results, student_preferences)

	console.log(results);
	console.log(result_pref);
	return JSON.stringify(results);
}



export async function test_solver_from_file(){
	var content = fs.readFileSync("public/example-preferences.json", {encoding: 'utf-8'})
	var data = JSON.parse(content)
	var student_preferences = data["student_preferences"]
	var num_students = data["num_students"]
	var num_capstones = data["num_capstones"]
	var model = model_from_preferences(student_preferences, num_students, num_capstones);

	console.log(JSON.stringify(model))

	var results = await solver.Solve(model);
	var result_pref = find_distribution(results, student_preferences)

	console.log(results);
	console.log(result_pref);

	return JSON.stringify(results);

}

export async function test_solver_from_file_model(){
	var content = fs.readFileSync("public/example-model-2.json", {encoding: 'utf-8'})
	var data = JSON.parse(content)
	var model = data["model"]
	var num_students = data["num_students"]
	var num_capstones = data["num_capstones"]


	var content2 = fs.readFileSync("public/example-preferences.json", {encoding: 'utf-8'})
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