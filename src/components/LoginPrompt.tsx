import {Button, Stack, Typography} from "@mui/material";
import {useGlobalState} from "./GlobalContextProvider";
import {TOKEN_INVALID} from "../lib/constants";

export const LoginPrompt = () => {
    const state = useGlobalState()

    if (state.accessToken == TOKEN_INVALID) {
        return (
            <Stack>
                <Typography variant='subtitle1'>Please log into your Google account</Typography>
                <Button variant='contained' onClick={() => state.tokenClient.requestAccessToken()}>Log in</Button>
            </Stack>
        )
    }
    return (
        <Button variant='contained' onClick={() => {
            google.accounts.oauth2.revoke(state.accessToken, () => {})
            state.setAccessToken(TOKEN_INVALID)
        }}>Log out</Button>
    )
}