import { fetchSessionTests } from '../../../api/fetchs'

import { ActionTypes, APIActionTypes } from './actionTypes'
import { Quiz } from "../../../models/class/class"

export function chooseAction(choice: any) {
    return { type: ActionTypes.CHOOSE, payload: { choice } }
}

export function validateAction() {
    return { type: ActionTypes.VALIDATE, payload: {} }
}

export function prevQuizAction() {
    return { type: ActionTypes.PREV_CONSUL_QUIZ, payload: {} }
}

export function nextQuizAction() {
    return { type: ActionTypes.NEXT_CONSUL_QUIZ, payload: {} }
}

export function seeCorrectionAction() {
    return { type: ActionTypes.SEE_CORRECTION, payload: {} }
}

export function chooseQuizAction(quizGroupId: string, mode: string) {
    return { type: ActionTypes.CHOOSE_QUIZ, payload: { quizGroupId, mode} }
}

export function returnAction() {
    return { type: ActionTypes.RETURN_TO_CHOICES, payload: {} }
}

export function fetchTests(sessionId: string, success) {
    return dispatch => {
        dispatch({
            type: APIActionTypes.FETCH_TESTS,
            payload: {}
        })
        fetchSessionTests(sessionId,
        quizs => {
            dispatch({
                type: APIActionTypes.FETCH_TESTS_SUCCESS,
                payload: quizs
            })
            success()
        }, 
        obj => console.log(obj))
    }
}