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
            <div className={css.logo}> Logo </div>
            <ActionButton email={this.props.email} logout={this.props.logout}></ActionButton>
        </div>;
        
        
        // <div className='main-nav'>
        //         <div className='navbar navbar-inverse'>
        //         <div className='navbar-header'>
        //             <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
        //                 <span className='sr-only'>Toggle navigation</span>
        //                 <span className='icon-bar'></span>
        //                 <span className='icon-bar'></span>
        //                 <span className='icon-bar'></span>
        //             </button>
        //             <Link className='navbar-brand' to={ '/' }>app</Link>
        //         </div>
        //         <div className='clearfix'></div>
        //         <div className='navbar-collapse collapse'>
        //             <ul className='nav navbar-nav'>
        //                 <li>
        //                     <NavLink exact to={ '/' } activeClassName='active'>
        //                         <span className='glyphicon glyphicon-home'></span> Home
        //                     </NavLink>
        //                 </li>
        //                 <li>
        //                     <NavLink to={ '/counter' } activeClassName='active'>
        //                         <span className='glyphicon glyphicon-education'></span> Counter
        //                     </NavLink>
        //                 </li>
        //                 <li>
        //                     <NavLink to={ '/fetchdata' } activeClassName='active'>
        //                         <span className='glyphicon glyphicon-th-list'></span> Fetch data
        //                     </NavLink>
        //                 </li>
        //             </ul>
        //         </div>
        //     </div>
        // </div>;
    }
}

export default NavBar;
