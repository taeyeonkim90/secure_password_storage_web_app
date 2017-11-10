import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as css from './FieldDetail.css';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';

const FieldDetail = (props) => {
    var message = `Copied "${props.data}" to the clipboard`
    if (props.hidePassword){
        message = `Copied your password for "${props.display}" to the clipboard`
    }

    return (
        <div>
            <CopyToClipboard text={props.data} onCopy={()=>toast(message)}>
                <p className={css.fieldDetail} > {props.display} </p>
            </CopyToClipboard>
        </div>
    )
}

export default FieldDetail;