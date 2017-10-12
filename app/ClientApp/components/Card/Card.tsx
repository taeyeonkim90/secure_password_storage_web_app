import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../../store';
import * as CardsState from '../../store/Data';
import { AppThunkAction } from '../../store';
import FieldInput from '../FieldInput/FieldInput';
import FieldDetail from '../FieldDetail/FieldDetail';

// At runtime, Redux will merge together...
interface CardAction {
    updateCard: (accountName, index, userName, pw, description) => void
    deleteCard: (index) => void
} 

type CardProps = CardsState.CardData
                & CardAction


interface CardState {
    index: number
    isExpand: boolean
    isEdit: boolean
    accountName: string
    userName: string
    pw: string
    description: string
}

export default class Card extends React.Component<CardProps, CardState> {
    constructor(props) {
        super(props);
        this.state = {
            index: props.index, 
            isExpand: false, 
            isEdit: false, 
            accountName: props.accountName, 
            userName: props.userName, 
            pw: props.pw, 
            description: props.description
        };
    }

    componentWillReceiveProps(nextProps: CardProps) {
        this.setState((prevState, props) => ({
            index: nextProps.index, 
            isExpand: false, 
            isEdit: false, 
            accountName: nextProps.accountName, 
            userName: nextProps.userName, 
            pw: nextProps.pw, 
            description: nextProps.description
        }))
    }

    // modifies Card's state value
    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }
    
    delete = () => {
        this.props.deleteCard(this.state.index);
    }

    // saves the changed Card information to the redux store
    save = () => {
        this.setState((prevState, props) => ({isEdit: false}))
        this.props.updateCard(this.state.accountName, this.state.index, this.state.userName, this.state.pw, this.state.description);
    }

    // cancels any Card information change
    cancel = () => {
        this.resetCardState();
    }

    // resets CardState to props (ex. when pressing cancel while editing)
    resetCardState = () => {
        this.setState((prevState, props) => ({
            index: this.props.index, 
            isExpand: false, 
            isEdit: false, 
            accountName: this.props.accountName, 
            userName: this.props.userName, 
            pw: this.props.pw, 
            description: this.props.description
        }));
    }

    // toggles isExpanded when + or - button is pressed
    toggleIsExpand = () => {
        this.setState((prevState, props) => ({
            isExpand: !prevState.isExpand
        }));
    }

    // handles isEditing condition when 'edit' or 'cancel' button is pressed
    toggleIsEdit = () => {
        this.setState((prevState, props) => ({
            isEdit: !prevState.isEdit
        }));
    }


    /*
     *  returns HTML for different situations
     */
    renderIsEditHTML = () => {
        return <div>
            <FieldInput displayName="Domain" name="accountName" type="text" data={this.state.accountName} updateState={this.handleChange}/>
            <FieldInput displayName="ID" name="userName" type="text" data={this.state.userName} updateState={this.handleChange}/>
            <FieldInput displayName="Password" name="pw" type="password" data={this.state.pw} updateState={this.handleChange}/>
            <FieldInput displayName="Description" name="description" type="text" data={this.state.description} updateState={this.handleChange}/>
            <button onClick={this.delete}>Delete</button>
            <button onClick={this.save}>Update</button>
            <button onClick={this.cancel}>Cancel</button>
        </div>
    }

    renderIsExpandedHTML = () => {
        let {accountName, userName, pw, description} = this.state

        return <div>
            <button onClick={this.toggleIsExpand}>-</button>
            <FieldDetail displayName="Domain" data={accountName} /> 
            <FieldDetail displayName="ID" data={userName} /> 
            <FieldDetail displayName="Password" data={pw} /> 
            <FieldDetail displayName="Description" data={description} />
            <button onClick={this.toggleIsEdit}>Edit</button>
        </div>
    }

    renderIsNotExpandedHTML = () => {
        return <div>
            <button onClick={this.toggleIsExpand}>+</button>
            <FieldDetail displayName="Domain" data={this.state.accountName} />
        </div>
    }

    public render() {
        var renderedView =  null
        if (!this.state.isExpand){
            renderedView = this.renderIsNotExpandedHTML()
        }
        else if (!this.state.isEdit){
            renderedView = this.renderIsExpandedHTML()
        }
        else {
            renderedView = this.renderIsEditHTML()
        }
        
        return (
        <div >
            {renderedView}
        </div>
        );
    }
}
