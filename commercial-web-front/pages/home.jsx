import React, { useState, useEffect, useRef } from "react";

export default function Home() {
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
        <div className="page">
            <header className="header">
                <div className="brand">Commercial Web</div>
                <nav>
                    <button className="link" onClick={scrollToProducts}>
                        Products
                    </button>
                    <button className="cart">Cart ({cartCount})</button>
                </nav>
            </header>

            <main>
                <section className="hero">
                    <h1>Build and scale your commerce experience</h1>
                    <p>Fast, accessible storefronts with flexible integrations.</p>
                    <div className="cta-row">
                        <button className="primary" onClick={scrollToProducts}>
                            Shop Featured
                        </button>
                        <button
                            className="secondary"
                            onClick={() => alert("Demo sign-up coming soon")}
                        >
                            Request Demo
                        </button>
                    </div>
                </section>

                <section className="search" ref={productsRef}>
                    <input
                        placeholder="Search products, e.g. 'monitor'..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </section>

                <section className="grid">
                    {filtered.length === 0 ? (
                        <div className="empty">No products found.</div>
                    ) : (
                        filtered.map((p) => (
                            <article key={p.id} className="card">
                                <div className="thumb" aria-hidden>
                                    {/* Placeholder visual */}
                                    <svg viewBox="0 0 40 30" className="svg">
                                        <rect width="40" height="30" rx="3" fill="#eef2ff" />
                                        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="6" fill="#6b7280">
                                            {p.name.split(" ")[0]}
                                        </text>
                                    </svg>
                                </div>
                                <h3>{p.name}</h3>
                                <p className="desc">{p.desc}</p>
                                <div className="meta">
                                    <strong>${p.price}</strong>
                                    <div className="actions">
                                        <button onClick={() => removeFromCart(p.id)}>-</button>
                                        <span>{cart[p.id] || 0}</span>
                                        <button onClick={() => addToCart(p.id)}>+</button>
                                        <button className="buy" onClick={() => addToCart(p.id)}>
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </section>
            </main>

            <footer className="footer">
                <small>© {new Date().getFullYear()} Commercial Web — Demo sample</small>
            </footer>

            <style jsx>{`
                .page {
                    font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI",
                        Roboto, "Helvetica Neue", Arial;
                    color: #0f172a;
                    padding: 0 20px;
                }
                .header {
                    height: 64px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid #e6eef8;
                }
                .brand {
                    font-weight: 700;
                    font-size: 18px;
                }
                nav {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }
                .link,
                .cart {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #1e293b;
                    padding: 6px 10px;
                    border-radius: 6px;
                }
                .hero {
                    padding: 48px 0;
                    text-align: left;
                }
                .hero h1 {
                    margin: 0 0 8px;
                    font-size: 28px;
                }
                .hero p {
                    margin: 0 0 18px;
                    color: #475569;
                }
                .cta-row {
                    display: flex;
                    gap: 10px;
                }
                .primary {
                    background: #2563eb;
                    color: white;
                    border: none;
                    padding: 10px 14px;
                    border-radius: 8px;
                    cursor: pointer;
                }
                .secondary {
                    background: transparent;
                    border: 1px solid #c7d2fe;
                    padding: 9px 12px;
                    border-radius: 8px;
                    cursor: pointer;
                }
                .search {
                    margin: 24px 0;
                }
                .search input {
                    width: 100%;
                    max-width: 560px;
                    padding: 10px 12px;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                }
                .grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 18px;
                    margin-bottom: 48px;
                }
                .card {
                    border: 1px solid #e6eef8;
                    border-radius: 12px;
                    padding: 14px;
                    background: white;
                }
                .thumb {
                    height: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 12px;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .svg {
                    width: 100%;
                    height: 100%;
                }
                h3 {
                    margin: 0 0 6px;
                    font-size: 16px;
                }
                .desc {
                    margin: 0 0 10px;
                    color: #64748b;
                    font-size: 13px;
                }
                .meta {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 8px;
                }
                .actions {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .actions button {
                    padding: 6px 8px;
                    border-radius: 6px;
                    border: 1px solid #e2e8f0;
                    background: transparent;
                    cursor: pointer;
                }
                .actions .buy {
                    background: #10b981;
                    color: white;
                    border: none;
                    padding: 6px 10px;
                }
                .footer {
                    padding: 24px 0;
                    text-align: center;
                    color: #94a3b8;
                }
                .empty {
                    padding: 40px;
                    text-align: center;
                    color: #64748b;
                }

                @media (max-width: 600px) {
                    .hero h1 {
                        font-size: 22px;
                    }
                }
            `}</style>
        </div>
    );
}