import { connect } from "react-redux";

let validateAction = (id) => console.log("[remoteContainer] validateAction not implemented: " + id)
let chooseAction = (id, choice) => console.log("[remoteContainer] chooseAction not implemented")
let signalAction = (signal) => console.log("[remoteContainer] chooseAction not implemented")

import { answerAction } from "../../store/remote/actions/actions"

import { Quiz } from "../../models/class/class"

import { StateProps, ActionProps, View } from "../../views/quiz/remoteViewDesktop"

import { RemoteState } from "../../store/remote/reducers/reducer"

import { QuizInstanceState, AttentionStateType } from "../../models/class/class"

function mapStateToProps(state: any): StateProps {
    let remote: RemoteState = state.remote
    return {
        // update the quiz prop with the current quiz
        quiz: remote.quiz[state.remote.currentQuiz],
        quizChoice: remote.choice,
        showCorrection: remote.currQuizState != QuizInstanceState.HEADING,
        question: remote.currQuizState != QuizInstanceState.OFF,
        forceUnfold: false,
        score: remote.score,
        rank: remote.rank,
        population: remote.studentPop,
        highscore: remote.highscore,
        average: remote.average
    }
}

function mapDispatchToProps(dispatch, state): ActionProps {
    return {
        // signals the store that an answer has been validated
        validateAnswer: (quizId) => console.log("TODO: send answer when the validate button is pushed"),
        // signals the store that a comment has been sent
        sendComment: (comment) => console.log(comment),
        // signals the store that an answer has been chosen
        choose: (id, choice) => dispatch(chooseAction(id, choice)),
        nextQuiz: null,
        prevQuiz: null,
        signalPanic: () => dispatch(signalAction(AttentionStateType.PANIC)),
        signalSlow: () => dispatch(signalAction(AttentionStateType.TOO_SLOW)),
        signalFast: () => dispatch(signalAction(AttentionStateType.TOO_FAST))
    }
}

export default connect<StateProps, ActionProps, any>(
    mapStateToProps, 
    mapDispatchToProps
)(View)