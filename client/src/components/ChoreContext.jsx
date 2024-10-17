import React, { createContext, useState, useContext } from 'react';

const ChoreContext = createContext();

export const ChoreProvider = ({ children }) => {
    const [chores, setChores] = useState([]);

    const updateChore = (updatedChore) => {
        setChores(prevChores => prevChores.map(chore => 
            chore._id === updatedChore._id ? updatedChore : chore
        ));
    };

    return (
        <ChoreContext.Provider value={{ chores, setChores, updateChore }}>
            {children}
        </ChoreContext.Provider>
    );
};

export const useChores = () => useContext(ChoreContext);
