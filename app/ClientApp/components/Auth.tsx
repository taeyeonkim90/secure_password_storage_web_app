import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import { Redirect } from 'react-router-dom';
import * as AuthStore from '../store/Authenticate';
import * as DataStore from '../store/Data';
import axios from 'axios';
import { fetch, addTask } from 'domain-task';
import * as JWT from 'jwt-decode';

interface AuthStates {
    timer: any
    count: number
}

type AuthProps =
AuthStore.AuthState
& DataStore.CardsState
& typeof AuthStore.actionCreators
& typeof DataStore.actionCreators
& RouteComponentProps<{}>;

let DEFAULT_COUNT = 30 

export default function(ComposedClass){
    class Auth extends React.Component<AuthProps, AuthStates> {
        timer = null
        count = DEFAULT_COUNT

        logout = (message:string) => {
            this.props.logoutUser(message)
            this.props.cleanUpCardsAction()
        }

        verifyToken = () => {
            if (!this.props.authFetching && this.props.authenticated){
                // get token from props
                let token = this.props.token
                // send a request to verify token validity
                let config = { headers: {'Authorization':`Bearer ${ token }`}}
                let fetchTask = axios.post(`/api/Account/Validate`, {}, config)
                    .then(response => {
                        // check expiry, dispatch renewal if it is about to expire
                        var decoded = JWT(token)
                        var exp = decoded.exp
                        var current = new Date().getTime()/1000
                        if ((exp - current) < 300){
                            this.props.refreshToken(token)
                        }
                        // reset the timer
                        this.count = DEFAULT_COUNT
                    })
                    .catch(error => {
                        if (this.props.authenticated){
                            this.logout("User has been logged out due to invalid user authorization.")    
                        }
                })
                addTask(fetchTask)
            }
        }

        timeOutTick = () => {
            (this.count < 1)
            ? this.logout("User has been logged out due to prolonged inactivity.")
            : this.count = this.count - 1
        }

        componentDidMount(){
            this.verifyToken()
            // timer interval set to 10 seconds
            this.timer = setInterval(this.timeOutTick, 10000)
        }
        
        componentWillReceiveProps(nextProps: AuthProps) {
            // Token will be verified only when we receive data from the backend to prevent firing double verification
            if (!this.props.dataFetching){
                this.verifyToken()
            }
        }

        componentWillUnmount(){
            this.timer && clearInterval(this.timer)
        }

        public render() {
            if (this.props.authenticated){
                return <ComposedClass {... this.props}/>;
            } else {
                return <Redirect to="/login" push/>;
            }
        }
    }

    return connect(
        (state: ApplicationState) => {
            const {auth, data} = state
            return { ...auth, ...data }
        },
        {... AuthStore.actionCreators, ... DataStore.actionCreators}
    )(Auth) as typeof Auth;
}