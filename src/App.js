import './App.css';
import React, { useEffect } from 'react';
import API from './services/API'

function App() {
  useEffect(() => {

    const fetchData = async () => {
      const data = await API.getQuestions()
    }
    fetchData()
  }, [])
  return (
    <div className="App">

    </div>
  );
}

export default App;
