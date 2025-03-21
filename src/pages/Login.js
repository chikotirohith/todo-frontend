import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/styles.css"; 

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Logging in with:", email, password);
  
        try {
            const response = await fetch("https://todo-api-t7f7.onrender.com/login", { 
            // ✅ Correct API endpoint
            
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: email, password }), // ✅ Ensure correct field names
            });

            console.log("Response Status:", response.status);
  
            const data = await response.json();
            console.log("Response Data:", data);
          
            if (data.access_token) {
              localStorage.setItem("access_token", data.access_token);
              localStorage.setItem("refresh_token", data.refresh_token); 

                console.log("Login Successful:", data);
                alert("Login Successful!");
                navigate("/tasks");  
            } else {
                console.error("Login Failed:", data);
                alert("Login Failed! " + data.error);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to connect to server");
        }
    };

    return (
        <div className="container">
            <h1 className="app-title">TaskFlow - Where Productivity Begins!</h1>
            <div className="form-box">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>  {/* ✅ Ensure this is correct */}
                    <input 
                        type="email" 
                        id="email"
                        name="email"
                        placeholder="Enter Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        id="password"
                        name="password"
                        placeholder="Enter Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <button type="submit">Login</button>
                </form>
                <p>Don't have an account? <span onClick={() => navigate("/register")}>Sign Up</span></p>
                <p>Forgot your password? <span onClick={() => navigate("/forgot-password")}>Reset Password</span></p>
            </div>
        </div>
    );
}

export default Login;
