import React, { useEffect, useState } from "react";
import { Button, Card, Form, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getSingleProduct, updateProduct } from "../../../apis/api";
import AdminNav from "../../../components/AdminNav";
import FooterCard from "../../../components/FooterCard";

const UpdateProduct = () => {
  const { id } = useParams();

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productNewImage, setProductNewImage] = useState(null);
  const [previewNewImage, setPreviewNewImage] = useState(null);
  const [oldImage, setOldImage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getSingleProduct(id)
      .then((res) => {
        setProductName(res.data.data.productName);
        setProductPrice(res.data.data.productPrice);
        setProductCategory(res.data.data.productCategory);
        setProductDescription(res.data.data.productDescription);
        setOldImage(res.data.data.productImage);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const handleImage = (event) => {
    const file = event.target.files[0];
    setProductNewImage(file);
    setPreviewNewImage(URL.createObjectURL(file));
  };

  const handleUpdateProduct = () => {
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productPrice", productPrice);
    formData.append("productCategory", productCategory);
    formData.append("productDescription", productDescription);

    if (productNewImage) {
      formData.append("productImage", productNewImage);
    }

    updateProduct(id, formData)
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message);
        }
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast.error(error.response.data.message);
        } else if (error.response.status === 400) {
          toast.error(error.response.data.message);
        }
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowModal(true);
  };

  const handleConfirmUpdate = () => {
    setShowModal(false);
    handleUpdateProduct();
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-2 p-0">
            <AdminNav />
          </div>
          <div className="col-7 d-flex flex-column align-items-center">
            <h1 className="my-4 text-center" style={{ color: "#0A0F22" }}>
              Update Product
            </h1>

            <Card
              className="shadow-lg border-0 p-4"
              style={{
                maxWidth: "1100px",
                width: "95%",
                background: "linear-gradient(to right,rgb(255, 255, 255),rgb(255, 255, 255))",
                color: "#fff",
                borderRadius: "12px",
              }}
            >
              <div className="row">
                {/* Image Section */}
                <div className="col-md-6 d-flex align-items-center justify-content-center">
                  <img
                    src={previewNewImage || `https://localhost:5000/products/${oldImage}`}
                    alt="Product Preview"
                    style={{
                      maxHeight: "300px",
                      maxWidth: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>

                {/* Form Section */}
                <div className="col-md-6">
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: "bold", color: "#0A0F22" }}>
                        Product Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                        style={{ borderColor: "#0A0F22" }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: "bold", color: "#0A0F22" }}>
                        Product Price
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        required
                        style={{ borderColor: "#0A0F22" }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: "bold", color: "#0A0F22" }}>
                        Category
                      </Form.Label>
                      <Form.Select
                        value={productCategory}
                        onChange={(e) => setProductCategory(e.target.value)}
                        required
                        style={{ borderColor: "#0A0F22" }}
                      >
                        <option value="" disabled>
                          Select a category
                        </option>
                        <option value="beer">Beer</option>
                        <option value="wine">Wine</option>
                        <option value="whiskey">Whiskey</option>
                        <option value="vodka">Vodka</option>
                        <option value="rum">Rum</option>
                        <option value="gin">Gin</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: "bold", color: "#0A0F22" }}>
                        Description
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        required
                        style={{ borderColor: "#0A0F22" }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: "bold", color: "#0A0F22" }}>
                        Product Image
                      </Form.Label>
                      <Form.Control type="file" onChange={handleImage} style={{ borderColor: "#0A0F22" }} />
                    </Form.Group>

                    <Button
                      type="submit"
                      className="w-100"
                      style={{
                        backgroundColor: "#0A0F22",
                        borderColor: "#0A0F22",
                        fontWeight: "bold",
                        transition: "0.3s",
                      }}
                      onMouseOver={(e) => (e.target.style.backgroundColor = "#e67600")}
                      onMouseOut={(e) => (e.target.style.backgroundColor = "#0A0F22")}
                    >
                      Update Product
                    </Button>
                  </Form>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
      </div>

      {/* Modal for confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to update this product?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button style={{ background: "#0A0F22", borderColor: "#0A0F22" }} onClick={handleConfirmUpdate}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateProduct;
