import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/styles.css";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: email }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Reset link sent to your email.");
                navigate("/login");  // Redirect to login page after reset
            } else {
                alert("Error: " + data.error);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to send reset link.");
        }
    };

    return (
        <div className="container">
            <h1 className="app-title">Reset Password</h1>
            <div className="form-box">
                <h2>Forgot Password</h2>
                <form onSubmit={handleForgotPassword}>
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <button type="submit">Send Reset Link</button>
                </form>
                <p>Back to <span onClick={() => navigate("/login")}>Login</span></p>
            </div>
        </div>
    );
}

export default ForgotPassword;
