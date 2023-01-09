import React from 'react'
import { get_2022_results } from 'src/lib/fetch-results'
import {ResultsComponent} from 'src/components/results/resultsComp'

export default function Page({parsed_results}){

  return (
    <ResultsComponent parsed_results = {parsed_results} />
    )

}


export async function getServerSideProps(context) {
  
  const parsed_results = await get_2022_results()

  return {
    props: {
      parsed_results
    }, // will be passed to the page component as props
  }
}
