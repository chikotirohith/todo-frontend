import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";  
import ResetPassword from "./pages/ResetPassword";
import TodoList from "./pages/TodoList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} /> {/* Default route */}
        <Route path="/login" element={<Login />} /> {/* Login route */}
        <Route path="/register" element={<Register />} /> {/* Register route */}
        <Route path="/forgot-password" element={<ForgotPassword />} /> 
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/tasks" element={<TodoList />} /> {/* Todo List route */}
      </Routes>
    </Router>
  );
}

export default App;
