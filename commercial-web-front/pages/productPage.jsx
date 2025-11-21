import React, { useState, useEffect, useRef } from "react";
import Header from "../src/components/Header";

export default function productPage() {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const productsRef = useRef(null);

    // mock "fetch" for featured products
    useEffect(() => {
        const mock = [
            { id: "p1", name: "Compact Coffee Maker", price: 79, desc: "Brews great espresso in minutes." },
            { id: "p2", name: "Wireless Headphones", price: 129, desc: "Noise-cancelling, 20h battery." },
            { id: "p3", name: "Ergonomic Chair", price: 249, desc: "Lumbar support, breathable mesh." },
            { id: "p4", name: "4K Monitor 27\"", price: 329, desc: "Vivid colors, low blue light." },
        ];
        const timer = setTimeout(() => setProducts(mock), 400);
        return () => clearTimeout(timer);
    }, []);

    const addToCart = (id) =>
        setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));

    const removeFromCart = (id) =>
        setCart((c) => {
            if (!c[id]) return c;
            const next = { ...c, [id]: c[id] - 1 };
            if (next[id] <= 0) delete next[id];
            return next;
        });

    const filtered = products.filter(
        (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.desc.toLowerCase().includes(query.toLowerCase())
    );

    const scrollToProducts = () =>
        productsRef.current?.scrollIntoView({ behavior: "smooth" });

    const cartCount = Object.values(cart).reduce((s, v) => s + v, 0);

    return (
        <>
        <Header/>

        </>
        
    );
}