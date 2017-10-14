import * as React from 'react';
import { Link, NavLink, RouteComponentProps, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import { ApplicationState } from '../../store';
import * as AuthStore from '../../store/Authenticate';
import * as DataStore from '../../store/Data';
import NavBar from '../NavBar/NavBar';

class Layout extends React.Component<any, {}> {
    logout = (message:string) => {
        this.props.logoutUser(message)
        this.props.cleanUpCardsAction()
    }

    public render() {
        return <div>
                <NavBar email={this.props.email} logout={this.logout}></NavBar>
                    { this.props.children }
                    <ToastContainer 
                    position="bottom-center"
                    type="default"
                    autoClose={3500}
                    hideProgressBar={true}
                    newestOnTop={false}
                    closeOnClick
                    pauseOnHover/>
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