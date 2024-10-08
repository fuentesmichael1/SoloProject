import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChoreList from './components/ChoreList.jsx';
import ChoreDetails from './components/ChoreDetails.jsx';
import AddChore from './components/AddChore.jsx';
import UpdateChore from './components/UpdateChore.jsx';

function App() {
    return (
        <Router>
        <div className="App">
            <Routes>
                <Route path="/" element={<AddChore />} />
                <Route path="/:id/edit" element={<UpdateChore />} />
                <Route path="/:id/details" element={<ChoreDetails />} />
                <Route path="/chores" element={<ChoreList />} />
            </Routes>
        </div>
        </Router>
    );
}

export default App;
