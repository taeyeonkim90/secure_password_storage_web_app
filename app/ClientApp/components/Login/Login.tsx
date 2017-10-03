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

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
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
                        <input name="email" className={s.loginElement}
                            type="text"
                            value={this.state.email}
                            onChange={this.handleChange}
                            placeholder="E-mail" />
                        <input name="password" className={s.loginElement}
                            type="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            placeholder="Password" />
                        <input className={s.loginButton}
                            type="submit" value="Login"/>
                        <NavLink to={ '/register' } activeClassName='active'>
                        <input className={s.registerRedirectButton}
                            type="button"
                             value="Register"/>
                        </NavLink>
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