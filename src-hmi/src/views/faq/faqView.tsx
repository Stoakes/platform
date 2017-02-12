// FAQ VIEW
// Renders a list of question and its answers, related to a chapter

// EXTERAL IMPORTS
import * as React from "react"
import { Link } from "react-router"

//INTERNAL IMPORTS
import { Thread } from "../../models/faq"
import  FaqQuestionContainer from "../../containers/faq/faqQuestionContainer"

export type StateProps = {
    //The list of question for this FAQ
    threadList:  Thread[]
    //The id of the chapter this FAQ is related to
    sessionId: number
    //The content of the input used to ask a new question
    questionValue: string
}

export interface ActionProps {
    //Get all threads from this chapter
    retrieveThreadInfos(sessionId: number)
    //Publish a new question
    publishQuestion(sessionId:number, question:string)
    //Update the store with the new content of the new question input
    changeQuestionInput(sessionId:number, changeEvent: string)
 }


export type Props = StateProps & ActionProps;
export class View extends React.Component<Props, any> {
    props: Props

    componentWillMount() {
        this.props.retrieveThreadInfos(this.props.sessionId);
    }

    render() {
        const {
            threadList, sessionId, questionValue,
            publishQuestion, changeQuestionInput
        } = this.props;

        //Render each thread of this chapter
        if (threadList) {
            var threadItem = threadList.map((item,i) => {
            return <FaqQuestionContainer 
                        key={item.id}
                        id={item.id}
                        text={item.text}
                        author={item.author}
                        date={item.date}
                        answers={item.answers} />

            });    
        }
        

        return (
            <div> 
                <div className="row">
                    <div className="col-lg-12">
                        {threadItem ? threadItem : "Il n'y a pas de question pour ce chapitre"}
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-8">
                        <input style={{width: '100%'}}  onChange={(event) => changeQuestionInput(sessionId, event.target.value)} />
                    </div>
                    <div className="col-lg-4 text-center">
                        <button className="btn btn-lg btn-primary" onClick={() => publishQuestion(sessionId,questionValue)}>Publier la question</button>
                    </div>
                </div>
            </div>
        );
    }
}