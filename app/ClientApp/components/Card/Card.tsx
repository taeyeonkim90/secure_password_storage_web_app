import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { ApplicationState }  from '../../store';
import * as CardsState from '../../store/Data';
import { AppThunkAction } from '../../store';
import FieldInput from '../FieldInput/FieldInput';
import FieldDetail from '../FieldDetail/FieldDetail';
import * as css from './Card.css';

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
        let {accountName, userName, pw} = this.state
        if (!accountName || !userName || !pw) {
            toast.warn("Domain, user name, and password fields cannot be empty")
        }
        else {
            this.setState((prevState, props) => ({isEdit: false}))
            this.props.updateCard(this.state.accountName, this.state.index, this.state.userName, this.state.pw, this.state.description);
        }
    }

    // cancels any Card information change
    cancel = () => {
        this.resetCardState()
        toast("Editing a card has been cancelled")
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
        }))
    }

    // toggles isExpanded when + or - button is pressed
    toggleIsExpand = () => {
        this.setState((prevState, props) => ({
            isExpand: !prevState.isExpand
        }))
    }

    // handles isEditing condition when 'edit' or 'cancel' button is pressed
    toggleIsEdit = () => {
        this.setState((prevState, props) => ({
            isEdit: !prevState.isEdit
        }))
    }


    /*
     *  returns HTML for different situations
     */
    renderIsEditHTML = () => {
        return <div>
            <button className={css.foldButton} onClick={this.cancel}><i className="material-icons">keyboard_arrow_up</i></button>
            <FieldInput name="accountName" type="text" data={this.state.accountName} updateState={this.handleChange}/>
            <FieldInput name="userName" type="text" data={this.state.userName} updateState={this.handleChange}/>
            <FieldInput name="pw" type="text" data={this.state.pw} updateState={this.handleChange}/>
            <FieldInput name="description" type="text" data={this.state.description} updateState={this.handleChange}/>
            <div className={css.buttonContainer}>
                <button className={css.button} onClick={this.delete}>Delete</button>
                <button className={css.button} onClick={this.cancel}>Cancel</button>
                <button className={css.button} onClick={this.save}>Update</button>
            </div>
        </div>
    }

    renderIsExpandedHTML = () => {
        let {accountName, userName, pw, description} = this.state

        var pwLength = pw.length
        var maskedPw = "*".repeat(pwLength);

        return <div>
            <button className={css.foldButton} onClick={this.toggleIsExpand}><i className="material-icons">keyboard_arrow_up</i></button>
            <FieldDetail display={accountName} data={accountName} message={`"${accountName}"`}/> 
            <FieldDetail display={userName} data={userName} message={`your ID for "${accountName}"`}/> 
            <FieldDetail display={maskedPw} data={pw} message={`your password for "${accountName}"`}/> 
            <FieldDetail display={description} data={description} message={`your description for "${accountName}"`}/>
            <div className={css.buttonContainer}>
                <div/>
                <button className={css.button} onClick={this.toggleIsEdit}>Edit</button>
                <div/>
            </div>
        </div>
    }

    renderIsNotExpandedHTML = () => {
        return <div>
            <button className={css.foldButton} onClick={this.toggleIsExpand}><i className="material-icons">keyboard_arrow_down</i></button>
            <FieldDetail display={this.state.accountName} data={this.state.pw} message={`your password for "${this.state.accountName}"`}/>
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
        
        return <div className={css.cardContainer}> {renderedView} </div>
    }
}
