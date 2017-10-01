import * as React from 'react';
import { Link, NavLink, RouteComponentProps, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../../store';
import * as AuthStore from '../../store/Authenticate';
import * as css from './Register.css';

type AuthProps =
AuthStore.AuthState
& typeof AuthStore.actionCreators
& RouteComponentProps<{}>;

interface AuthState {
    email: string
    password: string
}

class Register extends React.Component<AuthProps, AuthState> {
    constructor(props){
        super(props)
        this.state = {email:'', password:''}
    }

    handleEmailChange = (event) => {
        this.setState({email: event.target.value})
    }

    handlePasswordChange = (event) => {
        this.setState({password: event.target.value})
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
        <ul className={css.errorMessageContainer}>{listItems}</ul>
      );
    }

    public render() {
        if (!this.props.authenticated) {
            // following image is from https://unsplash.com/photos/mgYAR7BzBk4
            // TODO: make sure to include this link on LICENSE
            const imageStyle = {
                backgroundImage: 'url("./img/register.jpg")',
            }

            const registerBox =
                <div className={css.registerContainer} style={imageStyle}>
                    <form className={css.registerForm} onSubmit={this.handleRegisterSubmit}>
                        <input className={css.registerElement}
                            type="text"
                            value={this.state.email}
                            onChange={this.handleEmailChange}
                            placeholder="E-mail" />
                        <input className={css.registerElement}
                            type="password"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                            placeholder="Password" />
                        <input className={css.registerButton}
                            type="submit" value="Register"/>
                        {this.displayError()}
                    </form>
                </div>;
            return registerBox;
        } else {
            return <Redirect to="/" push />;
        }
    }
}

export default connect(
    (state: ApplicationState) => state.auth, // Selects which state properties are merged into the component's props
    AuthStore.actionCreators                 // Selects which action creators are merged into the component's props
)(Register) as typeof Register;