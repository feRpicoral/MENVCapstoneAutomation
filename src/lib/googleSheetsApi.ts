import axios, {AxiosResponse} from "axios";
import {DATA_SHEET_TITLE} from "./constants";

interface Spreadsheet {
    spreadsheetId: string,
    properties: {
        title: string,
    }
    sheets: Sheet[],
    spreadsheetUrl: string,
}

interface SheetProperties {
    sheetId?: number,
    title?: string,
    index?: number,
}

interface Sheet {
    properties: SheetProperties
    data: [
        {
            rowData: {
                values: any[]
            }
        }
    ]
}

export const createSpreadsheet = (accessToken: string, title: string): Promise<Spreadsheet> => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    // noinspection TypeScriptValidateTypes
    return axios.post<Spreadsheet, AxiosResponse<Spreadsheet>>('https://sheets.googleapis.com/v4/spreadsheets/', {
        properties: {
            title: title
        },
        sheets: [
            {
                properties: {
                    title: DATA_SHEET_TITLE
                }
            }
        ]
    }, {
        headers: headers
    })
        .then(response => response.data)
}

interface AddSheetResponse {
    spreadsheetId: string,
    updatedSpreadsheet: Spreadsheet
}

// Add a sheet to the spreadsheet.
// A sheet is another tab at the bottom of the page.
export const addSheet = (accessToken: string, spreadsheetId: string, properties: SheetProperties): Promise<AddSheetResponse> => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    // noinspection TypeScriptValidateTypes
    return axios.post<AddSheetResponse, AxiosResponse<AddSheetResponse>>(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        requests: [
            {
                addSheet: {
                    properties: properties
                }
            }
        ],
        includeSpreadsheetInResponse: true
    }, {
        headers: headers
    })
        .then(response => response.data)
}

// Get the values within the given range and on the given sheet as an array of string arrays, representing rows.
// Only non-empty values are returned, but rows will all be the same length.
export const getValues = (accessToken: string, spreadsheetId: string, sheetTitle: string, range: string): Promise<string[][]> => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    // noinspection TypeScriptValidateTypes
    return axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}!${range}`, {
        headers: headers
    })
        .then(response => response.data.values)
}

// Sets values raw within the given range
export const setValues = (accessToken: string, spreadsheetId: string, sheetTitle: string, range: string, values: string[][]): Promise<void> => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    // noinspection TypeScriptValidateTypes
    return axios.put(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}!${range}?valueInputOption=RAW`, {
        values: values,
        majorDimension: "ROWS"
    },{
        headers: headers
    })
        .then(response => response.data)
}

export const autoResizeRows = (accessToken: string, spreadsheetId: string, sheetId: number): Promise<void> => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    // noinspection TypeScriptValidateTypes
    return axios.post(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        requests: [
            {
                autoResizeDimensions: {
                    dimensions: {
                        sheetId: sheetId,
                        dimension: "ROWS",
                        startIndex: 0,
                        endIndex: 100
                    }
                }
            }
        ],
        includeSpreadsheetInResponse: true
    }, {
        headers: headers
    })
        .then(response => response.data)
}