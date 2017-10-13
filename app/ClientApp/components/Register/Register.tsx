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

    renderLoadingBar = () => {
        if (this.props.authFetching){
            return (
                <img className={css.loading} src="img/loading.gif"></img> 
            );
        }
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
                        <input name="password" className={css.registerElement}
                            type="password"
                            value={this.state.password}
                            onChange={this.handlePasswordMatchChange}
                            placeholder="Password" />
                        <input name="passwordMatch" className={css.registerElement}
                            type="password"
                            value={this.state.passwordMatch}
                            onChange={this.handlePasswordMatchChange}
                            placeholder="Confirm the Password" />
                        <input className={css.registerButton}
                            type="submit" value="Register"/>
                        <NavLink to={ '/login' } activeClassName='active'>
                            <input type="button" className={css.redirectLoginButton} onClick={()=>this.props.errorMessage("")}
                             value="Login"/>
                        </NavLink>
                        {this.renderErrors()}
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