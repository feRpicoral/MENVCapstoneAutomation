import { find_distribution } from './find-capstones'

var fs = require('fs')
var path = require('path')


export function parse_results(results, capstone_mapping, student_mapping, student_preferences){
	var parsed_results = {};
	var result_pref = find_distribution(results, student_preferences["student_preferences"])
	var res_arr = [result_pref["pref-1"], result_pref["pref-2"], result_pref["pref-3"], 
					result_pref["pref-4"], result_pref["pref-5"], result_pref["non-pref"]]
	var num_students = student_preferences["num_students"]
	for (var i = 0; i< res_arr.length;i++){
	    res_arr[i] = res_arr[i]/num_students * 100
    }

	parsed_results["stats"] = res_arr
	console.log(res_arr)
	parsed_results["results"] = get_logical_results(results, student_mapping, capstone_mapping)
	parsed_results["dropped_capstones"] = dropped_capstones(results, capstone_mapping)

	return parsed_results
}


export function get_example_results(){
	var r = fs.readFileSync("data/examples/example-results.json", {encoding: 'utf-8'})
	r = JSON.parse(r)
	var p = fs.readFileSync("data/examples/example-preferences.json", {encoding: 'utf-8'})
	p = JSON.parse(p)
	var s = fs.readFileSync("data/examples/example-student-mapping.json", {encoding: 'utf-8'})
	s = JSON.parse(s)
	var c = fs.readFileSync("data/examples/example-capstone-mapping.json", {encoding: 'utf-8'})
	c = JSON.parse(c)

	
	var results = {"student_preferences": p, "results": r, "student_mapping": s, "capstone_mapping": c}

	return parse_results(r, c, s, p)

}

export function get_example2_results(){
	var r = fs.readFileSync("data/examples/example2-results.json", {encoding: 'utf-8'})
	r = JSON.parse(r)
	var p = fs.readFileSync("data/examples/example2-preferences.json", {encoding: 'utf-8'})
	p = JSON.parse(p)
	var s = fs.readFileSync("data/examples/example2-student-mapping.json", {encoding: 'utf-8'})
	s = JSON.parse(s)
	var c = fs.readFileSync("data/examples/example2-capstone-mapping.json", {encoding: 'utf-8'})
	c = JSON.parse(c)

	
	var results = {"student_preferences": p, "results": r, "student_mapping": s, "capstone_mapping": c}

	return parse_results(r, c, s, p)

}

function get_logical_results(results, student_mapping , capstone_mapping){
    var logical_result = {};
    for (const [key, value] of Object.entries(results)) {
      // console.log(`${key}: ${value}`);
      if (["feasible","result","bounded","isIntegral" ].indexOf(key) == -1){

        if(key.indexOf("dropped") == -1){
        //ignore dropped capstones.
          var s = key.split("student-")[1].split("-")[0]
          var c = key.split("capstone-")[1]
          var student_name = student_mapping[s]
          var capstone_name = capstone_mapping[c]
          if(!(capstone_name in logical_result)){
            logical_result[capstone_name] = new Array()
          }
          logical_result[capstone_name].push(student_name);
      }
    }
  }

  var count_result = []
  var count = 0;
  for (const [key, value] of Object.entries(logical_result)) {
    var c = {}
    c["id"] = count
    c["capstone"] = key
    for (var i = 0;i < logical_result[key].length;i++){
      c[`student ${i+1}`] = logical_result[key][i]
    }
    count_result.push(c)
    count+=1
  }

  return count_result

}


function dropped_capstones(results, capstone_mapping){
  var dropped = []

  for (const [key, value] of Object.entries(results)) {
      // console.log(`${key}: ${value}`);
    if(key.indexOf("dropped") !== -1){
      var c = key.split("-dropped")[0].split("-")[1]
      dropped.push(capstone_mapping[c])
    }
  }
  console.log(dropped)
  console.log(dropped.length)


	return dropped

}