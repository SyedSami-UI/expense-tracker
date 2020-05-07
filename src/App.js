import React from 'react';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import ListExpensesComponent from './components/ListExpensesComponent';
import AddEditExpenseComponent from './components/AddEditExpenseComponent';

function App() {
  return (
    <div className="App">
      <Router>
      <Switch>
          <Route exact path="/">
            <ListExpensesComponent />
          </Route>
          <Route path="/addexpense">
            <AddEditExpenseComponent />
          </Route>
        </Switch>
        </Router>
      
    </div>
  );
}

export default App;
