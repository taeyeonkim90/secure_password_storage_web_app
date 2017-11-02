import * as React from 'react';
import { Link, NavLink, RouteComponentProps, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as AuthStore from '../../store/Authenticate';
import * as s from './ResendEmail.css';
import Loading from '../Loading/Loading';

type AuthProps =
    AuthStore.AuthState
    & typeof AuthStore.actionCreators
    & RouteComponentProps<{}>;

interface AuthState {
    email: string
}

class ResendEmail extends React.Component<AuthProps, AuthState> {
    constructor(props) {
        super(props)
        this.state = { email: ''}
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleLoginSubmit = (event) => {
        event.preventDefault()
        this.props.requestVerifyEmail(this.state.email)
    }

    handleKeyPress = (event) => {
        if (event.key === "Enter"){
            this.props.requestVerifyEmail(this.state.email)
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
                                        placeholder="E-mail to resend the verification link" />
                                    <button className={s.loginIcon} >
                                        <i className="material-icons green">vpn_key</i>
                                    </button>
                                </div>
                            {this.renderErrors()}
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
)(ResendEmail) as typeof ResendEmail;