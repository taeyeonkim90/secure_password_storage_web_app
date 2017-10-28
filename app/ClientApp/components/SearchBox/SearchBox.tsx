import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';
import ActionButton from '../ActionButton/ActionButton';
import * as css from './SearchBox.css';

class SearchBox extends React.Component<any, {}> {
    public render() {
        return <div className={css.elementContainer}>
                    <input className={css.search} type="text" name="search" 
                           placeholder="Search.." onChange={this.props.handleSearch}/>
                    {/* <i className="material-icons green">search</i> */}
                </div>
    }
}

export default SearchBox;


