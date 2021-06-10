import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';

function Dashboard() {
    const { loginWithRedirect } = useAuth0();
    return (
        <div className="container">
            <div className="dashboard">
                <h4 className="title">welcome to <span className="app-title">Chatter</span></h4>
                <button
                    className="btn btn-primary"
                    onClick={() => loginWithRedirect()}
                >
                    Login
                </button>
                <button
                    className="btn btn-light"
                    onClick={() => loginWithRedirect({ screen_hint: "signup" })}
                >
                    Sign Up
                </button>
            </div>
        </div>
    )
}

export default Dashboard;