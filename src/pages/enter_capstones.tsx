
import Head from 'next/head';
import styles from "../styles/Enter_Capstones.module.css";
import Image from "next/image.js";

const Enter_Capstones = () => {
    var capstones = 0;
    var capstone_ids = [];

    function addRequirement(){
        const div = document.createElement("div");
        div.className = styles.requirements_input_container;
        const txtentry = document.createElement("input");
        txtentry.className = styles.requirements_input;
        div.append(txtentry);

        txtentry.addEventListener("change", () =>{
            updateRequirementLists();
        });

        const delbutton = document.createElement("img");
        delbutton.src = "/x.png";
        delbutton.alt = "Delete";
        delbutton.className = styles.x_button_small;

        delbutton.addEventListener("click", () => {
            if (div == undefined) return;
            div.remove();
            updateRequirementLists();
        });

        div.append(delbutton);
        
        
        const reqcontainer = document.getElementById("requirements-list");
        reqcontainer?.appendChild(div);
    }

    function updateRequirementLists(){
        const skills = getSkillList();
            skills.unshift("- Select -");
            console.log(getSkillList());
            for (let i = 0; i < capstone_ids.length; i++){
                const dropdown = document.getElementById("skills-" + capstone_ids[i]);
                if (dropdown != undefined){
                    dropdown.innerHTML = "";
                    skills.forEach((element) =>{
                        const opt = document.createElement("option");
                        opt.innerHTML = element;
                        opt.value = element;
                        dropdown.appendChild(opt);
                    })
                }
            }
    }

    function addCapstoneComponent(description: string, class_name: (string | undefined), default_value: (string | undefined), id: (string | undefined)){
        const compdiv = document.createElement("div");
        const compdivdesc = document.createElement("span");
        compdivdesc.innerHTML = description;
        compdiv.appendChild(compdivdesc);
        const compdivinput = document.createElement("input");
        if (id != undefined) compdivinput.id = id;
        if (class_name != undefined) compdivinput.className = class_name;
        if (default_value != undefined) compdivinput.defaultValue = default_value;
        compdiv.appendChild(compdivinput);
        return compdiv;
    }

    function addCapstoneDropdown(description: string, options: (string)[], defaultselection: (string | undefined), multiple: boolean, dropdown_id: (string | undefined)){
        const compdiv = document.createElement("div");
        const compdivdesc = document.createElement("span");
        compdivdesc.innerHTML = description;
        compdiv.appendChild(compdivdesc);
        const compselect = document.createElement("select");
        if (dropdown_id != undefined) compselect.id = dropdown_id;
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
        const id = (capstone_ids.length > 0 ? capstone_ids[capstone_ids.length-1]+1 : 0);
        const capstonediv = document.createElement("div");
        capstonediv.id = "capstone-" + id;
        capstonediv.className= styles.capstone_data

        const captitle = addCapstoneComponent("Capstone Title: ", styles.capstone_data_title, undefined, "title-" + id);
        capstonediv.appendChild(captitle);
        capstonediv.appendChild(addCapstoneDropdown("Min # Students: ", ["2", "3", "4", "5"], "3", false, "min-" + id));
        capstonediv.appendChild(addCapstoneDropdown("Max # Students: ", ["2", "3", "4", "5"], "4", false, "max-" + id));
        
        const capstonediv_container = document.createElement("div");
        capstonediv_container.className = styles.capstone_data_margin;
        capstonediv_container.appendChild(capstonediv);

        const skills_container = document.createElement("div");
        const skillsdiv = document.createElement("div");
        var sls = getSkillList();
        sls.unshift("- Select -");
        const skillsmenu = addCapstoneDropdown("Add Required Skills: ", sls, undefined, false, "skills-" + id);
        skillsdiv.appendChild(skillsmenu);
        skills_container.appendChild(skillsdiv);
        skills_container.className = styles.capstone_skills_list_container;
        capstonediv_container.append(skills_container);

        const delbutton = document.createElement("img");
        delbutton.src = "/x.png";
        delbutton.alt = "Delete";
        delbutton.className = styles.x_button;
        delbutton.id = "delete-" + id;

        delbutton.addEventListener("click", () => {
            if (captitle == undefined || capstonediv_container == undefined || captitle.children.length < 2) return;
            var prompt= "Are you sure you want to delete this capstone?"
            const title = captitle.children[1].value.toString();
            if (title != undefined && title.length > 0) prompt = "Are you sure you want to delete " + title + "?";
            if (confirm(prompt)) {
                
                capstone_ids = capstone_ids.filter(number => number != id);

                capstonediv_container.remove()
                capstones--;
                document.getElementById("capstone-count").innerHTML = capstones + " Capstone" + (capstones == 1 ? "" : "s");
            }
        });

        capstonediv_container.appendChild(delbutton);

        const container = document.getElementById("capstone-list");
        container.appendChild(capstonediv_container);


        capstone_ids.push(id);
        capstones++;
        document.getElementById("capstone-count").innerHTML = capstones + " Capstone" + (capstones == 1 ? "" : "s");
    }

    function getCapstoneJSON(){
        const caplist = document.getElementById("capstone-list");
        var r = [];

        return r;
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

    function createGoogleForm(credentials: string){
        const capstones = getCapstoneJSON();
        const skills = getSkillList();
        //TODO: Create google form and return link
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