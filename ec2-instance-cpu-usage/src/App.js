import './App.css';
import React from 'react';
import Plot from './components/Plot'

function App() {

  const [chart, setChart] = React.useState(24);
  const [ip, setIp] = React.useState('00.00');
  const [interval, setInterval] = React.useState(1);
  const [timeStamps, setTimeStamps] = React.useState([]);
  const [cpuValues, setCpuValues] = React.useState([]);

  const onClick = () => {

    return fetch(`http://localhost:3005?chart=${chart}&ip=${ip}&interval=${interval}`, {
             method: 'GET',
           })
           .then(res => {
             if (res.ok) {
               return res.json();
             }
             return Promise.reject(`Error: ${res.status}`);
           })
           .then(res => {
             setTimeStamps((res[0].Timestamps));
             setCpuValues((res[0].Values));
           })
           .catch(err => {
             console.log(err);
           })
   };

  const onChartChange = (evt) => {
    setChart(evt.target.value);
  }

  const onIpChange = (evt) => {
    setIp(evt.target.value)
  }

  const onIntervalChange = (evt) => {
    setInterval(evt.target.value)
  }

  return (
    <div className="App">
      <h1>CPU Usage</h1>
      <input placeholder="Set interval" className="input" onChange={onIntervalChange}/>
      <input placeholder="Enter ip" className="input" onChange={onIpChange}/>
      <select className="input" value={chart} onChange={onChartChange}>
        <option value="24">Last 24 hours</option>
        <option value="48">Last 48 hours</option>
        <option value="72">Last 72 hours</option>
      </select>
      <button className="button" onClick={onClick}>Load</button>
      <Plot timeStamps={timeStamps} cpuValues={cpuValues}/>
    </div>
  );
}

export default App;
