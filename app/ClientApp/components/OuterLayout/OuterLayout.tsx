import * as React from 'react';
import * as s from './OuterLayout.css';

class OuterLayout extends React.Component<any, {}> {
    public render() {
        return <div>
                    <div className={`${s.fixedBar} ${s.topBar}`}></div>
                    { this.props.children }
                    <div className={`${s.fixedBar} ${s.bottomBar}`}></div>
                </div>;
    }
}

export default OuterLayout;