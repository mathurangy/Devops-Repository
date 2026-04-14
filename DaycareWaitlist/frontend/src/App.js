import React, { useState, useEffect } from "react";
import './App.css';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Navbar from "./components/Navbar"; 

function App() {
  const [page, setPage] = useState("home");

  //Fix API timeout issue
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setPage("dashboard");
    }
  }, []);

  
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  setPage("home");
};

 
  const isLoggedIn = page === "dashboard";

  return (
    <div>
      
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <div className="container">
        {page === "home" && <Home setPage={setPage} />}
        {page === "login" && <Login setPage={setPage} />}
        {page === "register" && <Register setPage={setPage} />}
        {page === "dashboard" && <Dashboard setPage={setPage} />}
      </div>
    </div>
  );
}

export default App;