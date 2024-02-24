import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'; 
import Header from './components/Header';
import Metrics from './components/Metrics';
import Log from './components/Log';

function App() {
  return (
    <Router>
      <Header/> 
      <Routes>
        <Route path="/" element={<Metrics/>}/>
        <Route path="/logs" element={<Log/>}/>
        <Route path="/metrics" element={<Metrics/>}/> 
      </Routes>
    </Router>
  );
}
 
export default App;
