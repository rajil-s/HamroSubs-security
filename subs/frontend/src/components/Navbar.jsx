import { faBell, faDashboard, faShoppingCart, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const user = JSON.parse(localStorage.getItem('userData'));
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name_asc");
    const [products, setProducts] = useState([]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const applySearchSort = (products, searchQuery, sortBy) => {
        let filteredProducts = products;
        if (searchQuery) {
            filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        if (sortBy === "price_asc") {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price_desc") {
            filteredProducts.sort((a, b) => b.price - a.price);
        } else if (sortBy === "name_asc") {
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "name_desc") {
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        }
        setProducts(filteredProducts);
    };

    return (
        <div className="navbar-container">
            <nav className="navbar">
                <div className="navbar-logo">
                    <Link to="/">
                        <img src="assets/images/digi_logo_white.png" alt="Digi Subs Logo" />
                    </Link>
                </div>
                <div className="navbar-icons">
                    {user ? (
                        <>
                            {user.isAdmin && (
                                <Link to="/admin">
                                    <FontAwesomeIcon icon={faDashboard} className="fa-icon" />
                                </Link>
                            )}
                            <Link to="/cart">
                                <FontAwesomeIcon icon={faShoppingCart} className="fa-icon" />
                            </Link>
                            <div className="dropdown">
                                <FontAwesomeIcon icon={faUserCircle} className="fa-icon user-icon" />
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                                    <li><Link className="dropdown-item" to="/orderlist">Orders</Link></li>
                                    <li><Link className="dropdown-item" to="/address">Address</Link></li>
                                    <li><Link className="dropdown-item" to="/cart">Cart</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><button onClick={handleLogout} className="dropdown-item">Logout</button></li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to={'/login'} className=" btn-custom">Login</Link>
                        </>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
