
import Head from 'next/head';
import { Children } from 'react';
import styles from "../styles/Enter_Capstones.module.css";

const Enter_Capstones = () => {
    var capstones = 0;

    function addRequirement(){
        const div = document.createElement("div");
        div.className = styles.requirements_input_container;
        const txtentry = document.createElement("input");
        txtentry.className = styles.requirements_input;
        div.append(txtentry);
        
        const reqcontainer = document.getElementById("requirements-list");
        reqcontainer?.appendChild(div);
    }

    function addCapstoneComponent(description: string, class_name: (string | undefined), default_value: (string | undefined)){
        const compdiv = document.createElement("div");
        const compdivdesc = document.createElement("span");
        compdivdesc.innerHTML = description;
        compdiv.appendChild(compdivdesc);
        const compdivinput = document.createElement("input");
        if (class_name != undefined) compdivinput.className = class_name;
        if (default_value != undefined) compdivinput.defaultValue = default_value;
        compdiv.appendChild(compdivinput);
        return compdiv;
    }

    function addCapstoneDropdown(description: string, options: (string)[], defaultselection: (string | undefined), multiple: boolean){
        const compdiv = document.createElement("div");
        const compdivdesc = document.createElement("span");
        compdivdesc.innerHTML = description;
        compdiv.appendChild(compdivdesc);
        const compselect = document.createElement("select");
        if (multiple) compselect.multiple = true;
        options.forEach((element) =>{
            const opt = document.createElement("option");
            opt.innerHTML = element;
            opt.value = element;
            if (defaultselection != undefined && element == defaultselection) opt.selected = true;
            compselect.appendChild(opt);
        })
        compdiv.appendChild(compselect);
        return compdiv;
    }

    function addCapstone(){
        const capstonediv = document.createElement("div");
        capstonediv.id = "capstone-" + capstones;
        capstones++;
        capstonediv.className= styles.capstone_data

        capstonediv.appendChild(addCapstoneComponent("Capstone Title: ", styles.capstone_data_title, undefined))
        capstonediv.appendChild(addCapstoneDropdown("Min # Students: ", ["2", "3", "4", "5"], "3", false));
        capstonediv.appendChild(addCapstoneDropdown("Max # Students: ", ["2", "3", "4", "5"], "4", false));
        
        const capstonediv_container = document.createElement("div");
        capstonediv_container.className = styles.capstone_data_margin;
        capstonediv_container.appendChild(capstonediv);

        const skills_container = document.createElement("div");
        const skillsdiv = document.createElement("div");
        const skillsmenu = addCapstoneDropdown("Required Skills: ", getSkillList(), undefined, false);
        skillsdiv.appendChild(skillsmenu);
        skills_container.appendChild(skillsdiv);
        //capstonediv_container.append(skills_container);

        const container = document.getElementById("capstone-list");
        container.appendChild(capstonediv_container);


        document.getElementById("capstone-count").innerHTML = capstones + " Capstone" + (capstones == 1 ? "" : "s");
    }

    function getSkillList(){
        var skills: (string)[] = [];
        const htmllist = document.getElementById("requirements-list")?.children;
        if (htmllist == undefined) return [];
        for (let i = 0; i < htmllist.length; i++){
            const v = htmllist[i].children[0].value.toString();
            if (v.length > 0) skills.push(v);
        }
        return skills;
    }

    return (
        <>
            <Head>
                <title>Test page</title>
            </Head>
            <div id="instructions">
                <h1>Step 1: Enter Capstone Information</h1>
                <p className={styles.instructions}>Add the list of skill requirements on the left -- this list will create the pool of possible skills a capstone can require. Then, add the list of capstones on the right with the + button. Any requirements can be added to a capstone from the list.</p>
            </div>
            <div id="content-container" className={styles.split_container}>
                <div className = {styles.requirements_container}>
                    <div id="requirements-list-container" style={{margin: "15px"}}>
                        <h2>Skill List</h2>
                        <br></br>
                        <div id="requirements-list"></div>
                        <button className = {styles.add_button} onClick={addRequirement}>+</button>
                    </div>
                </div>
                <div className = {styles.capstone_container}>
                    <div id="capstone-list-container" style={{margin: "15px"}}>
                        <h2>Capstones</h2>
                        <br></br>
                        <div id="capstone-list"></div>
                        <div style={{display: "flex"}}>
                            <div>
                                <button className={styles.add_button} onClick={addCapstone}>+</button>
                            </div>
                            <div>
                                <div style={{color: "#444", textDecoration: "underline", left: "20px", top: "15px", position:"relative", fontSize: "12pt"}}>
                                    <span id="capstone-count">0 Capstones</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Enter_Capstones;