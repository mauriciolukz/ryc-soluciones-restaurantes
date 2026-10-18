import React, { useEffect, useState, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

/* ============================================================
   HERO PHRASES – Rotating content for the restaurant audience
   ============================================================ */
const heroPhrasesData = [];

const ProductCatalog = () => {
  const { categoria } = useParams();
  const location = useLocation();
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [subcategorys, setSubCategorys] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const postApi = "https://ryc-soluciones-nicaragua.com/api/index.php";
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Restaurante');
  const CURRENCY = "C$";
  const [bannerTransition, setBannerTransition] = useState(true);
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getImageSize = () => {
    const width = window.innerWidth;
    if (width <= 768) return 140;
    else if (width <= 1024) return 180;
    else return 240;
  };

  const fetchProducts = useCallback(async () => {
    try {
      let url;
      if (categoria) {
        setSelectedCategory(categoria.replaceAll("-", " "));
        url = `${postApi}?getAllProductsByCategory=true&category=${categoria.replaceAll("-", " ")}`;
        setSelectedFilters([]);
        setShowFilters(false);
      } else if (searchQuery) {
        setSelectedCategory("");
        url = `${postApi}?searchProduct=true&query=${encodeURIComponent(searchQuery)}`;
      } else {
        // Default: only restaurant products
        url = `${postApi}?getAllProductsByCategory=true&category=Restaurante`;
        setSelectedCategory("Restaurante");
      }

      const response = await axios.get(url);
      const restaurantProducts = response.data.filter(
        (product) => product.category === "Restaurante"
      );
      setProducts(restaurantProducts);
      setAllProducts(restaurantProducts);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  }, [categoria, searchQuery]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${postApi}?getAllBanners=true`);

         const bannersRestaurante = response.data.filter(
          (banner) => banner.type === "Restaurante"
        );


        setBanners(bannersRestaurante);
      } catch (error) {
        console.error("Error al obtener banners:", error);
      }
    };

    const fetchSubCategorys = async () => {
      try {
        const categoriaFinal = categoria?.trim()
          ? categoria.replaceAll("-", " ")
          : "Restaurante";
        const response = await axios.get(`${postApi}?getAllsubcategory=true&category=${categoriaFinal.replaceAll("-", " ")}`);
        setSubCategorys(response.data);
      } catch (error) {
        console.error("Error al obtener subcategorías:", error);
      }
    };

    fetchBanners();
    fetchProducts();
    fetchSubCategorys();
  }, [categoria, searchQuery, fetchProducts]);

  // Auto-rotate banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      changeBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  // Auto-rotate phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhraseIndex((prev) => (prev + 1) % heroPhrasesData.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const changeBanner = (indexOrFn) => {
    setBannerTransition(false);
    setTimeout(() => {
      if (typeof indexOrFn === "function") {
        setCurrentBannerIndex(indexOrFn);
      } else {
        setCurrentBannerIndex(indexOrFn);
      }
      setBannerTransition(true);
    }, 50);
  };

  const prevBanner = () => {
    changeBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextBanner = () => {
    changeBanner((prev) => (prev + 1) % banners.length);
  };

  const handleFilterChange = (category, keyword) => {
    setSelectedFilters(prev => {
      const existingCategory = prev.find(item => item.category === category);
      if (existingCategory) {
        const keywordExists = existingCategory.keywords.includes(keyword);
        const newKeywords = keywordExists
          ? existingCategory.keywords.filter(k => k !== keyword)
          : [...existingCategory.keywords, keyword];

        if (newKeywords.length === 0) {
          return prev.filter(item => item.category !== category);
        }

        return prev.map(item =>
          item.category === category ? { ...item, keywords: newKeywords } : item
        );
      } else {
        return [...prev, { category, keywords: [keyword] }];
      }
    });
  };

  const applyFilters = async () => {
    if (selectedFilters.length === 0) return;

    try {
      const filtersPayload = JSON.stringify(selectedFilters);
      setProducts([]);
      const url = `${postApi}?getProductsByFilter=true&filters=${encodeURIComponent(filtersPayload)}`;
      const response = await axios.get(url);
      setProducts(response.data);
      setShowFilters(false);
    } catch (error) {
      console.error("Error aplicando filtro:", error);
    }
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    fetchProducts();
    setShowFilters(false);
  };

  const currentPhrase = heroPhrasesData[activePhraseIndex];

  return (
    <div style={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>

      {/* ============ BANNER SECTION ============ */}
      {banners.length > 0 && (
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: isMobile ? "0" : "20px",
            margin: isMobile ? "0" : "20px 24px 0",
            boxShadow: "0 8px 32px rgba(27,42,74,0.12)",
          }}
        >
        <img
          src={
            isMobile
              ? banners[currentBannerIndex].image_url_mobile
              : banners[currentBannerIndex].image_url_desktop
          }
          alt="Banner"
          style={{
            display: "block",
            width: "100%",
            height: isMobile ? "180px" : "auto",
            maxWidth: "100%",
            objectFit: isMobile  ? "inherit" : "contain",
            opacity: bannerTransition ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
            backgroundColor: "#FFFFFF",
          }}
        />

          {/* Arrow Left */}
          {banners.length > 1 && (
            <button
              onClick={prevBanner}
              style={{
                position: "absolute",
                left: isMobile ? 8 : 20,
                top: "50%",
                transform: "translateY(-50%)",
                width: isMobile ? 38 : 48,
                height: isMobile ? 38 : 48,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.92)",
                border: "none",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                transition: "all 0.3s ease",
                color: "#E8651A",
                fontSize: isMobile ? "16px" : "20px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                e.currentTarget.style.backgroundColor = "#E8651A";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.92)";
                e.currentTarget.style.color = "#E8651A";
              }}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
          )}

          {/* Arrow Right */}
          {banners.length > 1 && (
            <button
              onClick={nextBanner}
              style={{
                position: "absolute",
                right: isMobile ? 8 : 20,
                top: "50%",
                transform: "translateY(-50%)",
                width: isMobile ? 38 : 48,
                height: isMobile ? 38 : 48,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.92)",
                border: "none",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                transition: "all 0.3s ease",
                color: "#E8651A",
                fontSize: isMobile ? "16px" : "20px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                e.currentTarget.style.backgroundColor = "#E8651A";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.92)";
                e.currentTarget.style.color = "#E8651A";
              }}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          )}

          {/* Dots */}
          {banners.length > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: isMobile ? 12 : 20,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "10px",
                zIndex: 10,
              }}
            >
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => changeBanner(idx)}
                  style={{
                    width: currentBannerIndex === idx ? 28 : 12,
                    height: 12,
                    borderRadius: currentBannerIndex === idx ? "6px" : "50%",
                    backgroundColor: currentBannerIndex === idx ? "#E8651A" : "rgba(255,255,255,0.6)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============ HERO PHRASE SECTION ============ */}
      

      {/* ============ FILTER MODAL ============ */}
      {showFilters && (
        <div className="modal fade show" style={{ display: "block" }} aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content" style={{ borderRadius: "16px", border: "none" }}>
              <div className="modal-header" style={{ backgroundColor: "#1B2A4A", color: "white", borderRadius: "16px 16px 0 0" }}>
                <h5 className="modal-title" id="exampleModalLabel">
                  <i className="fas fa-filter" style={{ marginRight: "8px", color: "#E8651A" }}></i>
                  Filtrar productos
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowFilters(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body" style={{ backgroundColor: "#FFFAF5" }}>
                {subcategorys.map((sub, index) => (
                  <div key={index} style={{ marginBottom: "16px" }}>
                    <strong style={{ color: "#1B2A4A" }}>{sub.category_name}</strong>
                    {sub.keywords.map((keyword, i) => (
                      <div key={i} className="form-check" style={{ padding: "4px 0 4px 28px" }}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`filter-${index}-${i}`}
                          checked={selectedFilters.some(f => f.category === sub.category_name && f.keywords.includes(keyword))}
                          onChange={() => handleFilterChange(sub.category_name, keyword)}
                          style={{ borderColor: "#E8651A" }}
                        />
                        <label className="form-check-label" htmlFor={`filter-${index}-${i}`}>
                          {keyword}
                        </label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="modal-footer" style={{ borderTop: "1px solid #f0ebe5" }}>
                <button
                  type="button"
                  onClick={applyFilters}
                  style={{
                    backgroundColor: "#E8651A",
                    color: "white",
                    border: "none",
                    borderRadius: "25px",
                    padding: "8px 24px",
                    fontWeight: 600,
                  }}
                >
                  Aplicar Filtro
                </button>
                <button
                  type="button"
                  onClick={clearFilters}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "25px",
                    padding: "8px 24px",
                    fontWeight: 600,
                  }}
                >
                  Borrar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ PRODUCTS SECTION ============ */}
      <div
        className="container"
        style={{ padding: isMobile ? "0 16px 30px" : "0 24px 40px" }}
      >
        {/* Section Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            marginBottom: isMobile ? "14px" : "32px",
            marginTop: isMobile ? "18px" : "32px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#1B2A4A",
              fontSize: isMobile ? "1.4rem" : "1.8rem",
              fontWeight: 700,
              margin: 0,
              textAlign: "center",
            }}
          >
            <i className="fas fa-utensils" style={{ color: "#E8651A", marginRight: "10px", fontSize: "0.9em" }}></i>
            {searchQuery ? `Resultados: "${searchQuery}"` : "Nuestros Productos"}
          </h2>
        </div>

        {/* Product Grid */}
        <div className="row">
          {products.map((product) => (
            <div className={`col-12 col-md-4 col-lg-3 ${isMobile ? "mb-3" : "mb-4"}`} key={product.id}>
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  overflow: "hidden",
                  transition: "all 0.35s ease",
                  border: "1px solid #f0ebe5",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 16px 40px rgba(27,42,74,0.12)";
                  e.currentTarget.style.borderColor = "rgba(232,101,26,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#f0ebe5";
                }}
              >
                {/* Product Image */}
                <div
                  style={{
                    padding: isMobile ? "8px" : "20px",
                    backgroundColor: "#FEFCF9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: isMobile ? "110px" : "200px",
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      maxHeight: isMobile ? "200px" : `${getImageSize()}px`,
                      maxWidth: "100%",
                      objectFit: "contain",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </div>

                {/* Product Info */}
                <div style={{ padding: isMobile ? "12px 14px" : "16px 20px", flexGrow: 1 }}>
                  <div
                    style={{
                      textTransform: "uppercase",
                      fontSize: "0.9rem",
                      color: "#1B2A4A",
                      fontWeight: 1000,
                      letterSpacing: "1px",
                      marginBottom: "6px",
                    }}
                  >
                    {product.code}
                  </div>

                  <h6
                    style={{
                      textTransform: "uppercase",
                      fontSize: "0.9rem",
                      color: "#1B2A4A",
                      fontWeight: 1000,
                      letterSpacing: "1px",
                      marginBottom: "6px",
                    }}
                  >
                    {product.name}f
                  </h6>

                  <div style={{ color: "#E8651A", fontWeight: 700, fontSize: isMobile ? "1.05rem" : "1.2rem" }}>
                    <span
                      style={{
                        textDecoration: product.on_clearance === 1 ? "line-through" : "none",
                        color: product.on_clearance === 1 ? "#999" : "#E8651A",
                        fontSize: product.on_clearance === 1 ? "0.9rem" : undefined,
                      }}
                    >
                      {CURRENCY}{" "}
                      {parseFloat(product.price).toLocaleString("en-US", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </span>

                    {product.on_clearance === 1 && (
                      <span
                        style={{
                          display: "block",
                          color: "#dc3545",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          marginTop: "2px",
                        }}
                      >
                        {CURRENCY}{" "}
                        {parseFloat(product.clearance_price).toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div
                                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%",
                  }}
                >
                  <button
                    onClick={() => navigate(`/producto/${product.id}`)}
                    style={{
                        backgroundColor: "#E8651A",
                        color: "white",
                        border: "none",
                        borderRadius: "25px",
                        padding: isMobile ? "7px 14px" : "8px 22px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        fontSize: isMobile ? "0.7rem" : "0.8rem",
                        letterSpacing: "0.5px",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        width: "100%",
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
                    Ver producto
                  </button>
                  <a
                    href={(() => {
                      const phone = "50577005446";
                      const text = `Hola+estoy+interesado+en+este+producto:%0D%0A%0D%0A*${encodeURIComponent(product.name)}*%0A*Precio:*%20${encodeURIComponent(product.price)}%0A*URL:*%20https%3A%2F%2Fryc-soluciones-nicaragua.com%2Fproducto%2F${encodeURIComponent(product.id)}`;
                      const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
                      return isMobileDevice
                        ? `https://wa.me/${phone}?text=${text}`
                        : `https://web.whatsapp.com/send?phone=${phone}&text=${text}`;
                    })()}
                    title={`Hablar sobre ${product.name} en WhatsApp`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#25D366",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "18px",
                      transition: "all 0.3s ease",
                      textDecoration: "none",
                      flexShrink: 0,
                      boxShadow: "0 2px 8px rgba(37,211,102,0.3)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <i className="fab fa-whatsapp"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {products.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#6B6B6B",
            }}
          >
            <i className="fas fa-utensils" style={{ fontSize: "48px", color: "#ddd", marginBottom: "16px" }}></i>
            <p style={{ fontSize: "1.1rem" }}>Cargando productos...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;