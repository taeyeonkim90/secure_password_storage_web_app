import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';
import ActionButton from '../ActionButton/ActionButton';
import * as css from './NavBar.css';

class NavBar extends React.Component<any, {}> {
    
    constructor(props) {
        super(props)
    }

    public render() {
        return <div className={css.navBar}>
            <div/>
            <ActionButton email={this.props.email} logout={this.props.logout}></ActionButton>
        </div>;
    }
}

export default NavBar;
