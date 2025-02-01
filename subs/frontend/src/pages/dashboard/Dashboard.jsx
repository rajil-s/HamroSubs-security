import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../apis/api";
import ProductCard from "../../components/ProductCard";
import FooterCard from "../../components/FooterCard";
import "./Style.css";

const Homepage = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    useEffect(() => {
        getAllProducts().then((res) => {
            setProducts(res.data.data);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => {
        if (pageNumber < 1) pageNumber = 1;
        if (pageNumber > Math.ceil(products.length / productsPerPage))
            pageNumber = Math.ceil(products.length / productsPerPage);
        setCurrentPage(pageNumber);
    };

    return (
        <div>
        
        <div className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h1 className="fw-bold text-start">Explore a wide selection of subscriptions & gift cards.</h1>
                    <button className="btn btn-primary mt-3">Shop now</button>
                </div>
                <img src="assets/images/gc.png" className="img-fluid hand-image" alt="hand pictures" />
            </div>
            <div>
                <h3 className="mb-4 fw-semibold">EXPLORE BY PLATFORMS</h3>
                <div className="row text-center">
                    <div className="col-md-3 mb-4">
                        <a href="/epic-games-store">
                            <img src="assets/images/homepage/elgo.png" className="img-fluid" alt="Epic Games Store" />
                        </a>
                    </div>
                    <div className="col-md-3 mb-4">
                        <a href="/playstation">
                            <img src="assets/images/homepage/plgo.png" className="img-fluid" alt="PlayStation" />
                        </a>
                    </div>
                    <div className="col-md-3 mb-4">
                        <a href="/xbox">
                            <img src="assets/images/homepage/xlgo.png" className="img-fluid" alt="Xbox" />
                        </a>
                    </div>
                    <div className="col-md-3 mb-4">
                        <a href="/steam">
                            <img src="assets/images/homepage/slgo.png" className="img-fluid" alt="Steam" />
                        </a>
                    </div>
                </div>
            </div>

            <h3 className="mb-4 fw-semibold">Featured Products</h3>
            <div className='row container-fluid'>
                {currentProducts.map((singleProduct, index) => (
                    <div key={index} className='col-12 p-1 col-sm-6 col-lg-3'>
                        <ProductCard productInformation={singleProduct} color={"green"} />
                    </div>
                ))}
            </div>

            <div className='pagination-container'>
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                    &lt;
                </button>
                <input type='number' value={currentPage} onChange={(e) => paginate(Number(e.target.value))} min='1' max={Math.ceil(products.length / productsPerPage)} className='page-input' />
                <span>of {Math.ceil(products.length / productsPerPage)}</span>
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(products.length / productsPerPage)}>
                    &gt;
                </button>
            </div>
            

            
        </div>
        <FooterCard />
    </div>
    );
};

export default Homepage;