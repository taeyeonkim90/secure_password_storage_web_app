import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as css from './FieldInput.css';

const FieldInput = (props) => {
    var placeholder = ""
    switch (props.name) {
        case ("accountName"):
            placeholder = "Facebook, Gmail, etc."
            break;
        case ("userName"):
            placeholder = "example@example.com"
            break;
        case ("pw"):
            placeholder = "your password"
            break;
        case ("description"):
            placeholder = "descriptions for your information"
            break;
    }

    return (
        <div>
            <p> {props.displayName}: </p>
            <input className={css.fieldInput}
                type={props.type}
                name={props.name}
                value={props.data} 
                placeholder={placeholder}
                onChange={props.updateState}/>
        </div>
        )
}

export default FieldInput;