import { handleActions } from "redux-actions"

import { ActionTypes, APIActionTypes, WSInActionTypes, WSOutActionTypes } from '../actions/actionTypes'

import { QuizInstanceState, Quiz, AttentionStateType, QuizType } from '../../../models/class/class'

export interface RemoteState {
    attentionState: string,

    sessionId: string
    quiz: Quiz[]

    quizHistory: string[]
    currConsulQuizInd: number

    currQuizId: string
    iriSessionId: string
    currQuizState: string
    choice: any
    sent: boolean

    score: number
    rank: number
    studentPop: number
    highscore: number
    maxscore: number
    average: number
}

let initialstate: RemoteState = {
    attentionState: AttentionStateType.OK,

    sessionId: null,
    iriSessionId: null,
    quiz: [],

    quizHistory: [],
    currConsulQuizInd: -1,

    currQuizId: null,
    currQuizState: QuizInstanceState.OFF,
    
    choice: -1,
    sent: false,

    score: 0,
    rank: 0,
    studentPop: 0,
    highscore: 0,
    maxscore: 0,
    average: 0
}

const name = "remote"
const reducer = handleActions({
    [ActionTypes.CHOOSE]: function(state: RemoteState, action: any): RemoteState {
        let type = state.quiz[state.currQuizId].type,
            choice = state.choice

        if(type == QuizType.MCQ) {
            if(choice == action.payload.choice) {
                choice = -1
            } else {
                choice = action.payload.choice
            }

            return Object.assign({}, state, {
                choice
            })
        } else if(type == QuizType.TEXT) {
            choice = action.payload.choice

            return Object.assign({}, state, {
                choice
            })
        } else if(type == QuizType.MMCQ) {
            if(!choice) {
                choice = []
            }
            if(choice.indexOf(action.payload.choice) >= 0) {
                choice.splice(choice.indexOf(action.payload.choice), 1)
            } else {
                choice.push(action.payload.choice)
            }

            return Object.assign({}, state, {
                choice: Object.assign([], choice)
            })
        }
    },
    [ActionTypes.NEXT_CONSUL_QUIZ]: function(state: RemoteState, action: any): RemoteState {
        let len = state.quizHistory.length
        
        if(len > 0 && state.currConsulQuizInd < len - 1) {
            return Object.assign({}, state, {
                currConsulQuizInd: state.currConsulQuizInd + 1
            })
        } else {
            return state
        }
    },
    [ActionTypes.PREV_CONSUL_QUIZ]: function(state: RemoteState, action: any): RemoteState {
        if(state.quizHistory.length > 0 && state.currConsulQuizInd > 0) {
            return Object.assign({}, state, {
                currConsulQuizInd: state.currConsulQuizInd - 1
            })
        } else {
            return state
        }
    },
    [WSOutActionTypes.ANSWER]: function(state: RemoteState, action: any): RemoteState {
        return Object.assign({}, state, {
            sent: true
        })
    },
    [WSOutActionTypes.SIGNAL_STATE]: function(state: RemoteState, action: any): RemoteState {
        return Object.assign({}, state, {
            attentionState: action.payload.state
        })
    },
    [WSInActionTypes.START_QUIZ]: function(state: RemoteState, action: any): RemoteState {
        if(state.currQuizId) {
            return Object.assign({}, state, {
                quiz: Object.assign({}, state.quiz, {
                    [action.payload.quiz.id]: action.payload.quiz
                }),
                quizHistory: [...state.quizHistory, state.currQuizId],
                currQuizId: action.payload.quiz.id,
                currQuizState: QuizInstanceState.HEADING,
                choice: action.payload.quiz.type == QuizType.MMCQ ? [] : null,
                choiceId: null,
                currConsulQuizInd: state.quizHistory.length - 1,
                sent: false
            })
        } else {
            return Object.assign({}, state, {
                quiz: Object.assign({}, state.quiz, {
                    [action.payload.quiz.id]: action.payload.quiz
                }),
                currQuizId: action.payload.quiz.id,
                currQuizState: QuizInstanceState.HEADING,
                choice: action.payload.quiz.type == QuizType.MMCQ ? [] : null,
                choiceId: null,
                sent: false
            })
        }
    },
    [WSInActionTypes.SHOW_FEEDBACK]: function(state: RemoteState, action: any): RemoteState {
        return Object.assign({}, state, {
            currQuizState: QuizInstanceState.FEEDBACK
        })
    },
    [WSInActionTypes.STOP_QUIZ]: function(state: RemoteState, action: any): RemoteState {
        if(state.currQuizId != null) {        
            return Object.assign({}, state, {
                quizHistory: [...state.quizHistory, state.currQuizId],
                currQuizId: null,
                currQuizState: QuizInstanceState.OFF,
                choice: null,
                currConsulQuizInd: state.quizHistory.length - 1
            })
        } else {
            return state
        }
    },
    [WSInActionTypes.STATE_UPDATE]: function(state: RemoteState, action: any): RemoteState {
        return Object.assign({}, state, {
            score: action.payload.score,
            rank: action.payload.rank,
            studentPop: action.payload.studentPop,
            highscore: action.payload.highscore,
            maxscore: action.payload.maxscore,
            average: action.payload.average
        })
    },
    [WSInActionTypes.CLASS_JOINED]: function(state: RemoteState, action: any): RemoteState {
        let obj = {}
        action.payload.quiz.forEach(quiz => {
            obj[quiz.id] = quiz
        })
        return Object.assign({}, state, {
            attentionState: AttentionStateType.OK,
            
            sessionId: action.payload.sessionId,
            iriSessionId: action.payload.iriSessionId,
            quiz: obj,

            quizHistory: action.payload.quizHistory,
            currConsulQuizInd: action.payload.quizHistory.length - 1,

            currQuizId: action.payload.currQuizId,
            currQuizState: action.payload.currQuizState,
            choice: obj[action.payload.currQuizId] && 
                    (obj[action.payload.currQuizId].type == QuizType.MMCQ ? [] : null),
            choiceId: null,

            score: 0,
            rank: 0,
            studentPop: action.payload.studentPop,
            highscore: action.payload.highScore,
            maxscore: action.payload.maxscore,
            average: action.payload.average,

            sent: action.payload.sent
        })
    },
    [WSInActionTypes.STUDENT_COUNT]: function(state: RemoteState, action: any): RemoteState {
        return Object.assign({}, state, {
            studentPop: action.payload.studentPop
        })
    },
    [APIActionTypes.ANSWER_SUCCESS]: function(state: RemoteState, action: any): RemoteState {
        return state
    }
}, initialstate);

export default { [name]: reducer }