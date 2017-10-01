import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as css from './FieldInput.css';

const FieldInput = (props) => {
    return (
        <input className={css.fieldInput}
               type={props.type}
               name={props.name}
               value={props.data} 
               onChange={props.updateState}/>
    )
}

export default FieldInput;