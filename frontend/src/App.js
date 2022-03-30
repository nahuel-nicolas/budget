import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  Link
} from "react-router-dom";
import BudgetForm from './BudgetForm';
import Vehicle from './Vehicle';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<BudgetForm />} />
          <Route path="vehicle">
            <Route path=":vehicle_type">
              <Route path=":vehicle_id" element={<Vehicle />} />
            </Route>
          </Route>
          <Route
            path="*"
            element={
              <main>
                <h2>Error 404</h2>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
