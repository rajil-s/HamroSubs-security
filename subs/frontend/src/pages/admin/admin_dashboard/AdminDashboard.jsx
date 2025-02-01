import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createProductApi, deleteProduct, getAllProducts } from '../../../apis/api.js';
import AdminNav from '../../../components/AdminNav.jsx';
import './Admin.css';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productImage, setProductImage] = useState('');
    const [previewImage, setImagePreview] = useState('');
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [showAddProduct, setShowAddProduct] = useState(false);

    useEffect(() => {
        getAllProducts().then((res) => {
            setProducts(res.data.data);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    const handleImage = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
            setProductImage(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            toast.error("Only .png and .jpg files are allowed");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('productDescription', productDescription);
        formData.append('productCategory', productCategory);
        formData.append('productPrice', productPrice);
        formData.append('productImage', productImage);

        createProductApi(formData).then((res) => {
            if (res.status === 201) {
                toast.success(res.data.message);
                setProducts([...products, res.data.product]); // Add new product to the list
                setShowAddProduct(false); // Close modal after adding
            }
        }).catch((error) => {
            if (error.response) {
                if (error.response.status === 400) {
                    toast.warning(error.response.data.message);
                } else if (error.response.status === 500) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('Something went wrong.');
                }
            } else {
                toast.error('Something went wrong here.');
            }
        });
    };

    const handleDelete = () => {
        if (productToDelete) {
            deleteProduct(productToDelete).then((res) => {
                if (res.status === 201) {
                    toast.success(res.data.message);
                    setProducts(products.filter(product => product._id !== productToDelete)); // Remove deleted product from the list
                    setShowConfirmDelete(false); // Close modal after deleting
                }
            }).catch((error) => {
                if (error.response && error.response.status === 500) {
                    toast.error(error.response.data.message);
                }
            });
        }
    };

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <AdminNav />
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                            <h1 className="h2">Product Management</h1>
                            <button
                                type="button"
                                className="btn"
                                style={{ backgroundColor: '#8C52FF', color: '#fff' }}
                                onClick={() => setShowAddProduct(true)}
                            >
                                Add Product
                            </button>
                        </div>

                        {/* Add Product Modal */}
                        <div className={`modal fade ${showAddProduct ? 'show d-block' : ''}`} tabIndex="-1" aria-labelledby="addProductModalLabel" aria-hidden={!showAddProduct}>
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header" style={{ backgroundColor: '#8C52FF' }}>
                                        <h5 className="modal-title" id="addProductModalLabel" style={{ color: '#fff' }}>Add a New Product</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowAddProduct(false)} aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Product Name</label>
                                                        <input type="text" className="form-control" placeholder="Enter product name" onChange={(e) => setProductName(e.target.value)} required />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Product Price</label>
                                                        <input type="number" className="form-control" placeholder="Enter product price" onChange={(e) => setProductPrice(e.target.value)} required />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Product Description</label>
                                                        <textarea className="form-control" placeholder="Enter product description" onChange={(e) => setProductDescription(e.target.value)} required />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label">Product Category</label>
                                                        <select onChange={(e) => setProductCategory(e.target.value)} className='form-control' required>
                                                            <option value="" disabled>Select a category</option>
                                                            <option value="Games">Game</option>
                                                            <option value="Dvds">Dvds</option>
                                                            <option value="Giftcard">Giftcard</option>
                                                            <option value="subscription">Subscription</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Choose Product Image</label>
                                                        <input type="file" className="form-control" accept=".png, .jpg" onChange={handleImage} />
                                                        {previewImage && (
                                                            <img src={previewImage} alt="Product" className="img-fluid rounded mt-3" style={{ maxWidth: '100%', height: 'auto' }} />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddProduct(false)}>Close</button>
                                                <button type="submit" className="btn" style={{ backgroundColor: '#8C52FF', color: '#fff' }}>Save changes</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Confirm Delete Modal */}
                        <div className={`modal fade ${showConfirmDelete ? 'show d-block' : ''}`} tabIndex="-1" aria-labelledby="confirmDeleteLabel" aria-hidden={!showConfirmDelete}>
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header" style={{ backgroundColor: '#8C52FF' }}>
                                        <h5 className="modal-title" id="confirmDeleteLabel" style={{ color: '#fff' }}>Confirm Deletion</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowConfirmDelete(false)} aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <p>Are you sure you want to delete this product?</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmDelete(false)}>Cancel</button>
                                        <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-striped table-bordered table-hover">
                                <thead style={{ backgroundColor: '#8C52FF', color: '#fff' }}>
                                    <tr>
                                        <th scope="col">Image</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Category</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((singleProduct) => (
                                        <tr key={singleProduct._id}>
                                            <td>
                                                <img
                                                    src={`https://localhost:5000/products/${singleProduct.productImage}`}
                                                    alt="Product"
                                                    className="img-fluid"
                                                    style={{ height: 80, width: 80, objectFit: 'cover' }}
                                                />
                                            </td>
                                            <td>{singleProduct.productName}</td>
                                            <td>{singleProduct.productPrice}</td>
                                            <td>{singleProduct.productCategory}</td>
                                            <td>
                                                <Link to={`/admin/update/${singleProduct._id}`} className="btn btn-primary btn-sm me-2">Edit</Link>
                                                <button
                                                    onClick={() => {
                                                        setProductToDelete(singleProduct._id);
                                                        setShowConfirmDelete(true);
                                                    }}
                                                    className="btn btn-danger btn-sm"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </main>
                </div>
            </div>

        </>
    );
};

export default AdminDashboard;
