import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { ApplicationState }  from '../../store';
import * as CardsState from '../../store/Data';
import { AppThunkAction } from '../../store';
import FieldInput from '../FieldInput/FieldInput';
import * as css from './NewCard.css';


interface NewCardAction {
    addCard: (accountName, userName, pw, description) => void
} 

type NewCardProps = NewCardAction

interface NewCardState {
    isExpand: boolean
    accountName: string
    userName: string
    pw: string
    description: string
}

export default class Card extends React.Component<NewCardProps, NewCardState> {
    constructor(props) {
        super(props);
        this.state = {
            isExpand: false, 
            accountName: "", 
            userName: "", 
            pw: "", 
            description: ""
        };
    }

    addNewCard = () => {
        let {accountName, userName, pw, description } = this.state
        if (!accountName || !userName || !pw) {
            toast.warn("Domain, user name, and password fields cannot be empty")
        }
        else {
            this.props.addCard(accountName, userName, pw, description)
            this.cancelNewCard()
        }
    }

    cancelNewCard = () => {
        this.setState((prevState, props) => ({
            isExpand: false,
            accountName: "",
            userName: "",
            pw: "",
            description: ""
        }))
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }

    showTempCard = () => {
        this.setState((prevState, props) => ({
            isExpand: true
        }));
    }

    renderIsEditHTML = () => {
        return <div className={css.newCardContainer}>
            <FieldInput displayName="Domain" name="accountName" type="text" data={this.state.accountName} updateState={this.handleChange}/>
            <FieldInput displayName="ID" name="userName" type="text" data={this.state.userName} updateState={this.handleChange}/>
            <FieldInput displayName="Password" name="pw" type="password" data={this.state.pw} updateState={this.handleChange}/>
            <FieldInput displayName="Description" name="description" type="text" data={this.state.description} updateState={this.handleChange}/>
            <div className={css.buttonContainer}>
                <button className={css.button} onClick={this.addNewCard}>Add</button>
                <button className={css.button} onClick={this.cancelNewCard}>Cancel</button>
            </div>
        </div>
    }

    public render() {
        var result = this.state.isExpand
                ?this.renderIsEditHTML()
                :<button onClick={this.showTempCard} className={css.newCardButton}><i className="material-icons green em-35">add_circle_outline</i></button>
        
        return result;
    }
}
