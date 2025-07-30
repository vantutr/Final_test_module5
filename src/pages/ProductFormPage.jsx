import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Spinner } from "react-bootstrap";
import * as api from "../services/api";
import toast from "react-hot-toast";

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [product, setProduct] = useState({
    name: "",
    categoryId: "",
    quantity: "",
    importDate: "",
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await api.getCategories();
        setCategories(categoriesRes.data);
        if (isEditMode) {
          const productRes = await api.getProductById(id);
          const productData = productRes.data;
          setProduct({
            ...productData,
            importDate: productData.importDate
              ? new Date(productData.importDate).toISOString().split("T")[0]
              : "",
          });
        }
      } catch (error) {
        toast.error("Không thể tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEditMode]);

  const validate = () => {
    const newErrors = {};
    if (!product.name) newErrors.name = "Tên sản phẩm không được để trống.";
    else if (product.name.length > 100)
      newErrors.name = "Tên sản phẩm không quá 100 ký tự.";
    if (!product.categoryId)
      newErrors.categoryId = "Vui lòng chọn loại sản phẩm.";
    if (!product.quantity) newErrors.quantity = "Số lượng không được để trống.";
    else if (
      Number(product.quantity) <= 0 ||
      !Number.isInteger(Number(product.quantity))
    ) {
      newErrors.quantity = "Số lượng phải là số nguyên lớn hơn 0.";
    }
    if (!product.importDate)
      newErrors.importDate = "Ngày nhập không được để trống.";
    else if (new Date(product.importDate) > new Date()) {
      newErrors.importDate = "Ngày nhập không được lớn hơn ngày hiện tại.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }
    try {
      const dataToSubmit = {
        ...product,
        quantity: Number(product.quantity),
        importDate: new Date(product.importDate).toISOString(),
      };
      const message = isEditMode
        ? "Cập nhật thành công!"
        : "Thêm mới thành công!";
      const action = isEditMode
        ? api.updateProduct(id, dataToSubmit)
        : api.createProduct(dataToSubmit);
      await action;
      toast.success(message);
      navigate("/");
    } catch (error) {
      toast.error("Đã xảy ra lỗi!");
    }
  };

  if (loading && isEditMode)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <div className="main-container">
      <h1 className="mb-4 fw-bold">
        {isEditMode ? "Cập nhật Sản phẩm" : "Thêm Sản phẩm Mới"}
      </h1>
      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group className="mb-4" controlId="name">
          <Form.Label>Tên sản phẩm</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4" controlId="categoryId">
          <Form.Label>Loại sản phẩm</Form.Label>
          <Form.Select
            name="categoryId"
            value={product.categoryId}
            onChange={handleChange}
            isInvalid={!!errors.categoryId}
          >
            <option value="">-- Chọn loại sản phẩm --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.categoryId}
          </Form.Control.Feedback>
        </Form.Group>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-4" controlId="quantity">
              <Form.Label>Số lượng</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={product.quantity}
                onChange={handleChange}
                isInvalid={!!errors.quantity}
              />
              <Form.Control.Feedback type="invalid">
                {errors.quantity}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-4" controlId="importDate">
              <Form.Label>Ngày nhập</Form.Label>
              <Form.Control
                type="date"
                name="importDate"
                value={product.importDate}
                onChange={handleChange}
                isInvalid={!!errors.importDate}
              />
              <Form.Control.Feedback type="invalid">
                {errors.importDate}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <div className="mt-4 text-end">
          <Button
            variant="secondary"
            onClick={() => navigate("/")}
            className="me-2"
          >
            Hủy
          </Button>
          <Button variant="primary" type="submit">
            {isEditMode ? "Lưu thay đổi" : "Thêm sản phẩm"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProductFormPage;
