import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import * as ReactDOM from 'react-dom'
import * as React from 'react'
import * as createLogger from 'redux-logger';
import { apiMiddleware } from 'redux-api-middleware'
import { CALL_API } from 'redux-api-middleware';

import createSocketIoMiddleware from 'redux-socket.io'
import * as io from 'socket.io-client'
    
import authInfo from '../store/auth/reducer'
import { auth, authWS } from '../store/auth/actions'

const urlWS = "localhost"
const portWS = "8088"

const url = urlWS + ":" + portWS

// -- ACTION CREATOR HELPERS
export interface Action<T>{
	type: string
	payload: T
    error?: boolean
}

// -- STORE CREATOR HELPER
export const storeFactory = (reducers: any[], connectWS: boolean, log: boolean) => {
    let socket = connectWS ? io.connect(url) : null,
        reducers2 = Object.assign({}, authInfo), len = reducers.length,
        reducer

    // CREATING MAIN REDUCER
    for(let i = 0; i < len; i++) {
        Object.assign(reducers2, reducers[i])
    }
	reducer = combineReducers(reducers2)

    // GENERATING
    let middlewares = [thunk]

    middlewares.push(apiMiddleware)
    if(socket) { middlewares.push(createSocketIoMiddleware(socket, 'SERVER/')) }
    if(log) { middlewares.push(createLogger()) }

    let store = createStore(
        reducer,
        applyMiddleware(...middlewares)
    );

    (store as any).dispatch(auth('abeyet', 'abab'))

    let i = setInterval(() => {
        if(isAuthentified()) {
            (store as any).dispatch(authWS(0, 'abeyet', false))
            clearInterval(i)
        }
    }, 500)

    return store
}

// -- TEST HELPER
export function viewTestFactory<T>(View: any, props: T) {
    ReactDOM.render(React.createElement(View, props), document.getElementById('main'))
}

export function apiTestFactory<T>(actionCreator, endpointInfo, body) {
    let store = storeFactory([ 
        authInfo
    ], true, true)

    let i = setInterval(() => {
        if(isAuthentified()) {
            store.dispatch(actionCreator(endpointInfo, body))
            clearInterval(i)
        }
    }, 100)
}

// Get text from an element with a certain id
export function getText(id: string): string {
    return (document.getElementById(id) as any).value
}

// -- API ACTION CREATOR FACTORY
export function createAPIActionCreator(
    endpointFactory:(obj: any) => string, method: string, action: string, success: string, failure: string) {
    return (endpointInfo, body) => {
        let actionObj = {
            [CALL_API]: {
                endpoint: endpointFactory(endpointInfo),
                method: method,
                types: [
                    action, 
                    success, 
                    failure
                ]
            }
        }

        if(body) { 
            (actionObj as any)[CALL_API].body = JSON.stringify(body) 
        }
        if((document as any).token) { 
            (actionObj as any)[CALL_API].headers = {
                'Authorization': 'Bearer ' + (document as any).token
            }
        }

        return actionObj
    }
}

export function isAuthentified(): boolean { 
    return (document as any).token != null
}