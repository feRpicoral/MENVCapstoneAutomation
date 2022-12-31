// A Google Forms document.
export interface Form {
    // Output only. The form ID.
    formId?: string,
    // Required. The title and description of the form.
    info: Info,
    // Required. A list of the form's items, which can include section headers, questions, embedded media, etc.
    items: Item[]
    // Output only. The revision ID of the form. Used in the WriteControl in update requests to identify the revision on which the changes are based.
    // The format of the revision ID may change over time, so it should be treated opaquely.
    // A returned revision ID is only guaranteed to be valid for 24 hours after it has been returned and
    // cannot be shared across users. If the revision ID is unchanged between calls, then the form has not changed.
    // Conversely, a changed ID (for the same form and user) usually means the form has been updated; however,
    // a changed ID can also be due to internal factors such as ID format changes.
    revisionId?: string,
    // Output only. The form URI to share with responders. This opens a page that allows the user to submit responses but not edit the questions.
    responderUri?: string,
    // Output only. The ID of the linked Google Sheet which is accumulating responses from this Form (if such a Sheet exists).
    linkedSheetId?: string,
}

// The general information for a form.
export interface Info {
    // Required. The title of the form which is visible to responders.
    title: string,
    // Output only. The title of the document which is visible in Drive.
    // If `Info.title` is empty, `documentTitle` may appear in its place in the Google Forms UI and be visible to responders.
    // `documentTitle` can be set on create, but cannot be modified by a batchUpdate request.
    // Please use the Google Drive API if you need to programmatically update `documentTitle`.
    documentTitle?: string,
    // The description of the form.
    description?: string
}

// A single item of the form. `kind` defines which kind of item it is.
export interface Item {
    // The item ID.
    // On creation, it can be provided but the ID must not be already used in the form. If not provided, a new ID is assigned.
    itemId?: string,
    // The title of the item.
    title?: string,
    // The description of the item.
    description?: string,

    // Question 'kind'; can only include one of the following
    // Poses a question to the user.
    questionItem?: QuestionItem,
    // Poses one or more questions to the user with a single major prompt.
    questionGroupItem?: QuestionGroupItem,
    // Starts a new page with a title.
    pageBreakItem?: PageBreakItem,
    // Displays a title and description on the page.
    textItem?: TextItem,
    // Displays an image on the page.
    imageItem?: ImageItem,
    // Displays a video on the page.
    videoItem?: VideoItem
}

// A form item containing a single question.
export interface QuestionItem {
    // Required. The displayed question.
    question: Question,
    // The image displayed within the question.
    image?: Image
}

// Any question. The specific type of question is known by its `kind`.
export interface Question {
    // Read only. The question ID.
    // On creation, it can be provided but the ID must not be already used in the form. If not provided, a new ID is assigned.
    questionId?: string,
    // Whether the question must be answered in order for a respondent to submit their response.
    required?: boolean,

    // Union field `kind`. Required. The type of question offered to a respondent. `kind` can be only one of the following:
    // A respondent can choose from a pre-defined set of options.
    choiceQuestion?: ChoiceQuestion,
    // A respondent can enter a free text response.
    textQuestion?: TextQuestion,
    // A respondent can choose a number from a range.
    scaleQuestion?: ScaleQuestion,
    // A respondent can enter a date.
    dateQuestion?: DateQuestion,
    // A respondent can enter a time.
    timeQuestion?: TimeQuestion,
    // A row of a `QuestionGroupItem`.
    rowQuestion?: RowQuestion
}

// A radio/checkbox/dropdown question.
export interface ChoiceQuestion {
    // Required. The type of choice question.
    type: 'RADIO' | 'CHECKBOX' | 'DROP_DOWN'
    // Required. List of options that a respondent must choose from.
    options: Option[]
    // Whether the options should be displayed in random order for different instances of the quiz.
    // This is often used to prevent cheating by respondents who might be looking at another respondent's screen,
    // or to address bias in a survey that might be introduced by always putting the same options first or last.
    shuffle?: boolean
}

