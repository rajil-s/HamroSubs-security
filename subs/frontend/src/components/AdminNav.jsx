import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./AdminNav.css"; // Import the CSS file for styles

const AdminNav = () => {
    const user = JSON.parse(localStorage.getItem("userData"));
    const location = useLocation(); // Get the current route location

    const handleLogout = () => {
        localStorage.removeItem("userData");
        window.location.href = "/login"; // Redirect to login page after logout
    };

    return (
        <nav className='sidebar'>
            <div className='logo'>
                <Link className='navbar-brand' to="/">
                    
                    <h2 className='logo-text'>HamroSubs</h2>
                </Link>
            </div>

            <ul className='nav-list'>
                <li className={`nav-item ${location.pathname === "/admin" ? "active" : ""}`}>
                    <Link to='/admin' className='nav-link'>
                        📦 Products
                    </Link>
                </li>
                <li className={`nav-item ${location.pathname === "/admin/order" ? "active" : ""}`}>
                    <Link to='/admin/order' className='nav-link'>
                        📜 Orders
                    </Link>
                </li>
                <li className={`nav-item ${location.pathname === "/admin/customers" ? "active" : ""}`}>
                    <Link to='/admin/customers' className='nav-link'>
                        👥 Customers
                    </Link>
                </li>
                <li className='nav-item'>
                    <Link onClick={handleLogout} className='nav-link logout'>
                        🚪 Log Out
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default AdminNav;
