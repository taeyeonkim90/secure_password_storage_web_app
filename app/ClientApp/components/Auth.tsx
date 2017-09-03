import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import { Redirect } from 'react-router-dom';
import * as CounterStore from '../store/Counter';
import * as WeatherForecasts from '../store/WeatherForecasts';
import * as AuthStore from '../store/Authenticate';
import axios from 'axios';

type AuthProps =
AuthStore.AuthState
& typeof AuthStore.actionCreators
& RouteComponentProps<{}>;

export default function(ComposedClass){
    class Auth extends React.Component<AuthProps, {}> {
        componentWillMount() {
            // this.props.history.push("/login");
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