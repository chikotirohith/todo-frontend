import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/styles.css"; 

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting Registration:", email, password);
  
        try {
            const response = await fetch("/register", {  
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: email, password }), // ✅ Corrected field name
            });

            console.log("Response Status:", response.status);
  
            const data = await response.json();
            console.log("Response Data:", data);
          
            if (response.ok) {
                console.log("Registration Successful:", data);
                alert("Registration Successful!");
                navigate("/login");  // ✅ Redirect to login page
            } else {
                console.error("Registration Failed:", data);
                alert("Registration Failed! " + data.error);
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
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
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
                    <button type="submit">Sign Up</button>
                </form>
                <p>Already have an account? <span onClick={() => navigate("/login")}>Login</span></p>
            </div>
        </div>
    );
}

export default Register;
