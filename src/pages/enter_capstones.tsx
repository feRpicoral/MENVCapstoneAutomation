
import Head from 'next/head';
import styles from "../styles/Enter_Capstones.module.css";

const Enter_Capstones = () => {
    var capstones = [];
    var requirements = [];

    function addRequirement(){
        const div = document.createElement("div");
        div.id = "requirements-" + requirements.length;
        div.className = styles.requirements_input_container;
        const txtentry = document.createElement("input");
        txtentry.className = styles.requirements_input;
        txtentry.addEventListener("change", (event) =>{
            console.log("change: " + event.target?.value);
        });
        requirements.push("");
        div.append(txtentry);
        
        const reqcontainer = document.getElementById("requirements-container");
        reqcontainer?.insertBefore(div, reqcontainer.lastChild);
    }

    function addCapstone(){
        const div = document.createElement("div");
        div.id = "capstone-" + capstones.length;
        div.className= styles.capstone_data;
        div.textContent = "Placeholder";
        //div.append(...)
        var container = document.getElementById("capstone-container");
        container?.insertBefore(div, container.lastChild);
    }

    return (
        <>
            <Head>
                <title>Test page</title>
            </Head>
            <div id="instructions">
                <h1>Step 1: Enter Capstone Information</h1>
                <p className={styles.instructions}>Add the list of special requirements on the left by typing the name and pressing the + button. Then, add the list of capstones on the right with the + button. Any requirements can be added to a capstone from the list.</p>
            </div>
            <div id="content-container">
                <div id="requirements-container" className = {[styles.requirements_container, styles.split].join(" ")}>
                    <h2>Requirements</h2>
                    <br></br>
                    <button className = {styles.add_button} onClick={addRequirement}>+</button>
                </div>
                <div id="capstone-container" className = {[styles.capstone_container, styles.split].join(" ")}>
                    <h2>Capstones</h2>
                    <br></br>
                    <button className={styles.add_button} onClick={addCapstone}>+</button>
                </div>
            </div>
        </>
    )
}

export default Enter_Capstones;