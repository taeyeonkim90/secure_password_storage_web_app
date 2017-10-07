import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as css from './FieldDetail.css';

const FieldDetail = (props) => {
    return (
        <div>
            <p> {props.displayName}: </p>
            <p className={css.fieldDetail} > {props.data} </p>
        </div>
        )
}

export default FieldDetail;