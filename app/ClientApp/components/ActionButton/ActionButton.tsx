import * as React from 'react';
import * as css from './ActionButton.css';
import Dropdown from '../Dropdown/Dropdown';

interface ActionButtonState {
    isExpand: boolean;
}

class ActionButton extends React.Component<any, ActionButtonState> {
    
    constructor(props) {
        super(props)
        this.state = {
            isExpand: false
        }
    }

    // toggles isExpanded when + or - button is pressed
    toggleIsExpand = () => {
        this.setState((prevState, props) => ({
            isExpand: !prevState.isExpand
        }));
    }

    signOut = () => {
        this.props.logOut("User has signed out.")
    }

    renderDropdown = () => {
        if (this.state.isExpand) {
            return (
                <div className={css.dropDown}>
                    <ul>
                        <li>
                            <input type="button" value="test"/>
                        </li>
                        <li>
                            <input type="button" value="test1"/>
                        </li>
                        <li>
                            <input type="button" value="sign out" onClick={this.signOut}/>
                        </li>
                    </ul>  
                </div>
            )
        }
    }

    public render() {
        let displayLetter = this.props.email? this.props.email.charAt(0).toUpperCase() : "";
        return (
            <div>
                <button className={css.circle} onClick={this.toggleIsExpand}>
                    {displayLetter}
                </button>
                { this.renderDropdown() }
            </div>
            )
    }
}

export default ActionButton;