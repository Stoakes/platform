import { connect } from "react-redux"
import * as React from "react"
import * as _ from "underscore"

import { startMainLoad, endMainLoad } from "../store/navigation/actions"

import { auth } from "../store/auth/actions"

import { id, username, password } from "../models/consts"

export default function rootWrapper(mapState, mapDispatch, mergeProps, fn: (props, done: () => void) => void, Component) {
    function mapStateToProps(state) {
        return { 
            mainLoading: state.navigation.mainLoading
        }
    }
    function mapDispatchToProps(dispatch) {
        return {
            startMainLoad: () => dispatch(startMainLoad()),
            endMainLoad: () => dispatch(endMainLoad()),
            auth: (promise) => dispatch(auth(id, username, password, promise))
        }
    }

    class Wrapper extends React.Component<any, any> {
        componentWillMount () {
            this.props.startMainLoad()
            this.props.auth(() => {
                if(fn) { 
                    fn(this.props, () => this.props.endMainLoad()) 
                } else {
                    this.props.endMainLoad()
                }
            })
        }

        componentDidUpdate (prevProps) {
            if (!_.isEqual(this.props.params, prevProps.params)) {
                console.log("did update", this.props.params, prevProps.params)
                this.props.startMainLoad()
                if(fn) { 
                    fn(this.props, () => this.props.endMainLoad()) 
                } else {
                    this.props.endMainLoad()
                }
            }
        }

        render () { 
            return (!this.props.mainLoading ? 
                <Component {...this.props} /> : 
                <div className="loader" style={ { } }></div>) 
        }
    }
        
    if(mapState) {
        if(mergeProps) {
            return connect<any, any, any>( 
                mapStateToProps,
                mapDispatchToProps
            )(connect<any, any, any>(
                mapState,
                mapDispatch,
                mergeProps
            )(Wrapper))
        } else {
            return connect<any, any, any>( 
                mapStateToProps,
                mapDispatchToProps
            )(connect<any, any, any>(
                mapState,
                mapDispatch
            )(Wrapper))
        }
    } else {
        return connect<any, any, any>( 
            mapStateToProps,
            mapDispatchToProps
        )(Wrapper)
    }
}
