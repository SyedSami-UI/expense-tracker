import React from "react";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import { MDBBtn } from "mdbreact";
import { MDBIcon } from "mdbreact";
import { withRouter } from "react-router-dom";
import moment from 'moment';

import './ExpensesComponent.css';

let sampleExpenseList = [];

if(window.localStorage.getItem('expenseList')) {
    sampleExpenseList = JSON.parse(window.localStorage.getItem('expenseList'));
}

class ExpensesComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            totalIncome: 0,
            totalSpending: 0,
            totalSavings: 0,
            expenseList: sampleExpenseList && sampleExpenseList.length > 0 ? sampleExpenseList : []
        }
    }

    componentDidMount() {

        if (this.props.location.state && this.props.location.state.data) {
            if(this.props.location.action === "add") {
                sampleExpenseList.push(
                    {
                        index: sampleExpenseList.length,
                        type: this.props.location.state.data.type,
                        amount: this.props.location.state.data.amount,
                        date: moment(this.props.location.state.data.date, "YYYY-MM-DD").format('D.M.YY'),
                        remarks: this.props.location.state.data.remarks
                    }
                );
                
                this.setState({
                    expenseList: sampleExpenseList
                }, () => {
                    this.calculateTotalExpenses();
                    localStorage.setItem('expenseList', JSON.stringify(this.state.expenseList));
                });
            }
            if(this.props.location.action === "edit") {
                let tempExpense = [...sampleExpenseList];
                let objIndex = tempExpense.findIndex((obj => obj.index === this.props.location.state.data.index));
                tempExpense[objIndex].type = this.props.location.state.data.type;
                tempExpense[objIndex].amount = this.props.location.state.data.amount;
                tempExpense[objIndex].date = moment(this.props.location.state.data.date, "YYYY-MM-DD").format('D.M.YY');
                tempExpense[objIndex].remarks = this.props.location.state.data.remarks;
                
                this.setState({
                    expenseList: tempExpense
                }, () => {
                    this.calculateTotalExpenses();
                    localStorage.setItem('expenseList', JSON.stringify(this.state.expenseList));
                });
            }

            this.props.history.replace();
        }

        this.calculateTotalExpenses();

    }

    componentWillUnmount() {
        
    }

    calculateTotalExpenses = () => {
        let totalIncome = 0;
        let totalSpending = 0;
        let totalSavings = 0;
        this.state.expenseList.map((value) => {
            if (value.type === "income") {
                totalIncome += value.amount;
            }
            return totalIncome;
        })
        this.state.expenseList.map((value) => {
            if (value.type === "spending") {
                totalSpending += value.amount;
            }
            return totalSpending;
        });
        totalSavings = totalIncome - totalSpending;
        this.setState({
            totalIncome: totalIncome,
            totalSpending: totalSpending,
            totalSavings: totalSavings,
        })

    }

    deleteExpense = (index) => {

        let expenseCurrentList = this.state.expenseList.filter(item => item.index !== index)

        sampleExpenseList = expenseCurrentList

        this.setState({
            expenseList: expenseCurrentList
        }, () => {
            this.calculateTotalExpenses();
            localStorage.setItem('expenseList', JSON.stringify(this.state.expenseList));
        })
    }

    editExpense = (index) => {
        let expenseCurrentList = this.state.expenseList.filter(item => item.index === index);

        this.props.history.push({
            pathname: "/addexpense",
            state: { type: expenseCurrentList[0].type, data:  expenseCurrentList[0], action: "edit"}
        });

    }

    addIncome = () => {
        this.props.history.push({
            pathname: "/addexpense",
            state: { type: "income", action: "add" }
        });
    }

    addSpending = () => {
        this.props.history.push({
            pathname: "/addexpense",
            state: { type: "spending", action: "add" }
        });
    }

    render() {
        return (
            <MDBContainer>
                <MDBRow style={{ backgroundColor: '#DDDDDD', paddingTop: '20px' }}>
                    <MDBCol size="12" className="text-left">
                        <p style={{ color: "#A8A7B1", marginBottom: "0" }} className="text-left">Balance</p>
                        <p style={{ color: "#34333A", fontSize: "40px", marginBottom: "0" }} className="text-left">{this.state.totalSavings} <MDBIcon icon="rupee-sign" /></p>
                        <p style={{ color: "#A8A7B1", fontSize: "20px" }} className="text-left"><span style={{ color: '#009E0F' }}>Income: {this.state.totalIncome} <MDBIcon icon="rupee-sign" /></span>&nbsp;&nbsp;&nbsp;<span style={{ color: '#CF2A27' }}>Spendings: {this.state.totalSpending} <MDBIcon icon="rupee-sign" /></span></p>
                    </MDBCol>
                </MDBRow>

                {
                    this.state.expenseList.map((value, i) => {
                        return (
                            <>
                                <MDBRow>
                                    <MDBCol className="text-left date-section" size="12" sm="12">
                                        <span>{value.date}</span>
                                    </MDBCol>

                                </MDBRow>
                                <MDBRow key={value.index} className="expense-data-row">
                                    <MDBCol className="text-left" size="5" sm="5">
                                        <p className={`${value.type === "income" ? 'expense-data-income' : (value.type === "spending") ? "expense-data-spending" : ""}`} style={{ fontSize: "32px" }}>{value.amount} <MDBIcon icon="rupee-sign" /></p>
                                    </MDBCol>


                                    <MDBCol className="text-left padding-bottom-10" size="5" sm="5"><p>{value.remarks}</p></MDBCol>
                                    <MDBCol className="text-right padding-bottom-10" size="1" sm="1"><p>
                                        <MDBIcon onClick={() => { this.editExpense(value.index) }} far style={{ fontSize: '1.5em' }} icon="edit" /></p></MDBCol>
                                    <MDBCol className="text-right padding-bottom-10" size="1" sm="1"><p><MDBIcon onClick={() => { this.deleteExpense(value.index) }} style={{ fontSize: '1.5em' }} far icon="trash-alt" /></p></MDBCol>
                                </MDBRow>
                            </>
                        )

                    })
                }



                <MDBRow style={{ marginTop: "50px" }}>
                    <MDBCol size="6" sm="6"><MDBBtn onClick={this.addIncome} className="add-income">Add Income</MDBBtn></MDBCol>
                    <MDBCol size="6" sm="6"><MDBBtn onClick={this.addSpending} className="add-spending">Add Spending</MDBBtn></MDBCol>

                </MDBRow>
            </MDBContainer>
        )
    }
}


export default withRouter(ExpensesComponent);