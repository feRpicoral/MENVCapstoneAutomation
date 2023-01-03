import React from 'react'
// import Grid from '@material-ui/core/Grid'
import { test_example2 } from '../../lib/find-capstones'
// import UserCard from '../../components/card'

export default function Page({solution}){

  return (
      <div> {solution} </div>
    )

}

export async function getServerSideProps(context) {
  
  const solution = await test_example2()
  // console.log(solution)

  return {
    props: {
      solution
    }, // will be passed to the page component as props
  }
}
