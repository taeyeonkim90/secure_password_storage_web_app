import * as React from 'react';
import { Link, NavLink, RouteComponentProps, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as AuthStore from '../../store/Authenticate';
import Login from '../Login/Login';

type AuthProps =
    AuthStore.AuthState
    & typeof AuthStore.actionCreators
    & RouteComponentProps<{}>;

class NoMatch extends React.Component<AuthProps, {}> {
    componentWillMount() {
        this.props.errorMessage("Email verification failed. Please check your email once again, or contact the developer at taeyeonkim90@gmail.com.")
    }

    public render() {
        return <Login {... this.props} />
    }
}

export default connect(
    (state: ApplicationState) => state.auth, // Selects which state properties are merged into the component's props
    AuthStore.actionCreators                 // Selects which action creators are merged into the component's props
)(NoMatch) as typeof NoMatch;