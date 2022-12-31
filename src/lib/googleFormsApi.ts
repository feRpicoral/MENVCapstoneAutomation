import axios, {AxiosResponse} from "axios";
import {
    BatchUpdateFormRequest,
    BatchUpdateFormResponse,
    CreateFormRequest,
    Form,
    FormResponse, ListResponsesResponse
} from "./googleFormsInterface";


// Create a new form using the title given in the provided form message in the request.
// IMPORTANT: Only the `info.title` and `info.documentTitle` fields are copied to the new form.
// All other fields including the form description, items and settings are disallowed.
// To create a new form and add items, you must first call `create` to create an empty form with a title and
// (optional) document title, and then call `update` to add the items.
export const create = (accessToken: string, createRequest: CreateFormRequest): Promise<Form> => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    // noinspection TypeScriptValidateTypes
    return axios.post<Form, AxiosResponse<Form>>('https://forms.googleapis.com/v1/forms', {
        info: createRequest
    }, {
        headers: headers
    })
        .then(response => response.data)
}

// Change the form with a batch of updates.
export const batchUpdate = (accessToken: string, formId: string, updateRequest: BatchUpdateFormRequest): Promise<BatchUpdateFormResponse> => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    // noinspection TypeScriptValidateTypes
    return axios.post<BatchUpdateFormResponse, AxiosResponse<BatchUpdateFormResponse>>(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`,
        updateRequest,
        {
            headers: headers
        })
        .then(response => response.data)
}

// Get a form.
export const getForm = (accessToken: string, formId: string): Promise<Form> => {
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
    }
    // noinspection TypeScriptValidateTypes
    return axios.get<Form, AxiosResponse<Form>>(`https://forms.googleapis.com/v1/forms/${formId}`, {
        headers: headers
    })
        .then(response => response.data)
}

// List a form's responses.
export const listResponses = (accessToken: string, formId: string): Promise<ListResponsesResponse> => {
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
    }
    // noinspection TypeScriptValidateTypes
    return axios.get<ListResponsesResponse, AxiosResponse<ListResponsesResponse>>(`https://forms.googleapis.com/v1/forms/${formId}/responses`, {
        headers: headers
    })
        .then(response => response.data)
}

// Get one response from the form.
export const getResponse = (accessToken: string, formId: string, responseId: string): Promise<FormResponse> => {
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
    }
    // noinspection TypeScriptValidateTypes
    return axios.get<FormResponse, AxiosResponse<FormResponse>>(`https://forms.googleapis.com/v1/forms/${formId}/responses/${responseId}`,{
        headers: headers
    })
        .then(response => response.data)
}

