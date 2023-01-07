import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import {Button, Card} from "@mui/material"
import {useEffect} from "react";
import Link from "next/link";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  /*useEffect(() => {
    const bg = document.getElementById("bg");
    if (bg == null) return;
    bg.width = window.screen.width;
    bg.height = (914.0/1920)*window.screen.width;
  });*/

  return (
    <>
      <Head>
        <title>MENV Capstone Sorter</title>
      </Head>
      <div className={styles.page_container}>
        <center>
          <p style={{fontSize: "20pt"}}>CU Masters of the Environment</p>
          <p style={{fontSize: "40pt"}}>Senior Capstone Project Sorter</p>
          <p></p>
          <div style={{justifyContent: "center", alignItems:"center", textAlign: "center", width: "100%"}}>
            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
              <div className={styles.buttoncard_container}>
                <Card elevation={2} className={styles.buttoncard}>
                  <p><b>Step 1:</b></p>
                  <p>Create the list of capstones</p>
                  <Link href="/capstones">
                    <Button>Enter Capstone Projects</Button>
                  </Link>
                </Card>
              </div>
              <div className={styles.buttoncard_container}>
                <Card elevation={2} className={styles.buttoncard}>
                  <p><b>Step 2:</b></p>
                  <p>Create a google form for students to select preferences and check off required skills</p>
                  <Link href="/form">
                    <Button>Create Google Form</Button>
                  </Link>
                </Card>
              </div>
              <div className={styles.buttoncard_container}>
                <Card elevation={2} className={styles.buttoncard}>
                  <p><b>Step 3:</b></p>
                  <p>Sort the students into capstones based on their preferences</p>
                  <Link href="/find-capstones">
                    <Button>Sort Students & View results</Button>
                  </Link>
                </Card>
              </div>
            </div>
          </div>
        </center>
      </div>
      <div className={styles.background_container}>
      </div>

    </>
  )
}
