import * as React from 'react';
import * as css from './ActionButton.css';

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

    expand = () => {
        this.setState((prevState, props) => ({
            isExpand: !prevState.isExpand
        }))
    }

    collapse = (e) => {
        if (e.relatedTarget 
            && typeof e.relatedTarget !== 'undefined'
            && e.relatedTarget.className === 'dropdownButton') {
            return
        }
        this.setState((prevState, props) => ({
            isExpand: false
        }))
    }

    signOut = () => {
        this.props.logout("User has signed out.")
    }

    renderDropdown = () => {
        if (this.state.isExpand) {
            return (
                <div  className={css.dropDown}>
                    <ul>
                        <li>
                            <input className="dropdownButton" type="button" value="Sign Out" onClick={this.signOut}/>
                        </li>
                    </ul>  
                </div>
            )
        }
    }

    public render() {
        let displayLetter = this.props.email? this.props.email.charAt(0).toUpperCase() : "";
        let visibility = this.props.pseudo ? css.invisible : css.actionButtonContainer;

        return (
            <div className={visibility} onBlur={this.collapse}>
                <button className={css.circle} onClick={this.expand}>
                    <i className="material-icons green em-30">menu</i>
                </button>
                { this.renderDropdown() }
            </div>
            )
    }
}

export default ActionButton;