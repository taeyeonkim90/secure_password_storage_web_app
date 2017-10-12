import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as css from './FieldDetail.css';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const FieldDetail = (props) => {
    return (
        <div>
            <p> {props.displayName}: </p>
            <CopyToClipboard text={props.data}>
                <p className={css.fieldDetail} > {props.data} </p>
            </CopyToClipboard>
        </div>
        )
}

export default FieldDetail;