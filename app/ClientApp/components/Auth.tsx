import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import { Redirect } from 'react-router-dom';
import * as CounterStore from '../store/Counter';
import * as WeatherForecasts from '../store/WeatherForecasts';
import * as AuthStore from '../store/Authenticate';
import axios from 'axios';
import { fetch, addTask } from 'domain-task';

type AuthProps =
AuthStore.AuthState
& typeof AuthStore.actionCreators
& RouteComponentProps<{}>;

export default function(ComposedClass){
    class Auth extends React.Component<AuthProps, {}> {
        componentWillMount() {
            // get token from props
            let token = this.props.token
            // send a request to verify token validity
            let config = { headers: {'Authorization':`Bearer ${ token }`}}
            let fetchTask = axios.post(`/api/Account/Validate`, {}, config)
                .then(response => {
                    // check expiry, dispatch renewal if it is about to expire
                })
                .catch(error => {
                    this.props.logoutUser()
            })
            addTask(fetchTask)
        }
        
        componentWillReceiveProps(nextProps: AuthProps) {
            // this.props.history.push("/login");
        }

        public render() {
            if (this.props.authenticated){
                return <ComposedClass {...this.props}/>;
            } else {
                return <Redirect to="/login" push/>;
            }
        }
    }

    return connect(
        (state: ApplicationState) => state.auth, // Selects which state properties are merged into the component's props
        AuthStore.actionCreators                 // Selects which action creators are merged into the component's props
    )(Auth) as typeof Auth;
}