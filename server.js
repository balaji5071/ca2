const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("./schema");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

app.post("/", async (req, res) => {
    const { title, author, genre, publishedYear, availableCopies } = req.body;

    try {
        if (!title || !author || !genre || !publishedYear || !availableCopies) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newBook = new Book({
            title,
            author,
            genre,
            publishedYear,
            availableCopies,
        });

        await newBook.save();
        res.status(201).json({ message: "Book added successfully", book: newBook });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

app.get("/", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
