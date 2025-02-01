import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCartApi } from "../apis/api";

import "./ProductCard.css";

const ProductCard = ({ productInformation }) => {
    const [quantity, setQuantity] = useState(1);

    const increaseQuantity = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const decreaseQuantity = () => {
        setQuantity((prevQuantity) =>
            prevQuantity > 1 ? prevQuantity - 1 : prevQuantity
        );
    };

    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem("userData"));

    const handleCartButton = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("userID", user._id);
        formData.append("productID", productInformation._id);
        formData.append("productPrice", productInformation.productPrice);
        formData.append("quantity", quantity);

        addToCartApi(formData)
            .then((res) => {
                if (res.data.success === false) {
                    toast.error(res.data.message);
                } else {
                    toast.success(res.data.message);
                }
            })
            .catch((err) => {
                toast.error("Server Error");
                console.log(err.message);
            });
    };

    return (
        <div className='product-card'>
            <div className='fixed-image'>
                <a href={`/product/${productInformation._id}`} className='h-100 w-100'>
                    <img
                        className='w-100 h-100'
                        src={`https://localhost:5000/products/${productInformation.productImage}`}
                        alt={productInformation.productName}
                    />
                </a>
            </div>
            <div className='card-body'>
                <h5 className='card-title'>{productInformation.productName}</h5>
                <p className='card-text'>
                    {productInformation.productDescription}
                </p>
                <div className='category-tag'>
                    <p>{productInformation.productCategory}</p>
                </div>
                <div className='row'>
                    <div className='col-6'>
                        <div className='quantity-control d-flex align-items-center'>
                            <button onClick={decreaseQuantity} className='qty-btn'>
                                <FaMinus />
                            </button>
                            <span className='mx-2'>{quantity}</span>
                            <button onClick={increaseQuantity} className='qty-btn'>
                                <FaPlus />
                            </button>
                        </div>
                        <span className='text-secondary' style={{ fontSize: "0.7rem" }}>
                            Quantity
                        </span>
                    </div>
                    <div className='col-6 d-flex flex-column align-items-end'>
                        <p className='card-price m-0'>
                            NPR.{productInformation.productPrice}
                        </p>
                        <span className='text-secondary' style={{ fontSize: "0.7rem" }}>
                            Price
                        </span>
                    </div>
                </div>
                <div className='d-flex justify-content-end'>
                    <button onClick={handleCartButton} className='add-to-cart-btn'>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
