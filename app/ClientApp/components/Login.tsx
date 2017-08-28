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

export default class Login extends React.Component<AuthProps, {}> {
    public render() {
        return <div>
            <h1>Counter</h1>
        </div>;
    }
}