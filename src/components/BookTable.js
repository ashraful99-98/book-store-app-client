import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Collapse, Form, Card, Row, Col } from "react-bootstrap";
import { AiFillLike, AiOutlineInbox } from "react-icons/ai";
import { FaRandom } from "react-icons/fa";
import { CSVLink } from "react-csv";
import "./bookTable.css";

const BookTable = () => {
    const [books, setBooks] = useState([]);
    const [seed, setSeed] = useState(12345);
    const [region, setRegion] = useState("en");
    const [reviews, setReviews] = useState(1);
    const [page, setPage] = useState(1);
    const [expandedRow, setExpandedRow] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            // const { data } = await axios.get(`http://localhost:5000/api/books`, {
            const { data } = await axios.get(`https://book-store-app-server-yp86.onrender.com/api/books`, {
                params: { seed, page, region, reviews },
            });
            setBooks((prev) => [...prev, ...data]);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        setBooks([]);
        setPage(1);
        fetchBooks();
    }, [seed, region, reviews]);

    useEffect(() => {
        fetchBooks();
    }, [page]);

    const handleExpand = (index) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    return (
        <div className="container mt-4">
            <Form className="mb-3 d-flex gap-3">
                <Form.Group>
                    <Form.Label>Language</Form.Label>
                    <Form.Select value={region} onChange={(e) => setRegion(e.target.value)}>
                        <option value="en">English</option>
                        <option value="fr">French</option>
                    </Form.Select>
                </Form.Group>

                <Card className="p-2 border border-primary shadow-md">
                    <Form.Group>
                        <Form.Label className="fw-bold">Seed</Form.Label>
                        <div className="d-flex gap-2 align-items-center">
                            <Form.Control
                                type="number"
                                value={seed}
                                onChange={(e) => setSeed(e.target.value)}
                                className="flex-grow-1"
                            />
                            <Button
                                onClick={() => setSeed(Math.floor(Math.random() * 100000))}
                                className="d-flex align-items-center gap-2"
                                variant="primary"
                            >
                                <FaRandom size={20} /> Random
                            </Button>
                        </div>
                    </Form.Group>
                </Card>


                <Form.Group>
                    <Form.Label>Reviews</Form.Label>
                    <Form.Control
                        type="number"
                        value={reviews}
                        step="1"
                        onChange={(e) => setReviews(e.target.value)}
                    />
                </Form.Group>


                <CSVLink
                    data={books}
                    filename="books.csv"
                    className="btn btn-success d-flex align-items-center justify-content-center gap-2 export-btn"
                >
                    <AiOutlineInbox size={20} color="white" /> Export CSV
                </CSVLink>
            </Form>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>ISBN</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Publisher</th>
                        <th>Uploaded</th>
                    </tr>
                </thead>

                <tbody>
                    {books.map((book, index) => (
                        <React.Fragment key={index}>
                            <tr onClick={() => handleExpand(index)}>
                                <td>{index + 1}</td>
                                <td>{book.isbn}</td>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.publisher}</td>
                                <td>{new Date(book.uploaded).toLocaleDateString()}</td>

                            </tr>
                            <tr>
                                <td colSpan="6">
                                    <Collapse in={expandedRow === index}>
                                        <div className="p-3">
                                            <Card className="bg-light rounded shadow p-3">
                                                <Row className="align-items-center">
                                                    <Col xs={3} md={2}>
                                                        <img
                                                            src={book.cover}
                                                            alt="cover"
                                                            className="img-fluid rounded mb-2"
                                                            style={{ maxWidth: "150px" }}
                                                        />
                                                        <div className="p-1 rounded bg-primary text-light d-inline-flex align-items-center">
                                                            <h5 className="mb-0 fs-6">{book.likes}</h5>
                                                            <AiFillLike size={15} className="ms-1" />
                                                        </div>

                                                    </Col>
                                                    <Col>
                                                        <h4 className="fw-bold">{book.title}</h4>
                                                        <p className="text-muted">by {book.author}</p>
                                                        <h5 className="mt-3">Reviews</h5>
                                                        {book.reviews.length > 0 ? (
                                                            book.reviews.map((rev, i) => (
                                                                <p key={i} className="text-secondary">
                                                                    "{rev.text}" - <i>{rev.author}</i> ({rev.company})
                                                                </p>
                                                            ))
                                                        ) : (
                                                            <p className="text-muted">No reviews</p>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </div>
                                    </Collapse>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </Table>

            {loading ? <p>Loading...</p> : <Button onClick={() => setPage(page + 1)}>Load More</Button>}
        </div>
    );
};

export default BookTable;

