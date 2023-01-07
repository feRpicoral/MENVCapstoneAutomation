import React from 'react'
// import Grid from '@material-ui/core/Grid'
import { test_example1 } from 'src/lib/example_data.ts'
import { run_model } from 'src/lib/run_model.ts'
// import UserCard from '../../components/card'

export default function Page({solution}){

  return (
      <div> {solution} </div>
    )

}

export async function getServerSideProps(context) {
  
  const ret = await test_example1()
  console.log(ret)
  let students = ret["students"]
  let capstones = ret["capstones"]
  let solution = JSON.stringify(await run_model(students, capstones, true))


  // console.log(solution)

  return {
    props: {
      solution
    }, // will be passed to the page component as props
  }
}
