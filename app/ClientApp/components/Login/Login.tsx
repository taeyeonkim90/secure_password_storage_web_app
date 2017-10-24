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

    handleKeyPress = (event) => {
        if (event.key === "Enter"){
            this.props.loginUser(this.state.email, this.state.password)
        }
    }
    
    renderAppLogo = () => {
        return (
            <img className={s.appLogo} src="img/GMK_logo.png"></img>
        )
    }

    renderErrors = () => {
        var messages = this.props.authMessages
        const listItems = messages.map((message, i) =>
            <li key={i}>{message}</li>
        );
        if (messages.length > 0 && messages[0]!="") {
            return (
                <ul className={s.errorMessageContainer}>{listItems}</ul>
            );
        }
    }

    renderLoadingBar = () => {
        if(this.props.authFetching){
            return (
                <img className={s.loading} src="img/loading.gif"></img> 
            );
        }
    }

    renderRegisterLink = () => {
        return <NavLink to={ '/register' } activeClassName='active'>
                <p className={s.register} onClick={()=>this.props.errorMessage("")}>Don't have an account? Click here to register</p>
            </NavLink>
    }

    public render() {
        if (!this.props.authenticated) {
            // following image is from https://unsplash.com/photos/PjABCLdM6DY
            // TODO: make sure to include this link on LICENSE
            const loginBox =
                <div>
                    <div className={`${s.fixedBar} ${s.topBar}`}></div>
                    <div className={s.loginContainer}>
                        <div className={s.loginForm}>
                            {this.renderAppLogo()}
                                <div className={s.loginElementContainer}>
                                    <input name="email" onKeyPress={this.handleKeyPress} className={s.loginElement}
                                        type="text"
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                        placeholder="E-mail" />
                                </div>
                                <div className={s.loginElementContainer}>
                                    <input name="password" onKeyPress={this.handleKeyPress} className={s.loginElement}
                                        type="password"
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                        placeholder="Password" />
                                    <button className={s.loginIcon} onClick={this.handleLoginSubmit}>
                                        <i className="material-icons">search</i>
                                    </button>
                                </div>
                            {this.renderRegisterLink()}
                            {this.renderErrors()}
                            {this.renderLoadingBar()}
                        </div>
                    </div>
                    <div className={`${s.fixedBar} ${s.bottomBar}`}></div>
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