import * as React from 'react';
import { Link, NavLink, RouteComponentProps, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as AuthStore from '../../store/Authenticate';
import * as s from './Login.css';

type AuthProps =
    AuthStore.AuthState
    & typeof AuthStore.actionCreators
    & RouteComponentProps<{}>;

interface AuthState {
    email: string
    password: string
}

class Login extends React.Component<AuthProps, AuthState> {
    constructor(props) {
        super(props)
        this.state = { email: '', password: '' }
    }

    handleEmailChange = (event) => {
        this.setState({ email: event.target.value })
    }

    handlePasswordChange = (event) => {
        this.setState({ password: event.target.value })
    }

    handleRegisterSubmit = (event) => {
        event.preventDefault()
        this.props.registerUser(this.state.email, this.state.password)
    }

    handleLoginSubmit = (event) => {
        event.preventDefault()
        this.props.loginUser(this.state.email, this.state.password)
    }

    displayError = () => {
        var messages = this.props.message
        const listItems = messages.map((message) =>
            <li>{message}</li>
        );
        return (
            <ul className={s.errorMessageContainer}>{listItems}</ul>
        );
    }

    public render() {
        if (!this.props.authenticated) {
            // following image is from https://unsplash.com/photos/PjABCLdM6DY
            // TODO: make sure to include this link on LICENSE
            const imageStyle = {
                backgroundImage: 'url("./img/login.jpg")',
            }

            const loginBox =
                <div className={s.loginContainer} style={imageStyle}>
                    <form className={s.loginForm} onSubmit={this.handleLoginSubmit}>
                        <input className={s.loginElement}
                            type="text"
                            value={this.state.email}
                            onChange={this.handleEmailChange}
                            placeholder="E-mail" />
                        <input className={s.loginElement}
                            type="password"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                            placeholder="Password" />
                        <input className={s.loginButton}
                            type="submit" value="Login"/>
                        {this.displayError()}
                    </form>
                </div>;
            return loginBox;
        } else {
            return <Redirect to="/" push />;
        }
    }
}

export default connect(
    (state: ApplicationState) => state.auth, // Selects which state properties are merged into the component's props
    AuthStore.actionCreators                 // Selects which action creators are merged into the component's props
)(Login) as typeof Login;