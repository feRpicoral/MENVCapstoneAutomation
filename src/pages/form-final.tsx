import {useEffect, useState} from "react";
import useDrivePicker from "react-google-drive-picker";
import {useGlobalState} from "../components/GlobalContextProvider";
import {TitleBar} from "../components/TitleBar";
import {Box, Button, Stack, Typography} from "@mui/material";
import {LoginPrompt} from "../components/LoginPrompt";
import {getForm, listResponses} from "../lib/googleFormsApi";
import {Form, FormResponse} from "../lib/googleFormsInterface";
import {CapstoneProject} from "../lib/capstoneData";
import {getValues} from "../lib/googleSheetsApi";
import {DATA_SHEET_TITLE} from "../lib/constants";


type Student = {
    name: string,
    preferences: string[]
}

export default function FormFinal() {
    const [openPicker] = useDrivePicker();
    const [formId, setFormId] = useState('')
    const [sheetId, setSheetId] = useState('')

    const {accessToken} = useGlobalState()

    const [responses, setResponses] = useState<FormResponse[]>([])
    const [projects, setProjects] = useState<CapstoneProject[]>([])
    const [formObject, setFormObject] = useState<Form>()
    const [preferences, setPreferences] = useState<Student[]>()

    useEffect(() => {
        if (formId == '') return
        getForm(accessToken, formId).then(res => setFormObject(res))
        listResponses(accessToken, formId).then(res => setResponses(res.responses || [])).catch(console.log)
    }, [formId])

    useEffect(() => {
        if (sheetId == '') return
        getValues(accessToken, sheetId, DATA_SHEET_TITLE, 'A2:Z1000').then(rows => setProjects(rows.map(row => ({
            projectTitle: row[0],
            projectDescription: row[1],
            partner: row[2],
            contactName: row[3],
            email: row[4],
            phone: row[5],
            minStudents: parseInt(row[6]),
            maxStudents: parseInt(row[7]),
            requiredSkills: row[8]?.split(';;'),
            compensation: row[9]
        })))).catch(console.log)
    }, [sheetId])

    useEffect(() => {
        if (responses.length == 0 || !formObject) return
        const allAnswers = responses.map(resp => resp.answers)

        setPreferences(allAnswers.map(answers => {
            function getAnswers(question: string): string[] {
                let matching = formObject!.items!.filter(item => item.title == question)
                if (matching.length != 1) return ['']
                return answers[matching[0].questionItem.question.questionId].textAnswers.answers.map(ta => ta.value)
            }

            function answer(question: string): string {
                return getAnswers(question)[0]
            }

            return {
                name: `${answer('First Name')}-${answer('Last Name')}`,
                preferences: [
                    answer('Preference 1'),
                    answer('Preference 2'),
                    answer('Preference 3'),
                    answer('Preference 4'),
                    answer('Preference 5'),
                ]
            }
        }))
    }, [responses, formObject])

    useEffect(() => {
        console.log(preferences)
    }, [preferences])

    const chooseForm = () => {
        openPicker({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            developerKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
            token: accessToken,
            viewId: "FORMS",
            callbackFunction(data) {
                if (data.action == 'picked') {
                    setFormId(data.docs[0].id)
                }
            }
        })
    }

    const chooseSheet = () => {
        openPicker({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            developerKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
            token: accessToken,
            viewId: "SPREADSHEETS",
            callbackFunction(data) {
                if (data.action == 'picked') {
                    setSheetId(data.docs[0].id)
                }
            }
        })
    }

    const ChooseFiles = (props) => {
        if (formId == '') return (
            <Button variant='contained' color='primary' onClick={chooseForm}>Choose form to gather responses</Button>
        )
        if (sheetId == '') return (
            <Button variant='contained' color='primary' onClick={chooseSheet}>Choose previously generated data
                sheet</Button>
        )
        return props.children
    }

    return (
        <>
            <TitleBar title='Final Form Creation' homeButton={true}
                      subtitle='Eliminate low-interest projects and create the final preferences form'
            />
            <Box m={5}>
                <Stack spacing={1}>
                    <LoginPrompt>
                        {formId != '' && <Typography variant='body1'>Form OK</Typography>}
                        {sheetId != '' && <Typography variant='body1'>Sheet OK</Typography>}
                        <ChooseFiles>
                            {responses.length == 0 &&
                                <Typography variant='body1'>Nobody has responded to the Google Form yet.</Typography>}
                            {responses.length > 0 &&
                                <Typography variant='body1'>{responses.length} responses</Typography>}
                            <Button variant='contained'>Run algorithm to eliminate projects</Button>
                        </ChooseFiles>
                    </LoginPrompt>
                </Stack>
            </Box>
        </>
    )
}