import {
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Grid,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {Box} from "@mui/system";
import {useState} from "react";
import {CapstoneProject} from "../lib/capstoneData";

type Props = {
    finalizeCreate: Function
    cancel: Function
    editingProject?: CapstoneProject
}

export const CapstoneEditor = ({finalizeCreate, cancel, editingProject}: Props) => {
    const [formState, setFormState] = useState<CapstoneProject>(editingProject ? editingProject : {
        projectTitle: '',
        projectDescription: '',
        partner: '',
        contactName: '',
        phone: '',
        email: '',
        compensation: '',
        minStudents: 3,
        maxStudents: 4,
        requiredSkills: []
    })

    const [error, setError] = useState('')
    const [newSkill, setNewSkill] = useState('')

    const validate = () => {
        if (formState.projectTitle == '') {
            setError('Project must at least have a title')
            return
        }
        finalizeCreate(formState)
    }

    return (
        <Card elevation={3}>
            <CardContent sx={{ pb: 0 }}>
                <Box component='form'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField variant='outlined' label='Project Title' fullWidth required
                                       value={formState.projectTitle} onChange={e => setFormState({
                                ...formState,
                                projectTitle: e.target.value
                            })}/>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField variant='outlined' multiline label='Project Description'
                                       fullWidth value={formState.projectDescription}
                                       onChange={e => setFormState({
                                           ...formState,
                                           projectDescription: e.target.value
                                       })}/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField variant='outlined' label='Partner' fullWidth value={formState.partner}
                                       onChange={e => setFormState({
                                           ...formState,
                                           partner: e.target.value
                                       })}/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField variant='outlined' label='Contact Name' fullWidth value={formState.contactName}
                                       onChange={e => setFormState({
                                           ...formState,
                                           contactName: e.target.value
                                       })}/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField variant='outlined' label='Contact Email' fullWidth value={formState.email}
                                       onChange={e => setFormState({...formState, email: e.target.value})}/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField variant='outlined' label='Contact Phone' fullWidth value={formState.phone}
                                       onChange={e => setFormState({
                                           ...formState,
                                           phone: e.target.value
                                       })}/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField variant='outlined' label='Compensation' fullWidth value={formState.compensation}
                                       onChange={e => setFormState({
                                           ...formState,
                                           compensation: e.target.value
                                       })}/>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField variant='outlined' type='number' label='Min Students' fullWidth
                                       value={formState.minStudents}
                                       onChange={e => setFormState({
                                           ...formState,
                                           minStudents: Math.max(0, Math.min(10, parseInt(e.target.value)))
                                       })}/>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField variant='outlined' type='number' label='Max Students' fullWidth
                                       value={formState.maxStudents}
                                       onChange={e => setFormState({
                                           ...formState,
                                           maxStudents: Math.max(0, Math.min(10, parseInt(e.target.value)))
                                       })}/>
                        </Grid>
                        <Grid item xs={12} padding={1}>
                            <Typography fontWeight='bold'>Required Skills</Typography>
                            {formState.requiredSkills.map(skill => (
                                <Chip key={skill} label={skill} sx={{ m: 0.5 }} onDelete={() => setFormState({
                                    ...formState,
                                    requiredSkills: formState.requiredSkills.filter(sk => sk !== skill)
                                })}/>
                            ))}
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>
            <CardActions>
                <Stack direction='row' alignContent='center' sx={{p:1}} spacing={1}>
                    <Button variant='contained' onClick={validate}>Save</Button>
                    <Button variant='contained' onClick={cancel}>Cancel</Button>
                    <TextField variant='outlined' size='small' placeholder='New required skill' value={newSkill} sx={{ float: 'right' }} onChange={e => setNewSkill(e.target.value)}/>
                    <Button variant='contained' sx={{ float: 'right' }} onClick={() => {
                        if (newSkill == '') return
                        formState.requiredSkills.push(newSkill)
                        setNewSkill('')
                    }}>Add Skill</Button>
                    <Typography sx={{ml: 2}} color='error.main'>{error}</Typography>
                </Stack>
            </CardActions>
        </Card>
    )
}