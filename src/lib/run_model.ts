import {SkillMap, CapstoneMap, StudentMap, Student, Capstone, Result} from 'src/lib/model-interface'
import {init_model, set_model_variables, simplify_capstones} from 'src/lib/find-capstones'
const { performance } = require('perf_hooks');
var solver = require("javascript-lp-solver/src/solver")


export async function run_model(s: StudentMap, c: CapstoneMap, allowDrop: boolean = true): Result{
	console.log("creating model")	
	var model = init_model(s, c, allowDrop)
	model = set_model_variables(model, s, c)
	console.log("Running model")
	// console.log(model)
	var startTime = performance.now()

	var results = await solver.Solve(model);
	// console.log("hi")
	    
	var endTime = performance.now()

	console.log(`Took ${(endTime - startTime)/1000} seconds`)
	

	return results
}