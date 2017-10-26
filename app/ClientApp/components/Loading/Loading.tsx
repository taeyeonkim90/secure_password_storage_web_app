import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import * as s from './Loading.css';

const Loading = (props) => {
    return (
        <div className={s.spinner}>
            <div className={s.bounce1}></div>
            {<div className={s.bounce2}></div>}
            <div className="bounce3"></div>
        </div>
        )
}

export default Loading;