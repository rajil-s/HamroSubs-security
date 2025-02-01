import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getallOrdersApi, getSingleProduct, updateOrderApi } from '../../../apis/api';
import AdminNav from '../../../components/AdminNav';
import FooterCard from '../../../components/FooterCard';
import OrderDetailsModal from './OrderDetailModel';

const ViewOrders = () => {
    const [orders, setOrders] = useState([]);
    const [productsCache, setProductsCache] = useState({});
    const [loading, setLoading] = useState(true);
    const [modalShow, setModalShow] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getallOrdersApi();
                setOrders(data.data.orders || []);
            } catch (err) {
                toast.error('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (orders.length === 0) return;

            const productPromises = orders.flatMap(order =>
                (order.carts || []).map(async (item) => {
                    const productId = item.productID;
                    if (!productsCache[productId]) {
                        try {
                            const product = await getSingleProduct(productId);
                            setProductsCache(prev => ({ ...prev, [productId]: product.data.data }));
                            return { productId, product: product.data.data };
                        } catch (error) {
                            return { productId, product: { productName: 'Unknown', price: 0 } };
                        }
                    }
                    return { productId, product: productsCache[productId] };
                })
            );

            await Promise.all(productPromises);
        };

        fetchProductDetails();
    }, [orders]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const updatedOrder = orders.find(order => order._id === orderId);
            if (updatedOrder) {
                updatedOrder.status = newStatus;
                await updateOrderApi(orderId, { status: newStatus });
                setOrders(prevOrders =>
                    prevOrders.map(order => order._id === orderId ? updatedOrder : order)
                );
                toast.success('Order status updated successfully');
            }
        } catch (err) {
            toast.error('Failed to update order status');
        }
    };

    const handleViewClick = (order) => {
        setSelectedOrder(order);
        setModalShow(true);
    };

    return (
        <>
            <div className="container-fluid">
                <style>
                    {`
                .container-fluid {
                    background-color: #FFFFFF;
                }

                .page-title {
                    color: black;
                    font-size: 2rem;
                    margin-bottom: 1rem;
                }

                .order-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .table thead th {
                    background-color: #0A0F22;
                    color: white;
                    font-weight: bold;
                    text-align: left;
                }

                .table tbody tr {
                    background-color: white;
                    border-bottom: 1px solid black;
                }

                .table tbody tr:nth-child(even) {
                    background-color: #F5F5F5;
                }

                .product-item {
                    padding: 0.5rem;
                }

                .status-select {
                    width: 100%;
                }

                .view-btn {
                    background-color: #8C52FF;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    cursor: pointer;
                }

                .view-btn:hover {
                    background-color: black;
                }

                @media (max-width: 768px) {
                    .order-table {
                        font-size: 0.875rem;
                    }
                }
                `}
                </style>

                <div className="row">
                    <AdminNav />
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-2 mt-2">
                        {loading ? (
                            <div className="text-center">Loading...</div>
                        ) : (
                            <div className="table-responsive">
                                <h1 className="page-title">User Order Management</h1>

                                <table className="table table-striped table-bordered order-table">
                                    <thead>
                                        <tr>
                                            <th>Order Id</th>
                                            <th>Products Name</th>
                                            <th>Payment Method</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order._id}>
                                                <td style={{ color: 'black' }}>{order._id}</td>
                                                <td>
                                                    {order.carts && order.carts.length > 0 ? (
                                                        order.carts.map((item) => {
                                                            const product = productsCache[item.productID];
                                                            return product ? (
                                                                <div key={item._id} className="product-item">
                                                                    <p style={{ color: 'black' }}>{product.productName || 'Unknown'}</p>
                                                                </div>
                                                            ) : (
                                                                <p key={item._id} style={{ color: 'black' }}>Product details loading...</p>
                                                            );
                                                        })
                                                    ) : (
                                                        <p style={{ color: 'black' }}>No products</p>
                                                    )}
                                                </td>
                                                <td style={{ color: 'black' }}>{order.paymentType}</td>
                                                <td>
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                        className="form-select status-select"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="shipping">Shipping</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancel">Canceled</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <button
                                                        className="view-btn"
                                                        onClick={() => handleViewClick(order)}
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </main>
                </div>
                <OrderDetailsModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    order={selectedOrder}
                    productsCache={productsCache}
                />
            </div>
        </>
    );
};

export default ViewOrders;
