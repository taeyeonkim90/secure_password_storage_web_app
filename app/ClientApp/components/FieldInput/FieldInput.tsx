import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as css from './FieldInput.css';

const FieldInput = (props) => {
    var placeholder = ""
    switch (props.name) {
        case ("accountName"):
            placeholder = "Domain name: Facebook, Gmail, etc."
            break;
        case ("userName"):
            placeholder = "ID: example@example.com"
            break;
        case ("pw"):
            placeholder = "pw: longer the better"
            break;
        case ("description"):
            placeholder = "description: notes related to your password"
            break;
    }

    return (
        <div>
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