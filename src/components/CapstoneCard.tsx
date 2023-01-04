import {CapstoneProject} from "../lib/capstoneData";
import {
    Card,
    CardActions,
    CardContent, Chip,
    Divider, Grid,
    IconButton, Tooltip,
    Typography,
    Stack, Collapse, Dialog, DialogTitle, DialogActions, Button
} from "@mui/material";
import {Delete, Edit, ExpandLess, ExpandMore, Person} from "@mui/icons-material";
import {useState} from "react";

type CapstoneCardProps = {
    data: CapstoneProject
    onRemove: Function,
    onEdit: Function,
    inEditMode: boolean
}

export default function CapstoneCard({data, onRemove, onEdit, inEditMode}: CapstoneCardProps) {
    const [hovered, setHovered] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState(false)

    return (
        <>
            <Card elevation={hovered ? 5 : 1} onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}>
                <CardContent sx={{pb: 0}}>
                    <Grid container direction='row'>
                        <Grid item xs={11}>
                            <Typography variant='h5' color='text.primary' fontWeight='bold'
                                        gutterBottom>{data.projectTitle}</Typography>
                        </Grid>
                        <Grid item container justifyContent='flex-end' xs>
                            <IconButton onClick={() => setCollapsed(!collapsed)}>
                                {collapsed ? <ExpandMore/> : <ExpandLess/>}
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Collapse in={!collapsed}>
                        <Typography variant='subtitle1' color='text.primary'
                                    gutterBottom>{data.projectDescription != '' ? data.projectDescription : 'No description provided.'}</Typography>
                        <Grid container alignItems='center' sx={{mb: 2}} justifyContent='space-evenly'>
                            {data.partner != '' ? (
                                <Grid item>
                                    <Typography variant='h6' color='text.secondary'>{data.partner}</Typography>
                                </Grid>
                            ) : null}
                            {data.phone != '' || data.email != '' || data.contactName != '' ? (
                                <Grid item>
                                    <Grid container alignItems='center'>
                                        <Grid item sx={{m: 1}}>
                                            <Person/>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant='body1'>
                                                {data.contactName}
                                            </Typography>
                                            <Typography variant='body2'>
                                                {data.email}
                                            </Typography>
                                            <Typography variant='body2'>
                                                {data.phone}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ) : null}
                        </Grid>
                        <Divider/>
                        <Grid container direction='row' sx={{p: 1}}>
                            <Grid item xs={6} padding={1}>
                                <Typography fontWeight='bold'>Required Skills</Typography>
                                {data.requiredSkills.length == 0 ? <Chip label='None'/> : null}
                                {data.requiredSkills.map(skill => (
                                    <Chip key={skill} label={skill} sx={{m: 0.5}}/>
                                ))}
                            </Grid>
                            <Grid item xs={6} padding={1}>
                                <Stack spacing={0.5} divider={<Divider/>}>
                                    <>
                                        <Typography fontWeight='bold'>Compensation</Typography>
                                        <Typography>{data.compensation != '' ? data.compensation : 'Not specified'}</Typography>
                                    </>
                                    <>
                                        <Typography fontWeight='bold'>Group size</Typography>
                                        <Typography>Between {data.minStudents} and {data.maxStudents}</Typography>
                                    </>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Collapse>
                </CardContent>
                <CardActions sx={{float: 'right'}}>
                    {inEditMode ? null : (
                        <Tooltip title='Edit'>
                            <IconButton onClick={onEdit}>
                                <Edit/>
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title='Delete'>
                        <IconButton onClick={() => setDeleteConfirm(true)}>
                            <Delete/>
                        </IconButton>
                    </Tooltip>
                </CardActions>
            </Card>
            <Dialog open={deleteConfirm}>
                <DialogTitle>Really delete this project?</DialogTitle>
                <DialogActions>
                    <Button onClick={onRemove} color='error'>Yes</Button>
                    <Button onClick={() => setDeleteConfirm(false)} color='primary'>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}