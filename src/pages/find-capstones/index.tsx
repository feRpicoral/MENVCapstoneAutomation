import React from 'react'
// import Grid from '@material-ui/core/Grid'
import { test, test_solver_random_model } from '../../lib/find-capstones'
import { get_random_case } from '../../lib/example_data'
import { run_model } from '../../lib/run_model'
// import UserCard from '../../components/card'

export default function Page({results}){

  return (
      <div> {results} </div>
    )

}

export async function getServerSideProps(context) {
  
  var num_students = 100
  var num_capstones = 55
  const ret = get_random_case(num_students, num_capstones)
  // console.log(ret)
  let students = ret["students"]
  let capstones = ret["capstones"]
  let results = JSON.stringify(await run_model(students, capstones, true))


  console.log(results)

  return {
    props: {
      results
    }, // will be passed to the page component as props
  }
}
