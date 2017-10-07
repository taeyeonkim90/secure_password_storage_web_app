import * as React from 'react';
import * as css from './Dropdown.css';

class Dropdown extends React.Component<any, {}> {
    
    public render() {
        if (this.props.isExpand) {
            return (
                <div>
                    {this.props.children}    
                </div>
            )
        }else{
            return null;
        }
    }
}

export default Dropdown;