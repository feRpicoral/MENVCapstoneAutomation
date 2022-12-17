var fs = require('fs')
var path = require('path')
var solver = require("javascript-lp-solver/src/solver")

// var model = {
//     "optimize": "cost",
//     "opType": "min",
//     "constraints": {
//     	"student-1-capstone-1":{"min":0, "max":1},
// 		"student-1-capstone-2":{"min":0, "max":1},
// 		"student-1-capstone-3":{"min":0, "max":1},
// 		"student-1-capstone-4":{"min":0, "max":1},
// 		"student-2-capstone-1":{"min":0, "max":1},
// 		"student-2-capstone-2":{"min":0, "max":1},
// 		"student-2-capstone-3":{"min":0, "max":1},
// 		"student-2-capstone-4":{"min":0, "max":1},
// 		"capstone-1": {"min":1, "max":4},
// 		"capstone-2": {"min":1, "max":4},
// 		"capstone-3": {"min":1, "max":4},
// 		"capstone-4": {"min":1, "max":4},
// 		"student-1": {"min":1, "max": 1},
// 		"student-2": {"min":1, "max": 1}
//     },
//     "variables": {
//     	"student-1-capstone-1":{
//     		"cost": 1,
//     		"student-1": 1,
//     		"student-2": 0,
//     		"capstone-1": 1,
//     		"capstone-2": 0,
//     		"capstone-3": 0,
//     		"capstone-4": 0,
//     	},
//     	"student-1-capstone-2":{
//     		"cost": 25,
// 			"student-1": 1,
//     		"student-2": 0,
//     		"capstone-1": 0,
//     		"capstone-2": 1,
//     		"capstone-3": 0,
//     		"capstone-4": 0,
//     	},
//     	"student-1-capstone-3":{
//     		"cost": 50,
//     		"student-1": 1,
//     		"student-2": 0,
//     		"capstone-1": 0,
//     		"capstone-2": 0,
//     		"capstone-3": 1,
//     		"capstone-4": 0,
//     	},
//     	"student-1-capstone-4":{
//     		"cost": 100000,
//     		"student-1": 1,
//     		"student-2": 0,
//     		"capstone-1": 0,
//     		"capstone-2": 0,
//     		"capstone-3": 0,
//     		"capstone-4": 1,
//     	},


//     	"student-2-capstone-1":{
//     		"cost": 100000,
//     		"student-1": 0,
//     		"student-2": 1,
//     		"capstone-1": 1,
//     		"capstone-2": 0,
//     		"capstone-3": 0,
//     		"capstone-4": 0,
//     	},
//     	"student-2-capstone-2":{
//     		"cost": 1,
//     		"student-1": 0,
//     		"student-2": 1,
//     		"capstone-1": 0,
//     		"capstone-2": 1,
//     		"capstone-3": 0,
//     		"capstone-4": 0,
//     	},
//     	"student-2-capstone-3":{
//     		"cost": 25,
//     		"student-1": 0,
//     		"student-2": 1,
//     		"capstone-1": 0,
//     		"capstone-2": 0,
//     		"capstone-3": 1,
//     		"capstone-4": 0,
//     	},
//     	"student-2-capstone-4":{
//     		"cost": 50,
//     		"student-1": 0,
//     		"student-2": 1,
//     		"capstone-1": 0,
//     		"capstone-2": 0,
//     		"capstone-3": 0,
//     		"capstone-4": 1,
//     	}
//     },
//     // "ints":{"student-1-capstone-1":1,"student-1-capstone-2":1,"student-1-capstone-3":1,"student-1-capstone-4":1,"student-2-capstone-1":1,"student-2-capstone-2":1,"student-2-capstone-3":1,"student-2-capstone-4":1}
// }

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


function generate_model(){
	var num_students = 100;
	var num_capstones = 30;

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

	// set student preferences.
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


	return {"model":model, "student_preferences":student_preferences};
}

export async function test_solver(){
	
	// var content = fs.readFileSync("public/example-model.json", {encoding: 'utf-8'})
    // var model = JSON.parse(content);
    var ret = generate_model();
    var model = ret["model"];
    var student_preferences = ret["student_preferences"];
	console.log(model);
	console.log(student_preferences);

	var results = await solver.Solve(model);
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
	console.log(results);
	console.log(result_pref);
	return JSON.stringify(results);
}