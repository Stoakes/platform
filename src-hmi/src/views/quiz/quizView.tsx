// QUIZ VIEW
// Renders a question and his potential answers

// EXTERAL IMPORTS
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router"
import * as MediaQuery from "react-responsive"

// INTERNAL IMPORTS
import { View as AnswerView} from "./answerView"
import { QuizType, Quiz } from "../../models/class/class"
import { getText } from "../../utils/index"

export interface StateProps {
    // the quiz 
    quiz: Quiz
    // the quiz choice
    quizChoice: any
    // true => show the correction
    showCorrection: boolean
    // true => answer explanations will be shown automatically, else we have to click on the answers
    forceUnfold: boolean
}
export interface ActionProps {
    // select an answer (if null, there will be no validate button and no answer will be able to be selected)
    choose(choice: any)
    // validate the answer
    validate()
    // go to the next question
    nextQuiz()
    // go to the previous question
    prevQuiz()
    // go back
    back()
}

// style for the text
var bigSizeText = {
    fontSize: 50
}
var mediumSizeText = {
    fontSize: 30
}

// Style for the text field
var inputFieldStyle = {
    height:"50px",
    fontSize:"30pt"
}
// Style for the text
var bigSizeText = {
    fontSize: 50
}
// Style for the text
var mediumSizeText = {
    fontSize: 30
}

export type Props = StateProps & ActionProps;
export class View extends React.Component<Props, any> {
    props: Props

    render() {
        const {
            quiz,
            quizChoice,
            showCorrection,
            forceUnfold,

            choose, 
            validate,
            nextQuiz,
            prevQuiz,
            back
        } = this.props

        // the render of the answers can be different according to the type of quiz (MCQ, open question)
        let answers = null
        switch(quiz.type) {
            // the render is a list of AnswerView (radio button and answer text)
            case QuizType.MMCQ:
            case QuizType.MCQ: 
                answers = (<ul>{ quiz.choices.map((item, i) => {
                    return <AnswerView
                        key={ i }
                        ind={ i } 
                        text={ item } 
                        chosen={ quizChoice && quiz.type == QuizType.MMCQ ? quizChoice.indexOf(i) >= 0 : quizChoice == i } 
                        rightAnswer={ quiz.type == QuizType.MMCQ ? quiz.answer.indexOf(i) >= 0 : quiz.answer == i }
                        explanation={ quiz.explanations[i] } 
                        showCorrection={ showCorrection }
                        forceUnfold={ forceUnfold }
                        choose={ choose == null ? () => { }: () => { choose(i) } } 
                    />
                }) }</ul>)
            break
            // the render is a text field
            case QuizType.TEXT:
                answers =
                (<input id="quiz-text" 
                        type="text" 
                        value={ quizChoice }
                        style={ inputFieldStyle }
                        onChange={ () => choose(getText("quiz-text")) }> 
                </input>)
            break
        }

        // a question with its answers
        let questionRender = (
            <div>
                <h3 style={ bigSizeText }>{ quiz.question }</h3>
                <br/>
                { answers }
                { showCorrection && <h3> { quiz.justification } </h3> }
            </div>
        )

        // back button
        let backButtonRender = []
        if (back) {
            backButtonRender.push(
                <button className="btn btn-primary" onClick={ back }>
                    Retour
                </button>
            )
        }
        
        // buttons
        var buttonsRender = []
        if (prevQuiz) {
            buttonsRender.push(
                <button className="btn btn-primary" onClick={ prevQuiz }>
                    Précédent
                </button>
            )
        }
        if (choose) {
            buttonsRender.push(
                <button className="btn btn-success" onClick={ validate }>
                    Valider réponse
                </button>
            )
        }
        if (nextQuiz) {
            // if we are in answer mode (showcorrection is false) we display skip question
            // else we display next
            buttonsRender.push(
                <button className="btn btn-primary" onClick={ nextQuiz }>
                    { showCorrection ? "Suivant" : "Passer la question" }
                </button>
            )
        }

        let quizRender = (
            <div className="row">
                <div className="col-lg-12">
                    { questionRender }
                </div>
            </div>  
        )
               
        // returns a panel containing the question and the answers defined above
        return (
            <div>
                <div className="panel">
                    <div className="pal">
                        { quizRender } 
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="pull-left">
                                    { backButtonRender }
                                </div>
                                <div className="pull-right">
                                    { buttonsRender }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}