import { Route, Routes } from "react-router-dom";
import "./App.css";
import AdminApp from "./containers/AdminApp";

function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<AdminApp />} />
        <Route path="/admin" element={<div>admin</div>} />
        <Route path="/doctor" element={<div>doctor</div>} />
      </Routes>
    </>
  );
}

export default App;
