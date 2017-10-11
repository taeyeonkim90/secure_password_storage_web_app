import * as React from 'react';
import { Link, NavLink, RouteComponentProps, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as AuthStore from '../../store/Authenticate';
import ActionButton from '../ActionButton/ActionButton';

class Layout extends React.Component<any, {}> {
    public render() {
        return <div className='container-fluid'>
            <div className='row'>
                <div className='col-sm-12'>
                    <ActionButton email={this.props.email} logOut={this.props.logoutUser}></ActionButton>
                    { this.props.children }
                </div>
            </div>
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => state.auth, // Selects which state properties are merged into the component's props
    AuthStore.actionCreators                 // Selects which action creators are merged into the component's props
)(Layout) as typeof Layout;