import {BrowserRouter as Router, Route, Routes,} from "react-router-dom";
import BudgetForm from './BudgetForm';
import Vehicle from './Vehicle';
import { AuthProvider } from './Authentication/AuthContext';
import LoginPage from './Authentication/LoginPage';
import PrivateComponent from './Authentication/PrivateComponent';

function App() {
  return (
    <Router>
      <AuthProvider>
          <Routes>
            <Route path="/" element={<PrivateComponent><BudgetForm /></PrivateComponent>} />
            <Route path="vehicle/:vehicle_type/:vehicle_id" element={<Vehicle />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="*" element={<h2>Error 404</h2>} />
          </Routes>
        </AuthProvider>
    </Router>
  );
}

export default App;
