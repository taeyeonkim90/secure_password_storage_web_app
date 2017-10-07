import * as React from 'react';
import { NavMenu } from '../NavMenu';
import { Link, NavLink, RouteComponentProps, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as AuthStore from '../../store/Authenticate';

export class Layout extends React.Component<any, {}> {
    public render() {
        return <div className='container-fluid'>
            <div className='row'>
                <div className='col-sm-12'>
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