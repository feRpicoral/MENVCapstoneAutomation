import {useLocalStorage} from "../lib/localStorage";
import {CapstoneProject} from "../lib/capstoneData";
import {useState} from "react";
import {batchUpdate, create} from "../lib/googleFormsApi";
import {Option, Request} from "../lib/googleFormsInterface"
import {Box, Button, CircularProgress, Stack, TextField, Typography} from "@mui/material";
import {useGlobalState} from "../components/GlobalContextProvider";
import {TOKEN_INVALID} from "../lib/constants";
import {LoginPrompt} from "../components/LoginPrompt";
import {TitleBar} from "../components/TitleBar";

export default function Form() {
    const [projects] = useLocalStorage<CapstoneProject[]>('menv-capstone-creation', [])

    const [formName, setFormName] = useState('')
    const [fileName, setFileName] = useState('')

    const [formWaiting, setFormWaiting] = useState(false)
    const [formSuccess, setFormSuccess] = useState(false)

    const {accessToken} = useGlobalState()

    function collectSkills() {
        let skills = []
        projects.forEach(p => p.requiredSkills.forEach(s => skills.push(s)))
        return skills
    }

    function createForm() {
        let descriptions: Request[] = projects.reverse().map(p => ({
            createItem: {
                item: {
                    title: p.projectTitle,
                    description: p.projectDescription,
                    textItem: {}
                },
                location: {
                    index: 0
                }
            }
        }))
        let skills = collectSkills()
        let skillCheck: Request = {
            createItem: {
                item: {
                    title: "Please select your applicable skills.",
                    questionItem: {
                        question: {
                            required: true,
                            choiceQuestion: {
                                options: skills.map(s => ({
                                    value: s
                                })),
                                type: "CHECKBOX"
                            }
                        }
                    }
                },
                location: {
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
                    title: `Preference ${n+1}`,
                    questionItem: {
                        question: {
                            required: true,
                            choiceQuestion: {
                                options: options,
                                type: "DROP_DOWN"
                            }
                        }
                    }
                },
                location: {
                    index: 0
                }
            }
        }))
        setFormWaiting(true)
        create(accessToken, {
            title: formName != '' ? formName : 'MENV Capstone Initial Preferences',
            documentTitle: fileName  != '' ? fileName : 'MENV Capstone Initial Preferences',
        }).then(form => {
            batchUpdate(accessToken, form.formId!, {
                requests: [...projectSelection.reverse(), skillCheck, ...descriptions],
                includeFormInResponse: true,
            }).then(res => {
                setFormSuccess(true)
                setFormWaiting(false)
            }).catch(e => {
                window.alert(e)
                console.log(e)
                setFormWaiting(false)
            })
        }).catch(window.alert).catch(console.log)
    }

    if (!projects) return null

    return (
        <>
            <TitleBar title='Initial Form Creation' homeButton={true}
                      subtitle='Set up and create a Google Form for initial project preferences'
                      backButton={{ text: 'Projects Setup', href: 'capstones' }}
            />
            <Box m={5}>
                <Stack spacing={1}>
                    <LoginPrompt/>
                    {projects.length == 0 ? (
                        <Typography variant='h6'>No projects have been configured yet, please do so to continue</Typography>
                    ) : ( accessToken != TOKEN_INVALID &&
                        <>
                            <Typography variant='h6'>{projects.length} projects have been configured.</Typography>
                            <TextField label='Form name' helperText='This will be displayed at the top of the form' value={formName} onChange={e => setFormName(e.target.value)}></TextField>
                            <TextField label='File name' helperText='This will be the name of the file as seen in Google Drive' value={fileName} onChange={e => setFileName(e.target.value)}></TextField>
                            <Typography variant='body1'>
                                The beginning section of the form will list the projects
                                with their descriptions. Following that section, students will be asked to check off
                                all of the skills which they possess. The list of skills is compiled from all of
                                the projects configured here. Finally, students will rank their project preferences.
                            </Typography>
                            <Typography variant='body1'>
                                This tool will create and set up the form for you; you'll then need open the form from your Google Drive.
                                You will have to do some final edits to the settings which are only available through
                                that interface:
                            </Typography>
                            <ol>
                                <li>
                                    <Typography variant='body1'>In the form settings tab, under responses, enable "Limit to 1 response" and "Allow response editing"</Typography>
                                </li>
                            </ol>
                            <Button size='large' variant='contained' color='primary' disabled={formWaiting || formSuccess} onClick={createForm}>{formWaiting ? <CircularProgress/> : 'Create form'}</Button>
                            {formSuccess && <Typography variant='body1'>Form was created successfully, check your Google Drive.</Typography>}
                        </>
                    )}
                </Stack>
            </Box>
        </>
    )
}