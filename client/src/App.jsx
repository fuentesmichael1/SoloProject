import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChoreList from './components/ChoreList.jsx';
import ChoreDetails from './components/ChoreDetails.jsx';
import AddChore from './components/AddChore.jsx';
import UpdateChore from './components/UpdateChore.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';

function App() {
    return (
        <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-chore" element={<AddChore />} />
            <Route path="/chores/:id/edit" element={<UpdateChore />} />
            <Route path="/chores/:id/details" element={<ChoreDetails />} />
            <Route path="/chores" element={<ChoreList />} />
          </Routes>
        </div>
        </Router>
    );
}

export default App;
