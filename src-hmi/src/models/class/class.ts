// ------------------------------
// -- QUIZ
// ------------------------------
export const QuizType = {
    MMCQ: 'MMCQ',
    MCQ: 'MCQ', 
    TEXT: 'TEXT'
}

// The heading of a quiz
export interface Quiz {
    id: string
    iriId: string
    type: string
    title: string

    question: string

    choices: any
    choiceIds: string[]

    answer: any
    explanations: any

    justification: string
}

// a group of quiz
export interface Test {
    id: string
    title: string
    quizs: Quiz[]
}

// The global result of a group of people for a given quiz
export interface QuizRoomChoices {
    quizId: number

    choices: any[] // player id => choice
}

// ------------------------------
// -- STUDENT ATTENTION
// ------------------------------
export const AttentionEventType = {
    PANIC_START: "PANICK_START",
    PANIC_END: "PANICK_END", 
    TOO_SLOW_START: "TOO_SLOW_START", 
    TOO_SLOW_END: "TOO_SLOW_END",
    TOO_FAST_START: "TOO_FAST_START",
    TOO_FAST_END: "TOO_FAST_END"
}

export const AttentionStateType = {
    PANIC: "PANIC",
    TOO_SLOW: "TOO_SLOW",
    TOO_FAST: "TOO_FAST",
    OK: "OK"
}

export interface AttentionEvent {
    type: string,
    time: number
}

export interface CommentEvent {
    text: string
    time: number
}

export type ClassEvent = CommentEvent | AttentionEvent

export const QuizInstanceState = {
    OFF: 'OFF',
    HEADING: 'HEADING',
    FEEDBACK: 'FEEDBACK'
}

export interface QuizLauncher {
    quizId: string
    title: string
    state: number // 0: not done; 1: being run; 2: already ran 
    successRate: number
}