// An option for a Choice question.
export interface Option {
    // Required. The choice as presented to the user.
    value: string,
    // Display image as an option.
    image?: Image,
    // Whether the option is "other". Currently only applies to `RADIO` and `CHECKBOX` choice types,
    // but is not allowed in a `QuestionGroupItem`.
    isOther?: boolean,

    // Union field `go_to_section`. Which section to go to if this option is selected.
    // Currently only applies to `RADIO` and `SELECT` choice type, but is not allowed in a `QuestionGroupItem`.
    // `go_to_section` can be only one of the following:

    // Section navigation type.
    goToAction?: 'NEXT_SECTION' | 'RESTART_FORM' | 'SUBMIT_FORM'
    // Item ID of section header to go to.
    goToSectionId?: string
}

// Data representing an image.
export interface Image {
    // Output only. A URI from which you can download the image; this is valid only for a limited time.
    contentUri?: string,
    // A description of the image that is shown on hover and read by screenreaders.
    altText?: string,
    // Properties of an image.
    properties?: MediaProperties,
    // Input only. The source URI is the URI used to insert the image. The source URI can be empty when fetched.
    sourceUri?: string
}

// Properties of the media.
export interface MediaProperties {
    // Position of the media.
    alignment?: 'LEFT' | 'RIGHT' | 'CENTER'
    // The width of the media in pixels. When the media is displayed, it is scaled to
    // the smaller of this value or the width of the displayed form.
    // The original aspect ratio of the media is preserved.
    // If a width is not specified when the media is added to the form, it is set to the width of the media source.
    // Width must be between 0 and 740, inclusive. Setting width to 0 or unspecified is only permitted
    // when updating the media source.
    width?: number
}

// A text-based question.
export interface TextQuestion {
    // Whether the question is a paragraph question or not. If not, the question is a short text question.
    paragraph?: boolean
}

// A scale question. The user has a range of numeric values to choose from.
export interface ScaleQuestion {
    // Required. The lowest possible value for the scale.
    low: number,
    // Required. The highest possible value for the scale.
    high: number,
    // The label to display describing the lowest point on the scale.
    lowLabel?: string,
    // The label to display describing the highest point on the scale.
    highLabel?: string,
}

// A date question. Date questions default to just month + day.
export interface DateQuestion {
    // Whether to include the time as part of the question.
    includeTime?: boolean,
    // Whether to include the year as part of the question.
    includeYear?: boolean
}

// A time question.
export interface TimeQuestion {
    // `true` if the question is about an elapsed time. Otherwise it is about a time of day.
    duration?: boolean
}

// Configuration for a question that is part of a question group.
export interface RowQuestion {
    // Required. The title for the single row in the `QuestionGroupItem`.
    title: string
}

// Defines a question that comprises multiple questions grouped together.
export interface QuestionGroupItem {
    // Required. A list of questions that belong in this question group. A question must only belong to one group.
    // The kind of the group may affect what types of questions are allowed.
    questions: Question[],
    // The image displayed within the question group above the specific questions.
    image?: Image,
    // The question group is a grid with rows of multiple choice questions that share the same options.
    // When grid is set, all questions in the group must be of kind row.
    grid?: Grid
}

// A grid of choices (radio or check boxes) with each row constituting a separate question. Each row has the same choices, which are shown as the columns.
export interface Grid {
    // Required. The choices shared by each question in the grid. In other words, the values of the columns.
    // Only CHECK_BOX and RADIO choices are allowed.
    columns: ChoiceQuestion,
    // If `true`, the questions are randomly ordered. In other words, the rows appear in a different order for every respondent.
    shuffleQuestions?: boolean
}

// A page break. The title and description of this item are shown at the top of the new page.
export interface PageBreakItem {}

// A text item.
export interface TextItem {}

// An item containing an image.
export interface ImageItem {
    // Required. The image displayed in the item.
    image: Image
}

