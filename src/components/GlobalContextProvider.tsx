import {createContext, useContext, useState} from "react";
import TokenClient = google.accounts.oauth2.TokenClient;
import {useLocalStorage} from "../lib/localStorage";
import Script from "next/script";
import {TOKEN_INVALID} from "../lib/constants";

type GlobalState = {
    accessToken: string,
    setAccessToken: Function,
    tokenClient: TokenClient,
}

const GlobalContext = createContext<GlobalState>({} as GlobalState)

export const GlobalContextProvider = ({children}) => {
    const [accessToken, setAccessToken] = useLocalStorage('menv-google-accesstoken', TOKEN_INVALID)
    const [tokenCreated, setTokenCreated] = useLocalStorage('menv-google-tokencreated', Date.UTC(1970, 0))
    const [tokenClient, setTokenClient] = useState<TokenClient>(null)

    function onGoogleAccountsLoaded() {
        setTokenClient(google.accounts.oauth2.initTokenClient({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: tokenResponse => {
                setAccessToken(tokenResponse.access_token)
                setTokenCreated(Date.now())
            },
            scope: 'https://www.googleapis.com/auth/forms https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets'
        }))
    }

    // Make sure the token is still valid, i.e. created within the last hour
    if (accessToken != TOKEN_INVALID && (Date.now() - tokenCreated) / 1000 > 3600) {
        setAccessToken(TOKEN_INVALID) // token is now invalid
    }

    return (
        <>
            {/* Third party script used to obtain access token from Google for Forms/Drive/Sheets access */}
            <Script defer src={"https://accounts.google.com/gsi/client"} onLoad={onGoogleAccountsLoaded}></Script>
            <GlobalContext.Provider value={{accessToken, setAccessToken, tokenClient}}>
                {children}
            </GlobalContext.Provider>
        </>
    )
}

export function useGlobalState() {
    return useContext(GlobalContext)
}