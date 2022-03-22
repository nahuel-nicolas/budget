import './App.css';
import React, {useEffect, useState} from 'react';

function App() {
  let [fetchValues, setFetchValues] = useState(null);
  useEffect(() => {
    fetcher();
  }, []) 

  async function fetcher() {
    console.log("effect")
    let currentFetchValues = await fetch('http://127.0.0.1:8000/moto/');
    console.log(currentFetchValues)
    let currentFetchValuesData = await currentFetchValues.json();
    setFetchValues(currentFetchValuesData);
    console.log([fetchValues, currentFetchValuesData])
  }

  return (
    <div className="App">
      <p>Hi</p>
    </div>
  );
}

export default App;
