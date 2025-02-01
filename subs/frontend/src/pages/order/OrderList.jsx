import { Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getUserOrdersApi } from '../../apis/api';
import './OrderList.css';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('all');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getUserOrdersApi();
                setOrders(data.data.orders);
                setFilteredOrders(data.data.orders);
            } catch (err) {
                toast.error('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        setFilteredOrders(
            selectedStatus === 'all'
                ? orders
                : orders.filter(order => order.status === selectedStatus)
        );
    }, [selectedStatus, orders]);

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="order-list-container">
                    <div className="header-container">
                        <h2 className="header">Your Orders</h2>
                        <select className="filter-select" value={selectedStatus} onChange={handleStatusChange}>
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="confirm">Confirm</option>
                            <option value="shipping">Shipping</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancel">Canceled</option>
                        </select>
                    </div>
                    {[...Array(3)].map((_, index) => (
                        <Skeleton key={index} active avatar paragraph={{ rows: 4 }} />
                    ))}
                </div>
            </div>
        );
    }

    if (!filteredOrders.length) {
        return (
            <div className="page-container">
                <div className="order-list-container">
                    <div className="header-container">
                        <h2 className="header">Your Orders</h2>
                        <select className="filter-select" value={selectedStatus} onChange={handleStatusChange}>
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="confirm">Confirm</option>
                            <option value="shipping">Shipping</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancel">Canceled</option>
                        </select>
                    </div>
                    <p>No orders found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="order-list-container">
                <div className="header-container">
                    <h2 className="header">Your Orders</h2>
                    <select className="filter-select" value={selectedStatus} onChange={handleStatusChange}>
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirm">Confirm</option>
                        <option value="shipping">Shipping</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancel">Canceled</option>
                    </select>
                </div>
                {filteredOrders.map((order) => (
                    <div className="order-card" key={order._id}>
                        <div className="order-header">
                            
                            <span className={`status status-${order.status}`}>{order.status}</span>
                        </div>
                        <div className="order-info">
                            <p><strong>Total:</strong> Rs. {order.total}</p>
                            <p><strong>Address:</strong> {order.address}</p>
                            <p><strong>Payment:</strong> {order.paymentType}</p>
                            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            <p><strong>Order ID:</strong> {order._id}</p>
                            <p><strong>Items:</strong> {order.carts.length}</p>
                        </div>
                        
                        <ul className="items-list">
                            {order.carts.map((item) => (
                                <li className="item" key={item._id}>
                                    <img className="product-image" src={`https://localhost:5000/products/${item.productID.productImage}`} alt={item.productID.productName} />
                                    <div>
                                        <p><strong>Product:</strong> {item.productID.productName}</p>
                                        <p><strong>Quantity:</strong> {item.quantity}</p>
                                        <p><strong>Price:</strong> Rs. {item.productID.productPrice}</p>
                                        <p><strong>Total:</strong> Rs. {item.quantity * item.productID.productPrice}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderList;
