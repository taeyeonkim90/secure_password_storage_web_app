import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../../store';
import * as CardsState from '../../store/Data';
import { AppThunkAction } from '../../store';
import FieldInput from '../FieldInput/FieldInput';

// At runtime, Redux will merge together...
interface CardAction {
    updateCardAction: (accountName, index, userName, pw, description) => AppThunkAction<CardsState.KnownAction>
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

    componentWillMount() {
        // This method runs when the component is first added to the page
        // let startDateIndex = parseInt(this.props.match.params.startDateIndex) || 0;
        // this.props.requestWeatherForecasts(startDateIndex, this.props.token);
        console.log("updating props")
    }

    componentWillReceiveProps(nextProps: CardProps) {
        // This method runs when incoming props (e.g., route params) change
        // let startDateIndex = parseInt(nextProps.match.params.startDateIndex) || 0;
        // this.props.requestWeatherForecasts(startDateIndex, this.props.token);
        console.log("updating props")
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

    /*
     *  toggles isExpanded when + or - button is pressed
     */
    toggleIsExpand = () => {
        console.log("isExpand before pressing button", this.state.isExpand)
        this.setState((prevState, props) => ({
            isExpand: !prevState.isExpand
        }));
    }

    /*
     *  handles isEditing condition when 'edit' or 'cancel' button is pressed
     */
    toggleIsEdit = () => {
        console.log("isEdit before pressing button", this.state.isEdit)
        this.setState((prevState, props) => ({
            isEdit: !prevState.isEdit
        }));
    }

    //=======================================================//

    /*
     *  Pre: Should not be in edit mode
     *  toggle HTML depending on isExpand flag and not in edit mode
     */
    toggleIsExpandHTML = () => {
        if (this.state.isExpand){
            return this.renderIsExpandHTML();
        }else{
            return this.renderIsNonExpandHTML();
        }
    }

    /*
     *  returns HTML for expanded mode
     */
    renderIsExpandHTML = () => {
        let detail = [this.props.accountName, this.props.userName, this.props.pw, this.props.description]
        let detailHTMLs = detail.map((detail, i)=>{return <p key={i}> {detail} </p>})
        return detailHTMLs;
    }

    /*
     *  returns HTML for non expanded mode
     */
    renderIsNonExpandHTML = () => {
        let detail = [this.props.accountName]
        let detailHTMLs = detail.map((detail, i)=>{return <p key={i}> {detail} </p>})
        return detailHTMLs;
    }

    //=======================================================//

    /*
     *  handles isEdit condition for rendering HTML
     */
    toggleIsEditHTML = () => {
        if (!this.state.isEdit){
            return this.toggleIsExpandHTML();
        }else{
            return this.renderIsEditHTML();
        }
    }

    /*
     *  returns HTML for edit mode
     */
    renderIsEditHTML = () => {
        return <div>
            <FieldInput name="accountName" type="text" data={this.state.accountName} updateState={this.handleChange}/>
            <FieldInput name="userName" type="text" data={this.state.userName} updateState={this.handleChange}/>
            <FieldInput name="pw" type="password" data={this.state.pw} updateState={this.handleChange}/>
            <FieldInput name="description" type="text" data={this.state.description} updateState={this.handleChange}/>
        </div>
    }

    //=======================================================//
    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }
    //=======================================================//

    renderButtons = () => {
        if (this.state.isEdit){
            return <div>
                <button onClick={this.save}>Save</button>
                <button onClick={this.cancel}>Cancel</button>
            </div>
        }else{
            return <div>
                <button onClick={this.toggleIsExpand}>+</button>
                <button onClick={this.toggleIsEdit}>Edit</button>
            </div>
        }
    }

    save = () => {
        this.setState((prevState, props) => ({isEdit: false}))
        this.props.updateCardAction(this.state.accountName, this.state.index, this.state.userName, this.state.pw, this.state.description);
        this.forceUpdate();
    }

    cancel = () => {
        this.resetCardState();
    }

    //=======================================================//

    /*
     *  resets CardState to props (ex. when pressing cancel while editing)
     */
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

    public render() {
        return (
        <div className="row">
            <div className="col-sm-9">
                {this.toggleIsEditHTML()}
            </div>
            <div className="col-sm-3">
                {this.renderButtons()}
            </div>
        </div>
        );
    }
}
