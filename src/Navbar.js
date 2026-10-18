import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Offcanvas } from "bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 990);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const offcanvasRef = useRef(null);
  const offcanvasInstance = useRef(null);

  /* ================== RESPONSIVE ================== */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 990);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================== SCROLL EFFECT ================== */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================== CATEGORÍAS ================== */
  useEffect(() => {
    axios
      .get(
        "https://ryc-soluciones-nicaragua.com/api/index.php?getAllCategory=true"
      )
      .then((res) =>
        setCategories(res.data.filter((c) => c.category === "Restaurante").map((c) => ({ id: c.id, nombre: c.category })))
      );
  }, []);

  /* ================== OFFCANVAS ================== */
  useEffect(() => {
    if (offcanvasRef.current) {
      offcanvasInstance.current = new Offcanvas(offcanvasRef.current);
    }
  }, []);

  /* ================== SEARCH ================== */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  /* ================== CATEGORY CLICK ================== */
  const handleCategoryClick = (path) => {
    navigate(path);
    offcanvasInstance.current?.hide();
  };

  return (
    <nav
      className="navbar-restaurant"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1050,
        transition: "box-shadow 0.3s ease",
        boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.15)" : "none",
      }}
    >
      {/* ===== ROW 1: Logo + Search ===== */}

      {/* ===== ROW 2: Navigation ===== */}
      <div
        style={{
          background: "#142240",
          borderBottom: "3px solid #E8651A",
          padding: isMobile ? "10px 16px" : "8px 0",
        }}
      >
        <div className="container" style={{
            paddingLeft: isMobile ? "0" : undefined,
            paddingRight: isMobile ? "0" : undefined,
          }}>
          {/* Mobile Layout */}
          {isMobile && (
            <div className="navbar-mobile-header">
              <Link to="/" className="navbar-mobile-logo">
                <img
                  src={`${process.env.PUBLIC_URL}/logo-ryc-restaurantes-new.png`}
                  alt="RyC Restaurantes"
                />
              </Link>

              <button
                className="navbar-mobile-contact"
                data-bs-toggle="modal"
                data-bs-target="#contactModal"
              >
                <i className="fa-solid fa-location-dot"></i>
                <span>Contáctanos</span>
              </button>

              <button
                className="navbar-mobile-menu"
                aria-label="Abrir menú"
                onClick={() => offcanvasInstance.current?.show()}
              >
                <i className="fas fa-bars"></i>
              </button>
            </div>
          )}


          {/* Desktop Layout */}
          {!isMobile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                 gap: "12px",
                  width: "100%",
              }}
            >
              <Link
  to="/"
  style={{
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    textDecoration: "none",
  }}
>
  <img
    src={`${process.env.PUBLIC_URL}/logo-ryc-restaurantes.jpg`}
    alt="RyC Restaurantes"
    style={{
      width: "clamp(42px, 4vw, 56px)",
      height: "clamp(42px, 4vw, 56px)",
      borderRadius: "10px",
      border: "2px solid rgba(255,255,255,0.3)",
      objectFit: "cover",
    }}
  />
</Link>
              <button
                onClick={() => offcanvasInstance.current?.show()}
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "50px",
                  padding: "10px 24px",
                  color: "#fff",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)";
                  e.currentTarget.style.borderColor = "#E8651A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                }}
              >
                <i className="fas fa-utensils"></i>
                <span>Todas las categorías</span>
              </button>

              <div style={{ display: "flex", gap: "12px", alignItems: "center" ,marginLeft: "auto",flexShrink: 0}}>
                <Link
                  to="/productos/Restaurante"
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "25px",
                    padding: "8px 20px",
                    color: "white",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.borderColor = "#E8651A";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  }}
                >
                  <i className="fa-solid fa-fire"></i> Productos
                </Link>

                <button
                  className="btn btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#contactModal"
                  style={{
                    backgroundColor: "#E8651A",
                    color: "white",
                    border: "none",
                    borderRadius: "25px",
                    padding: "8px 22px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(232,101,26,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#FF7A2F";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#E8651A";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <i className="fa-solid fa-location-dot"></i> Contáctanos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== OFFCANVAS ===== */}
      <div
        ref={offcanvasRef}
        className="offcanvas offcanvas-start"
        style={{ maxWidth: "320px" }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1B2A4A 0%, #002B5C 100%)",
            color: "white",
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <i className="fas fa-utensils" style={{ fontSize: "1.1rem", color: "#E8651A" }}></i>
            <h5 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
              Categorías
            </h5>
          </div>
          <button
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            style={{ fontSize: "0.8rem" }}
          ></button>
        </div>

        <div
          style={{
            backgroundColor: "#FFFAF5",
            padding: 0,
            overflowY: "auto",
            flex: 1,
          }}
        >
          {categories
            .filter((c) => c.nombre.toLowerCase() !== "liquidacion")
            .map((c) => (
              <button
                key={c.id}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid #f0ebe5",
                  padding: "14px 24px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "#2D2D2D",
                  fontSize: "0.95rem",
                  fontFamily: "'Inter', sans-serif",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFF0E6";
                  e.currentTarget.style.paddingLeft = "30px";
                  e.currentTarget.style.color = "#E8651A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.paddingLeft = "24px";
                  e.currentTarget.style.color = "#2D2D2D";
                }}
                onClick={() =>
                  handleCategoryClick(
                    `/productos/${c.nombre.replaceAll(" ", "-")}`
                  )
                }
              >
                <i
                  className="fas fa-chevron-right"
                  style={{ fontSize: "0.65rem", color: "#E8651A" }}
                ></i>
                {c.nombre}
              </button>
            ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
