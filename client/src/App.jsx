import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddContact from './pages/AddContact';
import UpdateContact from './pages/UpdateContact';
import ShowContact from './pages/ShowContact';
import NotFound from './pages/NotFound';
import './main.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-contact" element={<AddContact />} />
        <Route path="/update-contact/:id" element={<UpdateContact />} />
        <Route path="/show-contact/:id" element={<ShowContact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
