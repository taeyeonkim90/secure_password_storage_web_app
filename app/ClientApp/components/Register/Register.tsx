import * as React from 'react';
import { Link, NavLink, RouteComponentProps, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../../store';
import * as AuthStore from '../../store/Authenticate';
import * as css from './Register.css';
import Loading from '../Loading/Loading';

type AuthProps =
AuthStore.AuthState
& typeof AuthStore.actionCreators
& RouteComponentProps<{}>;

interface AuthState {
    email: string
    password: string
    passwordMatch: string
}

class Register extends React.Component<AuthProps, AuthState> {
    constructor(props){
        super(props)
        this.state = {email:'', password:'', passwordMatch: ''}
    }

    handleEmailChange = (event) => {
        this.setState({email: event.target.value})
    }
    
    handlePasswordMatchChange = (event) => {
        this.setState({[event.target.name]: event.target.value}, () => {
            if (this.state.password == "" || this.state.passwordMatch == ""){
                this.props.errorMessage("")
            }
            else if (this.state.password != this.state.passwordMatch) {
                this.props.errorMessage("Two passwords do not match.")
            }
            else{
                this.props.errorMessage("")
            }
        })
    }

    handleRegisterSubmit = (event) => {
        event.preventDefault()
        this.props.registerUser(this.state.email, this.state.password)
    }

    renderErrors = () => {
        var messages = this.props.authMessages
        const listItems = messages.map((message, i) =>
            <li key={i}>{message}</li>
        );
        if (messages.length > 0 && messages[0]!="") {
            return (
                <ul className={css.errorMessageContainer}>{listItems}</ul>
            );
        }
    }

    renderAppLogo = () => {
        return (
            <NavLink to={ '/login' } onClick={()=>this.props.errorMessage("")} activeClassName='active'>
                <img className={css.appLogo} src="/img/logovertical.png"></img>
            </NavLink>
        )
    }

    renderLoadingBar = () => {
        if (this.props.authFetching){
            return <Loading/>
        }
    }
    
    renderResendEmailLink = () => {
        return <NavLink to={ '/resendemail' } activeClassName='active'>
                <p className={css.resendEmail} onClick={()=>this.props.errorMessage("")}>Click here to re-send verification email to your email account.</p>
            </NavLink>
    }

    public render() {
        if (!this.props.authenticated) {
            // following image is from https://unsplash.com/photos/mgYAR7BzBk4
            // TODO: make sure to include this link on LICENSE
            const registerBox =
                <div className={css.registerContainer}>
                    <form className={css.registerForm} onSubmit={this.handleRegisterSubmit}>
                        {this.renderAppLogo()}
                        <div className={css.registerElementContainer}>
                            <input className={css.registerElement}
                                type="text"
                                value={this.state.email}
                                onChange={this.handleEmailChange}
                                placeholder="New E-mail" />
                        </div>
                        <div className={css.registerElementContainer}>
                            <input name="password" className={css.registerElement}
                                type="password"
                                value={this.state.password}
                                onChange={this.handlePasswordMatchChange}
                                placeholder="Password" />
                        </div>
                        <div className={css.registerElementContainer}>
                            <input name="passwordMatch" className={css.registerElement}
                                type="password"
                                value={this.state.passwordMatch}
                                onChange={this.handlePasswordMatchChange}
                                placeholder="Confirm the Password" />
                            <button className={css.loginIcon}>
                                <i className="material-icons green">vpn_key</i>
                            </button>
                        </div>
                        {this.renderErrors()}
                        {this.renderResendEmailLink()}
                        {this.renderLoadingBar()}
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