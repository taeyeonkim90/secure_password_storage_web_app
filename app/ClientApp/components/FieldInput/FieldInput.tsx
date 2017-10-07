import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as css from './FieldInput.css';

const FieldInput = (props) => {
    return (
        <div>
            <p> {props.displayName}: </p>
            <input className={css.fieldInput}
                type={props.type}
                name={props.name}
                value={props.data} 
                onChange={props.updateState}/>
        </div>
        )
}

export default FieldInput;