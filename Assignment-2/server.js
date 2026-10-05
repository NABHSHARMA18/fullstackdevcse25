import express from "express";
import fs from "fs";
const app = express();
const PORT = 3000;
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Product REST API is running");
});
app.get("/products", (req, res) => {
    fs.readFile("products.json", "utf8", (err, data) => {
        if (err) {
            res.status(500).json({
                error: "Error reading products"
            });
            return;
        }
        res.json(JSON.parse(data));
    });
});
app.get("/products/:id", (req, res) => {
    fs.readFile("products.json", "utf8", (err, data) => {
        if (err) {
            res.status(500).json({
                error: "Error reading products"
            });
            return;
        }
        const products = JSON.parse(data);
        const product = products.find(p => p.id == req.params.id);
        if (!product) {
            res.status(404).json({
                error: "Product not found"
            });
            return;
        }
        res.json(product);
    });
});
app.post("/products", (req, res) => {
    fs.readFile("products.json", "utf8", (err, data) => {
        if (err) {
            res.status(500).json({
                error: "Error reading products"
            });
            return;
        }
        const products = JSON.parse(data);
        const newProduct = {
            id: products.length + 1,
            name: req.body.name,
            price: req.body.price,
            category: req.body.category
        };
        products.push(newProduct);
        fs.writeFile(
            "products.json",
            JSON.stringify(products, null, 2),
            err => {
                if (err) {
                    res.status(500).json({
                        error: "Error saving product"
                    });
                    return;
                }
                res.status(201).json(newProduct);
            }
        );
    });
});
app.put("/products/:id", (req, res) => {
    fs.readFile("products.json", "utf8", (err, data) => {
        if (err) {
            res.status(500).json({
                error: "Error reading products"
            });
            return;
        }
        const products = JSON.parse(data);
        const product = products.find(p => p.id == req.params.id);
        if (!product) {
            res.status(404).json({
                error: "Product not found"
            });
            return;
        }
        product.name = req.body.name;
        product.price = req.body.price;
        product.category = req.body.category;
        fs.writeFile(
            "products.json",
            JSON.stringify(products, null, 2),
            err => {
                if (err) {
                    res.status(500).json({
                        error: "Error updating product"
                    });
                    return;
                }
                res.json(product);
            }
        );
    });
});
app.delete("/products/:id", (req, res) => {
    fs.readFile("products.json", "utf8", (err, data) => {
        if (err) {
            res.status(500).json({
                error: "Error reading products"
            });
            return;
        }
        let products = JSON.parse(data);
        const id = req.params.id;
        const product = products.find(p => p.id == id);
        if (!product) {
            res.status(404).json({
                error: "Product not found"
            });
            return;
        }
        products = products.filter(p => p.id != id);
        fs.writeFile(
            "products.json",
            JSON.stringify(products, null, 2),
            err => {
                if (err) {
                    res.status(500).json({
                        error: "Error deleting product"
                    });
                    return;
                }
                res.json({
                    message: "Product deleted successfully"
                });
            }
        );
    });
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});