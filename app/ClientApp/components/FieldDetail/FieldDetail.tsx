import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as css from './FieldDetail.css';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';

const FieldDetail = (props) => {
    return (
        <div>
            <CopyToClipboard text={props.data} onCopy={()=>toast(`Copied ${props.message} to the clipboard`)}>
                <p className={css.fieldDetail} > {props.display} </p>
            </CopyToClipboard>
        </div>
    )
}

export default FieldDetail;