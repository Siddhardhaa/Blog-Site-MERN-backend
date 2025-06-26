const express = require('express');
const router = express.Router();
const Post = require('../models/post');

router.get('/', async (req, res) => {
    try {
        const Posts = await Post.find().sort({ createdAtIndex: -1 });
        return res.json(Posts);
    } catch (err) {
        console.error("Error in Fetching Posts", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/user/name', async (req, res) => {
    try {
        const userBlogs = await Post.find(req.params.name);
        if (!userBlogs) {
            return res.status(400).json({ message: 'User Not Found' });
        }
        return res(userBlogs);
    } catch (err) {
        console.error("Error in Fetching Blog Post");
        res.status(500).json({ message: "Server Error" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Blog Not Found" });
        }
        res.json(post);
    } catch (err) {
        console.error("Error in Fetching Blog Post");
        res.status(500).json({ message: "Server Error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, content, author, tags, imageUrl } = req.body;
        const newPost = new Post({ title, content, author, tags, imageUrl });
        const savedPost = await newPost.save();
        res.json(savedPost);
    } catch (err) {
        console.error("Error in Adding Blog Post", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { title, content, tags, imageUrl } = req.body;
        const updatePost = await Post.findByIdAndUpdate(
            req.params.id,
            { title, content, tags, imageUrl },
            { new: true }
        );
        if (!updatePost) {
            return res.status(404).json({ message: "Blog Post Not Found" });
        }
        res.json(updatePost);
    } catch (err) {
        console.error("Error in Updating Blog");
        res.status(500).json({ message: "Server Error" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deletePost = await Post.findByIdAndDelete(req.params.id);
        if (!deletePost) {
            return res.status(404).json({ message: "Blog Post Doesn't Exist" });
        }
        res.json({ message: 'Blog Deleted Successfully' });
    } catch (err) {
        console.error("Error in Deleting Blog", err);
        return res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
