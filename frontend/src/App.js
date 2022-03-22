import './App.css';
import React, {useEffect, useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  Link
} from "react-router-dom";
import BudgetForm from './BudgetForm';

// async function fetcher() {
//   const response = await fetch(
//     'http://127.0.0.1:8000/desperfecto/', 
//     {
//       method: "POST",
//       headers: {
//         'Accept': 'application/json, text/plain, */*',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         "descripcion": "hey",
//         "mano_de_obra": 4,
//         "tiempo_dias": 5,
//         "repuestos": ["http://127.0.0.1:8000/repuesto/7/"]
//       })
//     }
//   )
//   const responseData = await response.json();
//   debugger;
// }

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" exact element={<BudgetForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
