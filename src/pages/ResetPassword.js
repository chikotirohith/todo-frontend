import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");  // ✅ Ensure state variable is correct

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password.trim()) {
            alert("Password cannot be empty");
            return;
        }
    
        try {
            const response = await fetch(`http://127.0.0.1:10000/reset-password/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",  // ✅ Ensure correct JSON format
                    "Accept": "application/json",
                },
                credentials: "include",  // ✅ Ensure cookies and tokens are sent
                body: JSON.stringify({ password }),  // ✅ Ensure password is sent correctly
            });
    
            const data = await response.json();
            if (response.ok) {
                alert("Password reset successful!");
                navigate("/login");
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while resetting password.");
        }
    };
    

    return (
        <div className="reset-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;
