import * as React from 'react';
import { Link, NavLink, RouteComponentProps, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as AuthStore from '../../store/Authenticate';
import * as s from './Login.css';
import Loading from '../Loading/Loading';

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
            <NavLink to={ '/login' } onClick={()=>this.props.errorMessage("")} activeClassName='active'>
                <img className={s.appLogo} src="/img/logovertical.png"></img>
            </NavLink>
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
                <Loading/>
            );
        }
    }

    renderRegisterLink = () => {
        return  <p className={s.register}>Don't have an account? Click{' '} 
                    <NavLink onClick={()=>this.props.logoutUser("")} to={'/register'} activeClassName='active'>here</NavLink>
                    {' '}to register
                </p>
    }

    public render() {
        if (!this.props.authenticated) {
            const loginBox =
                    <div className={s.loginContainer}>
                        <form className={s.loginForm} onSubmit={this.handleLoginSubmit}>
                            {this.renderAppLogo()}
                                <div className={s.loginElementContainer}>
                                    <input name="email" className={s.loginElement}
                                        type="text"
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                        placeholder="E-mail" />
                                </div>
                                <div className={s.loginElementContainer}>
                                    <input name="password" className={s.loginElement}
                                        type="password"
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                        placeholder="Password" />
                                    <button className={s.loginIcon} >
                                        <i className="material-icons green">keyboard_return</i>
                                    </button>
                                </div>
                            {this.renderErrors()}
                            {this.renderRegisterLink()}
                            {this.renderLoadingBar()}
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