// An item containing a video.
export interface VideoItem {
    // Required. The video displayed in the item.
    video: Video,
    // The text displayed below the video.
    caption?: string,
}

// Data representing a video.
export interface Video {
    // Required. A YouTube URI.
    youtubeUri: string,
    // Properties of a video.
    properties?: MediaProperties
}

/////////////////////////////////////////////

export interface Location { index: number }

export interface Request {
    updateFormInfo?: UpdateFormInfoRequest,
    createItem?: CreateItemRequest,
    moveItem?: MoveItemRequest,
    deleteItem?: DeleteItemRequest,
    updateItem?: UpdateItemRequest
}

export interface UpdateFormInfoRequest {
    info?: Info,
    updateMask: string
}

export interface CreateItemRequest {
    item: Item,
    location: Location
}

export interface MoveItemRequest {
    originalLocation: Location,
    newLocation: Location
}

export interface DeleteItemRequest {
    location: Location
}

export interface UpdateItemRequest {
    item: Item,
    location: Location,
    updateMask: string
}

// union type.
export interface WriteControl {
    // The revision ID of the form that the write request is applied to. If this is not the latest revision of the form,
    // the request is not processed and returns a 400 bad request error.
    requiredRevisionId?: string,
    // The target revision ID of the form that the write request is applied to.
    // If changes have occurred after this revision, the changes in this update request are transformed against those changes.
    // This results in a new revision of the form that incorporates both the changes in the request and the intervening changes,
    // with the server resolving conflicting changes.
    // The target revision ID may only be used to write to recent versions of a form.
    // If the target revision is too far behind the latest revision, the request is not processed and returns
    // a 400 (Bad Request Error). The request may be retried after reading the latest version of the form.
    // In most cases a target revision ID remains valid for several minutes after it is read,
    // but for frequently-edited forms this window may be shorter.
    targetRevisionId?: string
}

export interface Response {
    createItem?: CreateItemResponse
}

export interface CreateItemResponse {
    itemId: string,
    questionId: string[]
}

/////////////////////////////////////////////

export interface FormResponse {
    formId: string,
    responseId: string,
    // When the response was first submitted
    // A timestamp in RFC3339 UTC "Zulu" format
    createTime: string,
    // When the response was last submitted (for edits)
    // A timestamp in RFC3339 UTC "Zulu" format
    lastSubmittedTime: string,
    respondentEmail: string,
    answers: Map<string, Answer>
}

export interface Answer {
    questionId: string,
    textAnswers: {
        answers: TextAnswer[]
    }
}

export interface TextAnswer {
    // Formatting used for different kinds of question:
    // ChoiceQuestion
    //      RADIO or DROP_DOWN: A single string corresponding to the option that was selected.
    //      CHECKBOX: Multiple strings corresponding to each option that was selected.
    // TextQuestion: The text that the user entered.
    // ScaleQuestion: A string containing the number that was selected.
    // DateQuestion
    //      Without time or year: MM-DD e.g. "05-19"
    //      With year: YYYY-MM-DD e.g. "1986-05-19"
    //      With time: MM-DD HH:MM e.g. "05-19 14:51"
    //      With year and time: YYYY-MM-DD HH:MM e.g. "1986-05-19 14:51"
    // TimeQuestion: String with time or duration in HH:MM format e.g. "14:51"
    // RowQuestion within QuestionGroupItem: The answer for each row of a QuestionGroupItem is represented as a separate Answer.
    // Each will contain one string for RADIO-type choices or multiple strings for CHECKBOX choices.
    value: string
}

/////////////////////////////////////////////

export interface CreateFormRequest {
    // see `Info`.
    title: string,
    documentTitle?: string
}

export interface BatchUpdateFormRequest {
    includeFormInResponse?: boolean,
    requests: Request[]
    writeControl?: WriteControl
}

export interface BatchUpdateFormResponse {
    form: Form,
    replies: Response[],
    writeControl: WriteControl
}

export interface ListResponsesResponse {
    responses: FormResponse[]
    nextPageToken: string
}