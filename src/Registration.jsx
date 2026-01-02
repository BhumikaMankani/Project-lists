import React, { useState } from "react";

function Registration({ onLoginSuccess }) {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
        if (error) setError(''); // Clear error on change
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Get users from localStorage (initialized in App.jsx)
        const storedUsers = JSON.parse(localStorage.getItem('auth-users') || '[]');

        // Find if any user matches the credentials
        // Note: In Authentication.json, keys are "Email" and "Password" (PascalCase)
        const matchedUser = storedUsers.find(
            user => user.Email === credentials.email && user.Password === credentials.password
        );

        if (matchedUser) {
            onLoginSuccess();
        } else {
            setError('Invalid email or password. Please check your credentials and try again.');
        }
    };

    return (
        <div className="registration-wrapper">
            <div className="registration-container">
                <h1>Welcome Back</h1>
                <p className="registration-subtitle">Enter your details to access your workspace</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            placeholder="name@company.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {error && <div className="login-error">{error}</div>}

                    <button type="submit">Sign In</button>
                </form>
            </div>
        </div>
    );
}

export default Registration;
