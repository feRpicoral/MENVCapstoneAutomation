import {useLocalStorage} from "../lib/localStorage";
import {CapstoneProject} from "../lib/capstoneData";
import useDrivePicker from "react-google-drive-picker";
import {useState} from "react";
import {batchUpdate, create} from "../lib/googleFormsApi";
import {Option, Request} from "../lib/googleFormsInterface"
import Script from "next/script";
import {Box, Button, CircularProgress, Grid, Stack, TextField, Typography} from "@mui/material";
import TokenClient = google.accounts.oauth2.TokenClient;
import {ArrowBack} from "@mui/icons-material";

export async function getServerSideProps(context) {
    return {
        props: {
            CLIENT_ID: process.env.MENV_CLIENT_ID,
            API_KEY: process.env.MENV_API_KEY
        }
    }
}

export default function Form({CLIENT_ID}) {
    const TOKEN_INVALID = 'token_invalid'

    const [projects] = useLocalStorage<CapstoneProject[]>('menv-capstone-creation', [])
    const [accessToken, setToken] = useLocalStorage('menv-google-accesstoken', TOKEN_INVALID)
    const [tokenCreated, setTokenCreated] = useLocalStorage<>('menv-google-tokencreated', Date.UTC(1970, 0))

    const [client, setClient] = useState<TokenClient>(null)

    const [formName, setFormName] = useState('')
    const [fileName, setFileName] = useState('')
    const [formDescription, setFormDescription] = useState('')

    const [formWaiting, setFormWaiting] = useState(false)
    const [formSuccess, setFormSuccess] = useState(false)

    // Make sure the token is still valid, i.e. created within the last hour
    if(accessToken != TOKEN_INVALID && (Date.now() - tokenCreated) / 1000 > 3600) {
        setToken(TOKEN_INVALID) // token is now invalid
    }

    function gsiLoad() {
        setClient(google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            callback: tokenResponse => {
                setToken(tokenResponse.access_token)
                setTokenCreated(Date.now())
            },
            scope: 'https://www.googleapis.com/auth/forms https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets'
        }))
    }

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
            title: formName != '' ? formName : 'MENV Capstone Preferences',
            documentTitle: fileName  != '' ? fileName : 'MENV Capstone Automation',
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

    const LoginPrompt = () => {
        if (accessToken == TOKEN_INVALID) {
            return (
                <Stack>
                    <Typography variant='subtitle1'>Please log into your Google account</Typography>
                    <Button variant='contained' onClick={() => client.requestAccessToken()}>Log in</Button>
                </Stack>
            )
        }
        return (
            <Button variant='contained' onClick={() => {
                google.accounts.oauth2.revoke(accessToken, () => {})
                setToken(TOKEN_INVALID)
            }}>Log out</Button>
        )
    }

    return (
        <>
            {/* Third party script used to obtain access token from Google for Forms/Drive/Sheets access */}
            <Script defer src={"https://accounts.google.com/gsi/client"} onLoad={gsiLoad}></Script>
            <Box m={5}>
                <Grid container spacing={2} alignItems='center' justifyItems='center'>
                    <Grid item>
                        <Button href={"/capstones"} startIcon={<ArrowBack/>} variant='contained' color='primary'
                                size='large'>Capstones</Button>
                    </Grid>
                    <Grid item>
                        <Typography variant='h4'>Google Form</Typography>
                        <Typography variant='subtitle1'>Log into Google and configure settings to generate the Google
                            Form.</Typography>
                    </Grid>
                </Grid>
            </Box>
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
                            <TextField label='Form description' value={formDescription} onChange={e => setFormDescription(e.target.value)}></TextField>
                            <Typography variant='body1'>The following button will generate a form with the given projects and settings.</Typography>
                            <Typography variant='body1'>
                                The beginning section of the form will list the projects
                                with their descriptions. Following that section, students will be asked to check off
                                all of the skills which they possess. The list of skills is compiled from all of
                                the projects configured here. Finally, students will rank their project preferences.
                            </Typography>
                            <Typography variant='body1'>
                                This tool will create and set up the form for you; you'll need to then open the form from your Google Drive.
                                You will have to do some final edits to the settings which are only available through
                                that interface:
                            </Typography>
                            <ol>
                                <li>
                                    <Typography variant='body1'>On the project preferences question, click the three dots in the bottom right and enable "Limit to one response per column"</Typography>
                                </li>
                                <li>
                                    <Typography variant='body1'>In the form settings tab, under responses, enable "Limit to 1 response" and "Allow response editing"</Typography>
                                </li>
                            </ol>
                            <Button size='large' variant='contained' color='primary' disabled={formWaiting || formSuccess} onClick={createForm}>{formWaiting ? <CircularProgress/> : 'Create form'}</Button>
                            {formSuccess && <Typography variant='body1'>Form was created successfully, check your Google Drive.</Typography>}
                            {/*<Typography variant='body1'>*/}
                            {/*    The project data is stored in your browser's local storage, so it could be lost.*/}
                            {/*    Therefore, you can export the project data to a Google Sheet to serve as a backup or to*/}
                            {/*    be easily shared.*/}
                            {/*</Typography>*/}
                            {/*<Button variant='contained' color='primary'>Export to Sheets</Button>*/}
                        </>
                    )}
                </Stack>
            </Box>
        </>
    )
}