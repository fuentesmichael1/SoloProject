import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage.jsx';
import ChoreList from './components/ChoreList.jsx';
import ChoreDetails from './components/ChoreDetails.jsx';
import AddChore from './components/AddChore.jsx';
import UpdateChore from './components/UpdateChore.jsx';

function App() {
    return (
        <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/chores/new" element={<AddChore />} />
            <Route path="/chores/:id/edit" element={<UpdateChore />} />
            <Route path="/chores/:id" element={<ChoreDetails />} />
            <Route path="/dashboard" element={<ChoreList />} />
          </Routes>
        </div>
        </Router>
    );
}

export default App;
