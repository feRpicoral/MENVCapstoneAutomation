import {Box, Button, Grid, IconButton, Typography} from "@mui/material";
import {ArrowBack, ArrowForward, Home} from "@mui/icons-material";

type NavButton = {
    href: string,
    text: string,
}

type Props = {
    title: string,
    subtitle?: string,
    homeButton: boolean,
    backButton?: NavButton,
    forwardButton?: NavButton,
}

export const TitleBar = ({title, subtitle, homeButton, backButton, forwardButton}: Props) => {
    return (
        <Box m={5}>
            <Grid container spacing={2} alignItems='center' justifyItems='center'>
                {homeButton && (
                    <Grid item>
                        <IconButton href={"/"}>
                            <Home sx={{color: "primary.main"}}/>
                        </IconButton>
                    </Grid>
                )}
                {backButton && (
                    <Grid item>
                        <Button href={backButton.href} startIcon={<ArrowBack/>} variant='contained' color='primary'
                                size='large'>{backButton.text}</Button>
                    </Grid>
                )}
                <Grid item>
                    <Typography variant='h4'>{title}</Typography>
                    <Typography variant='subtitle1'>{subtitle}</Typography>
                </Grid>
                {forwardButton && (
                    <Grid item>
                        <Button href={forwardButton.href} endIcon={<ArrowForward/>} variant='contained' color='primary' size='large'
                                sx={{float: 'right'}}>{forwardButton.text}</Button>
                    </Grid>
                )}
            </Grid>
        </Box>
    )
}