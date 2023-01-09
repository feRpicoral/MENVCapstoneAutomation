import {useLocalStorage} from "../lib/localStorage";
import {CapstoneProject} from "../lib/capstoneData";
import {useState} from "react";
import {
    Box,
    Button,
    CircularProgress,
    FormControlLabel,
    FormGroup,
    Stack,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import {useGlobalState} from "../components/GlobalContextProvider";
import {DATA_SHEET_TITLE, TOKEN_INVALID} from "../lib/constants";
import {LoginPrompt} from "../components/LoginPrompt";
import {TitleBar} from "../components/TitleBar";
import {createSpreadsheet, setValues} from "../lib/googleSheetsApi";
import {createForm} from "../lib/exportData";

export default function Form() {
    const [projects] = useLocalStorage<CapstoneProject[]>('menv-capstone-creation', [])

    const [formName, setFormName] = useState('')
    const [fileName, setFileName] = useState('')
    const [includeDescriptions, setIncludeDescriptions] = useState(true)

    const [formWaiting, setFormWaiting] = useState(false)
    const [formSuccess, setFormSuccess] = useState(false)
    const [createdFormId, setFormId] = useState('')

    const [sheetWaiting, setSheetWaiting] = useState(false)
    const [sheetSuccess, setSheetSuccess] = useState(false)

    const {accessToken} = useGlobalState()

    function createGoogleForm() {
        createForm(accessToken, includeDescriptions, projects, formName, fileName, setFormWaiting, setFormSuccess, setFormId)
    }

    function exportToSheet() {
        let headers: string[] = ['Project Title', 'Project Description', 'Partner', 'Contact Name', 'Contact Email', 'Contact Phone', 'Min Students', 'Max Students', 'Required Skills (separated by \';;\')', 'Compensation']
        let values: string[][] = projects.map(p => [p.projectTitle, p.projectDescription, p.partner, p.contactName, p.email, p.phone, p.minStudents.toString(), p.maxStudents.toString(), p.requiredSkills.join(';;'), p.compensation,])
        setSheetWaiting(true)
        createSpreadsheet(accessToken, 'MENV Capstone Automation Data').then(sheet => {
            setValues(accessToken, sheet.spreadsheetId, DATA_SHEET_TITLE, 'A1:Z1000', [headers, ...values]).then(res => {
                setSheetSuccess(true)
                setSheetWaiting(false)
            })
        }).catch(window.alert).catch(console.log)
    }

    if (!projects) return null

    return (<>
        <TitleBar title='Initial Form Creation' homeButton={true}
                  subtitle='Set up and create a Google Form for initial project preferences'
                  backButton={{text: 'Projects Setup', href: 'capstones'}}
        />
        <Box m={5}>
            <Stack spacing={1}>
                <LoginPrompt/>
                {projects.length == 0 ? (<Typography variant='h6'>No projects have been configured yet, please do so to
                    continue</Typography>) : (accessToken != TOKEN_INVALID && <>
                    <Typography variant='h6'>{projects.length} projects have been configured.</Typography>
                    <TextField label='Form name' helperText='This will be displayed at the top of the form'
                               value={formName} onChange={e => setFormName(e.target.value)}></TextField>
                    <TextField label='File name'
                               helperText='This will be the name of the file as seen in Google Drive'
                               value={fileName} onChange={e => setFileName(e.target.value)}></TextField>
                    <FormGroup>
                        <FormControlLabel control={
                            <Switch checked={includeDescriptions} onChange={e => setIncludeDescriptions(e.target.checked)}
                                     inputProps={{ 'aria-label': 'controlled' }}/>
                        } label='Include project titles and descriptions at top of form for reference'/>
                    </FormGroup>
                    <Typography variant='body1'>
                        This tool will create and set up the form for you; you can delete and remake it as many times
                        as desired, just reload the page.
                        You will have to do some final edits to the settings which are only available through
                        the Forms interface:
                    </Typography>
                    <ol>
                        <li>
                            <Typography variant='body1'>
                                In the form settings tab, under responses, enable "Limit
                                to 1 response" and "Allow response editing"
                            </Typography>
                        </li>
                    </ol>
                    <Button size='large' variant='contained' color='primary'
                            disabled={formWaiting || formSuccess} onClick={createGoogleForm}>{formWaiting ?
                        <CircularProgress/> : 'Create form'}</Button>
                    {formSuccess && <Typography variant='body1'>Form was created successfully,
                        <a target="_blank" href={`https://docs.google.com/forms/d/${createdFormId}/edit`}>
                         click to view and edit
                        </a>
                    </Typography>}
                    <Typography variant='body1'>Please export the data to a Google Sheet as well in case of data
                        loss.</Typography>
                    <Button size='large' variant='contained' color='primary'
                            disabled={sheetWaiting || sheetSuccess} onClick={exportToSheet}>{sheetWaiting ?
                        <CircularProgress/> : 'Export to sheet'}</Button>
                    {sheetSuccess && <Typography variant='body1'>Sheet was created successfully. It will be used in later steps, you don't need to do anything to it.</Typography>}
                    {sheetSuccess && formSuccess &&
                        <Typography variant='body1'>You're all done. Thank you!</Typography>}
                </>)}
            </Stack>
        </Box>
    </>)
}