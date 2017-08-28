import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as CounterStore from '../store/Counter';
import * as WeatherForecasts from '../store/WeatherForecasts';
import * as AuthStore from '../store/Authenticate';

type AuthProps =
AuthStore.AuthState
& typeof AuthStore.actionCreators
& RouteComponentProps<{}>;

export default function(ComposedClass){
    class Auth extends React.Component<AuthProps, {}> {
        public render() {
            return <ComposedClass {...this.props}/>
        }
    }

    return connect(
        (state: ApplicationState) => state.auth, // Selects which state properties are merged into the component's props
        AuthStore.actionCreators                 // Selects which action creators are merged into the component's props
    )(Auth) as typeof Auth;
}