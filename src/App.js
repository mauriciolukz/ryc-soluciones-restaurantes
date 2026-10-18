import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./App.css";
import Navbar from "./Navbar";
import ProductCatalog from "./ProductCatalog";
import ProductDetail from "./ProductDetail";


function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: "#FFFFFF" }}>
        {/* Navbar */}
        <Navbar />
        
        {/* Contenido principal */}
        <div className="">
          <Routes>
            <Route path="/" element={<ProductCatalog />} />
            <Route path="/productos/:categoria" element={<ProductCatalog />} />
            <Route path="/productos" element={<ProductCatalog />} />
            <Route path="/producto/:productId" element={<ProductDetail />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer
          style={{
            background: "linear-gradient(135deg, #1B2A4A 0%, #002B5C 100%)",
            color: "white",
            paddingTop: "40px",
            paddingBottom: "20px",
            marginTop: "auto",
          }}
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-4 text-center text-md-start mb-3 mb-md-0">
                <img
                  src={`${process.env.PUBLIC_URL}/logo-ryc-restaurantes.jpg`}
                  alt="RyC Restaurantes"
                  style={{
                    width: "80px",
                    borderRadius: "14px",
                    marginBottom: "12px",
                    border: "2px solid rgba(255,255,255,0.2)",
                  }}
                />
                <p style={{ opacity: 0.8, fontSize: "0.9rem", marginBottom: 0 }}>
                  Soluciones tecnológicas para restaurantes
                </p>
              </div>

              <div className="col-md-4 text-center mb-3 mb-md-0">
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 600, marginBottom: "8px" }}>
                  RyC Restaurantes
                </p>
                <p style={{ opacity: 0.6, fontSize: "0.85rem", marginBottom: 0 }}>
                  Tecnología que ayuda a tu restaurante a trabajar mejor
                </p>
              </div>

              <div className="col-md-4 text-center text-md-end">
                <div className="d-flex justify-content-center justify-content-md-end gap-3 mb-2">
                  <a
                    href="https://www.facebook.com/RYCRestaurantes?locale=es_LA"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      fontSize: "16px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#E8651A";
                      e.currentTarget.style.transform = "translateY(-3px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.15)",
                margin: "24px 0 16px",
              }}
            ></div>

            <p
              className="text-center mb-0"
              style={{ opacity: 0.6, fontSize: "0.8rem" }}
            >
              &copy; 2025, RYC Soluciones Nicaragua. Todos los derechos reservados.
            </p>
          </div>
        </footer>

        {/* Modal de contacto */}
        <div
          className="modal fade"
          id="contactModal"
          tabIndex="-1"
          aria-labelledby="contactModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div
              className="modal-content"
              style={{ borderRadius: "20px", border: "none", overflow: "hidden" }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #1B2A4A 0%, #002B5C 100%)",
                  color: "white",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/logo-ryc-restaurantes.jpg`}
                  alt="RYC Logo"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    border: "2px solid rgba(255,255,255,0.3)",
                  }}
                />
                <h5
                  className="modal-title"
                  id="contactModalLabel"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  Contáctanos
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                  aria-label="Cerrar"
                ></button>
              </div>

              <div className="modal-body" style={{ backgroundColor: "#FFFAF5", padding: "24px" }}>
                {/* Mapa */}
                <div style={{ width: "100%", height: "400px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    title="Mapa de ubicación"
                    src="https://www.google.com/maps?q=12.1186756,-86.258196&z=17&t=m&output=embed"
                  ></iframe>
                </div>

                {/* Imagen de la sucursal */}
                <div style={{ marginTop: "20px" }}>
                  <img
                    src="https://ryc-soluciones-nicaragua.com/imagenes/imagen_ubicacion.jpeg"
                    alt="Sucursal"
                    style={{
                      width: "100%",
                      borderRadius: "16px",
                      objectFit: "cover",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    }}
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: "1px solid #f0ebe5", padding: "16px 24px" }}>
                <button
                  type="button"
                  data-bs-dismiss="modal"
                  style={{
                    backgroundColor: "#1B2A4A",
                    color: "white",
                    border: "none",
                    borderRadius: "25px",
                    padding: "10px 28px",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
