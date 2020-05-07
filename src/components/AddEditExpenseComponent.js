import React from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBAlert } from 'mdbreact';
import { withRouter } from "react-router-dom";
import moment from 'moment';

class AddExpenseComponent extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props.location.state);
        this.state = {
            amount: this.props.location.state && this.props.location.state.data && this.props.location.state.data.amount ? this.props.location.state.data.amount : 0,
            remarks: this.props.location.state && this.props.location.state.data && this.props.location.state.data.remarks ? this.props.location.state.data.remarks : "",
            date: this.props.location.state && this.props.location.state.data && this.props.location.state.data.date ? moment(this.props.location.state.data.date, "D.M.YY").format('YYYY-MM-DD') : "",
            type: this.props.location.state && this.props.location.state.type ? this.props.location.state.type : "",
            action: this.props.location.state && this.props.location.state.action ? this.props.location.state.action : "add",
            errorFlag: false
        }
    }

    componentDidMount() {
        this.setState({
            type: this.props.location.state && this.props.location.state.type ? this.props.location.state.type : "",
            action: this.props.location.state && this.props.location.state.action ? this.props.location.state.action : "add"
        })
    }

    handleAmountChange = (event) => {
        this.setState({
            amount: parseInt(event.target.value)
        })
    }

    handleRemarksChange = (event) => {
        this.setState({
            remarks: event.target.value
        })
    }

    handleDateChange = (event) => {
        this.setState({
            date: event.target.value
        })
    }

    validateInputs = () => {
        if (this.state.amount !== "" && this.state.amount > 0 && this.state.remarks !== "" && this.state.date !== "" && moment(this.state.date).isValid) {
            return true;
        } else {
            return false;
        }
    }

    addEditExpense = () => {
        this.setState({
            errorFlag: false
        })

        if (this.validateInputs()) {
            let data = {};
            if (this.state.action === "edit") {
                data = {
                    index: this.props.location.state.data.index,
                    amount: this.state.amount,
                    remarks: this.state.remarks,
                    date: this.state.date,
                    type: this.state.type
                };
            }
            if (this.state.action === "add") {
                data = {
                    amount: this.state.amount,
                    remarks: this.state.remarks,
                    date: this.state.date,
                    type: this.state.type
                };
            }

            this.props.history.push({
                pathname: "/",
                state: { data: data },
                action: this.state.action
            });
        } else {
            this.setState({
                errorFlag: true
            })
        }


    }


    render() {

        const expenseType = this.state.type === "income" ? "Income" :
            this.state.type === "spending" ? "Spending" : "";

        return (
            <MDBContainer>
                {
                    this.state.errorFlag &&
                    <MDBRow>
                        <MDBContainer>
                            <MDBAlert color="danger">
                                Please input all the fields with valid data and try again.
                            </MDBAlert>
                        </MDBContainer>
                    </MDBRow>
                }

                <MDBRow>
                    <MDBCol md="12">
                        <form>
                            <p className="h4 text-center mb-4">{this.state.action === "add" ? 'Add' : this.state.action === "edit" ? "Edit" : ""} {expenseType}
                            </p>
                            <label htmlFor="amount" className="grey-text">
                                {expenseType} Amount
                            </label>
                            <input type="number" id="amount" className="form-control" onChange={this.handleAmountChange} value={this.state.amount} />
                            <br />
                            <label htmlFor="remarks-text" className="grey-text">
                                Remarks
        </label>
                            <input type="text" id="remarks-text" className="form-control" onChange={this.handleRemarksChange} value={this.state.remarks} />
                            <br />
                            <label htmlFor="date" className="grey-text">
                                Date
                            </label>
                            <input type="date" id="expense-date" className="form-control" onChange={this.handleDateChange} value={this.state.date} />
                            <div className="text-center mt-4">
                                <MDBBtn color="indigo" onClick={this.addEditExpense} className={`${expenseType === "Income" ? "add-income" : expenseType === "Spending" ? "add-spending" : ""}`}>{this.state.action === "add" ? 'Add' : this.state.action === "edit" ? "Edit" : ""} {expenseType}</MDBBtn>
                            </div>
                        </form>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }
}

export default withRouter(AddExpenseComponent);