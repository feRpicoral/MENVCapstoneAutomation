import React from 'react'
// import Grid from '@material-ui/core/Grid'
import { test_solver_from_file } from '../../lib/find-capstones'
// import UserCard from '../../components/card'

export default function Page({solution}){

  return (
      <div> {solution} </div>
    )

}

export async function getServerSideProps(context) {
  
  const solution = await test_solver_from_file()
  // console.log(solution)

  return {
    props: {
      solution
    }, // will be passed to the page component as props
  }
}
