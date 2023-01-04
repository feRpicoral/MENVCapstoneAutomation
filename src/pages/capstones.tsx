import {useState} from "react";
import {Button, Grid, IconButton, Stack, Typography} from "@mui/material";
import {CapstoneProject} from "../lib/capstoneData";
import CapstoneCard from "../components/CapstoneCard";
import {useLocalStorage} from "../lib/localStorage";
import {Box} from "@mui/system";
import {CapstoneEditor} from "../components/CapstoneEditor";
import {Add, ArrowForward, Home} from "@mui/icons-material";

export default function Capstones() {
    const [projects, setProjects] = useLocalStorage<CapstoneProject[]>('menv-capstone-creation', [])

    const [editing, setEditing] = useState(false)
    const [editingProject, setEditingProject] = useState<CapstoneProject | null>(null)
    const [beforeEdit, setBeforeEdit] = useState<CapstoneProject[] | null>(null)

    const finalizeEdit = (formState: CapstoneProject) => {
        setProjects([...projects, structuredClone(formState)])
        setEditingProject(null)
        setBeforeEdit(null)
        setEditing(false)
    }
    const removeProject = (project: CapstoneProject) => {
        setProjects(projects.filter(p => p != project))
    }
    const editProject = (project: CapstoneProject) => {
        removeProject(project)
        setEditingProject(project)
        setBeforeEdit(structuredClone(projects))
        setEditing(true)
    }
    const cancelEdit = () => {
        if (editingProject !== null) {
            setProjects(structuredClone(beforeEdit!))
        }
        setEditingProject(null)
        setBeforeEdit(null)
        setEditing(false)
    }

    const CreateButton = () => {
        if (editing) return null
        return (
            <Button variant='contained' size='large' startIcon={<Add/>} onClick={() => setEditing(true)}>
                Create New
            </Button>
        )
    }

    // sign in -> validate form ID (create or select) -> add projects -> update form -> gather responses -> run algorithm -> display results
    return (
        <>
            <Box m={5}>
                <Grid container spacing={2} alignItems='center' justifyItems='center'>
                    <Grid item>
                        <IconButton href={"/"}>
                            <Home sx={{color: "primary.main"}}/>
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Typography variant='h4'>Capstone Creation</Typography>
                        <Typography variant='subtitle1'>Enter capstone information, then continue to the next step to
                            set up the Google Form.</Typography>
                    </Grid>
                    <Grid item>
                        <Button href={"/form"} endIcon={<ArrowForward/>} variant='contained' color='primary' size='large'
                                sx={{float: 'right'}}>Continue</Button>
                    </Grid>
                </Grid>
            </Box>
            <Box m={5}>
                <Stack spacing={2}>
                    {projects ? projects.map(p => (
                        <CapstoneCard
                            key={p.projectTitle}
                            data={p}
                            onRemove={() => removeProject(p)}
                            onEdit={() => editProject(p)}
                            inEditMode={editing}
                        />
                    )) : null}
                    <CreateButton/>
                    {editing ? <CapstoneEditor editingProject={editingProject!} finalizeCreate={finalizeEdit}
                                               cancel={cancelEdit}/> : null}
                </Stack>
            </Box>
        </>
    )
}