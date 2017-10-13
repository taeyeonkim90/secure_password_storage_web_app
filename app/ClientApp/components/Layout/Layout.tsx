import * as React from 'react';
import { Link, NavLink, RouteComponentProps, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import { ApplicationState } from '../../store';
import * as AuthStore from '../../store/Authenticate';
import * as DataStore from '../../store/Data';
import ActionButton from '../ActionButton/ActionButton';

class Layout extends React.Component<any, {}> {
    logout = (message:string) => {
        this.props.logoutUser(message)
        this.props.cleanUpCardsAction()
    }

    public render() {
        return <div className='container-fluid'>
            <div className='row'>
                <div className='col-sm-12'>
                    <ActionButton email={this.props.email} logOut={this.logout}></ActionButton>
                    { this.props.children }
                    <ToastContainer 
                    position="top-right"
                    type="default"
                    autoClose={3000}
                    hideProgressBar={true}
                    newestOnTop={true}
                    closeOnClick
                    pauseOnHover
                    />
                </div>
            </div>
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => {
        const {auth, data} = state
        return { ...auth, ...data }
    },
    {... AuthStore.actionCreators, ... DataStore.actionCreators}
)(Layout) as typeof Layout;