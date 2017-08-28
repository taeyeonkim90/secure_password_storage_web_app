import * as React from 'react';
import { Link, NavLink, RouteComponentProps } from 'react-router-dom';
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
            <h1>Login</h1>
            <li>
                <NavLink exact to={ '/' } activeClassName='active'>
                    <span className='glyphicon glyphicon-home'></span> Home
                </NavLink>
            </li>
        </div>;
    }
}