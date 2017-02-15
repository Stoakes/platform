export const ActionTypes = {
    CHOOSE: "QUIZ/CHOOSE",

    NEXT_CONSUL_QUIZ: "QUIZ/NEXT_QUIZ",
    PREV_CONSUL_QUIZ: "QUIZ/PREVIOUS_QUIZ"
}

export const APIActionTypes = {
    ANSWER: "REMOTE/ANSWER",
    ANSWER_SUCCESS: "REMOTE/ANSWER_SUCCESS",
    ANSWER_FAILURE: "REMOTE/ANSWER_FAILURE",

    SIGNAL_STATE: "REMOTE/SIGNAL_STATE",
    SIGNAL_STATE_SUCCESS: "REMOTE/SIGNAL_STATE_SUCCESS",
    SIGNAL_STATE_FAILURE: "REMOTE/SIGNAL_STATE_FAILURE",

    COMMENT: "REMOTE/COMMENT",
    COMMENT_SUCCESS: "REMOTE/COMMENT_SUCCESS",
    COMMENT_FAILURE: "REMOTE/COMMENT_FAILURE",
}

export const WSOutActionTypes = {
    ANSWER: "SERVER/ANSWER",
    SIGNAL_STATE: "SERVER/SIGNAL_STATE"
}

export const WSInActionTypes = {
    CLASS_JOINED: "STUDENT/CLASS/CLASS_JOINED",
    STATE_UPDATE: "STUDENT/CLASS/STATE_UPDATE",
    
    START_QUIZ: "STUDENT/CLASS/START_QUIZ",
    STOP_QUIZ: "STUDENT/CLASS/STOP_QUIZ",
    SHOW_FEEDBACK: "STUDENT/CLASS/SHOW_FEEDBACK",

    STUDENT_COUNT: "STUDENT/CLASS/STUDENT_COUNT",
}