import {Option, Request} from "./googleFormsInterface";
import {batchUpdate as updateForm, create as createGForm} from "./googleFormsApi";
import {CapstoneProject} from "./capstoneData";

function collectSkills(projects: CapstoneProject[]) {
    let skills = []
    projects.forEach(p => p.requiredSkills.forEach(s => skills.push(s)))
    return skills
}

export function createForm(accessToken: string, includeDescriptions: boolean, projects: CapstoneProject[], formName: string, fileName: string, setFormWaiting: Function, setFormSuccess: Function, setFormId: Function) {
    let descriptions: Request[] = includeDescriptions ? projects.reverse().map(p => ({
        createItem: {
            item: {
                title: p.projectTitle, description: p.projectDescription, textItem: {}
            }, location: {
                index: 0
            }
        }
    })) : []
    let skills = collectSkills(projects)
    let skillCheck: Request = {
        createItem: {
            item: {
                title: "Please select your applicable skills.", questionItem: {
                    question: {
                        required: true, choiceQuestion: {
                            options: skills.map(s => ({
                                value: s
                            })), type: "CHECKBOX"
                        }
                    }
                }
            }, location: {
                index: 0
            }
        }
    }
    let options: Option[] = projects.map(proj => ({
        value: proj.projectTitle,
    }))
    let projectSelection: Request[] = [...Array(5).keys()].map(n => ({
        createItem: {
            item: {
                title: `Preference ${n + 1}`, questionItem: {
                    question: {
                        required: true, choiceQuestion: {
                            options: options, type: "DROP_DOWN"
                        }
                    }
                }
            }, location: {
                index: 0
            }
        }
    }))
    setFormWaiting(true)
    createGForm(accessToken, {
        title: formName != '' ? formName : 'MENV Capstone Preferences',
        documentTitle: fileName != '' ? fileName : 'MENV Capstone Preferences',
    }).then(form => {
        updateForm(accessToken, form.formId!, {
            requests: [...projectSelection.reverse(), skillCheck, ...descriptions], includeFormInResponse: true,
        }).then(res => {
            setFormId(res.form.formId!);
            setFormSuccess(true)
            setFormWaiting(false)
        }).catch(e => {
            window.alert(e)
            console.log(e)
            setFormWaiting(false)
        })
    }).catch(window.alert).catch(console.log)
}