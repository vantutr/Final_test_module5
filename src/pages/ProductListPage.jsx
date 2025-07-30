import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  Spinner,
  Pagination,
} from "react-bootstrap";
import toast from "react-hot-toast";
import * as api from "../services/api";
import { formatDate } from "../utils/formatter";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

const ITEMS_PER_PAGE = 5;

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);
      const sortedProducts = productsRes.data.sort(
        (a, b) => a.quantity - b.quantity
      );
      setProducts(sortedProducts);
      setCategories(categoriesRes.data);
    } catch (error) {
      toast.error("Không thể tải dữ liệu.");
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categoryMap = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.id] = cat.name;
      return acc;
    }, {});
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory
        ? product.categoryId === filterCategory
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, filterCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleShowDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setProductToDelete(null);
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await api.deleteProduct(productToDelete.id);
      toast.success(`Đã xóa sản phẩm "${productToDelete.name}"!`);
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== productToDelete.id)
      );
      handleCloseDeleteModal();
    } catch (error) {
      toast.error("Xóa sản phẩm thất bại.");
      console.error("Failed to delete product:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <>
      <div className="main-container">
        <h1 className="mb-4 fw-bold">Quản lý Sản phẩm</h1>

        <Form className="mb-4">
          <Row>
            <Col md={6}>
              <Form.Group controlId="searchTerm">
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm theo tên sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="filterCategory">
                <Form.Select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Tất cả loại sản phẩm</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Loại sản phẩm</th>
              <th>Ngày nhập</th>
              <th className="text-center">Số lượng</th>
              <th className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{categoryMap[product.categoryId] || "N/A"}</td>
                  <td>{formatDate(product.importDate)}</td>
                  <td className="text-center">{product.quantity}</td>
                  <td className="text-center">
                    <Button
                      as={Link}
                      to={`/edit/${product.id}`}
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                    >
                      Cập nhật
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleShowDeleteModal(product)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted py-5">
                  Không tìm thấy sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center">
            <Pagination>
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages).keys()].map((number) => (
                <Pagination.Item
                  key={number + 1}
                  active={number + 1 === currentPage}
                  onClick={() => handlePageChange(number + 1)}
                >
                  {number + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        productName={productToDelete?.name || ""}
      />
    </>
  );
};

export default ProductListPage;
