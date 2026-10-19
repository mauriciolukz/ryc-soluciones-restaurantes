import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const CURRENCY = "C$";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [productId]);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://ryc-soluciones-nicaragua.com/api/index.php?getProductById=true&product_id=${productId}`
        );
        setProduct(response.data);
        setSelectedImage(response.data.image || response.data.photos[0] || "");
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;

    let videoId = null;
    let isVertical = false;

    if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1]?.split("&")[0];
    } else if (url.includes("/shorts/")) {
      videoId = url.split("/shorts/")[1]?.split("?")[0];
      isVertical = true;
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split(/[?&]/)[0];
    }

    if (videoId) {
      return {
        url: `https://www.youtube.com/embed/${videoId}`,
        type: "youtube",
        vertical: isVertical,
      };
    }

    const tiktokMatch = url.match(/\/video\/(\d+)/);

    if (tiktokMatch && url.includes("tiktok.com/")) {
      return {
        url: `https://www.tiktok.com/player/v1/${tiktokMatch[1]}`,
        type: "tiktok",
        vertical: true,
      };
    }

    return null;
  };

  if (!product) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          backgroundColor: "#FFFFFF",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <i
            className="fas fa-utensils"
            style={{
              fontSize: "48px",
              color: "#E8651A",
              marginBottom: "16px",
              animation: "pulse 1.5s infinite",
            }}
          ></i>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "#6B6B6B",
              fontSize: "1.1rem",
            }}
          >
            Cargando producto...
          </p>
        </div>
      </div>
    );
  }

  const videoEmbedUrl = getYouTubeEmbedUrl(product.video_url);
  const videoEmbedUrl2 = getYouTubeEmbedUrl(product.video_url2);

  return (
    <div style={{ backgroundColor: "#FFFFFF", minHeight: "100vh", padding: isMobile ? "16px" : "30px 24px" }}>
      <Helmet>
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.name} />
        <meta property="og:url" content={`https://ryc-soluciones-nicaragua.com/producto/${product.id}`} />
        <meta property="og:image" content={selectedImage || product.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.name} />
        <meta name="twitter:description" content={product.name} />
        <meta name="twitter:image" content={selectedImage || product.image} />
      </Helmet>

      <div
        className="container"
        style={{
          maxWidth: "1100px",
        }}
      >
        {/* Back button */}
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#1B2A4A",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 500,
            marginBottom: "20px",
            padding: "8px 16px",
            borderRadius: "25px",
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#E8651A";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.color = "#1B2A4A";
          }}
        >
          <i className="fas fa-arrow-left"></i> Volver al catálogo
        </Link>

        {/* Main Product Card */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(27,42,74,0.08)",
          }}
        >
          {/* Product Title Bar */}
          <div
            style={{
              background: "linear-gradient(135deg, #1B2A4A 0%, #002B5C 100%)",
              color: "white",
              padding: isMobile ? "20px" : "24px 40px",
            }}
          >
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: isMobile ? "1.3rem" : "1.8rem",
                fontWeight: 700,
                margin: 0,
              }}
            >
              {product.name}
            </h1>
          </div>

          <div className="row g-0">
            {/* Image Column */}
            <div className="col-md-6" style={{ padding: isMobile ? "20px" : "32px" }}>
              <div
                style={{
                  backgroundColor: "#FEFCF9",
                  borderRadius: "16px",
                  padding: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "300px",
                  border: "1px solid #f0ebe5",
                }}
              >
                <img
                  src={selectedImage}
                  className="img-fluid"
                  alt={product.name}
                  style={{
                    maxHeight: "400px",
                    objectFit: "contain",
                    transition: "transform 0.3s ease",
                  }}
                />
              </div>

              {/* Thumbnails */}
              <div
                className="d-flex justify-content-center mt-3"
                style={{ gap: "10px", flexWrap: "wrap" }}
              >
                {product.photos?.map((photo, index) => (
                  <img
                    key={index}
                    src={photo.url_photo}
                    alt={`Miniatura ${index + 1}`}
                    onClick={() => setSelectedImage(photo.url_photo)}
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      cursor: "pointer",
                      border: selectedImage === photo.url_photo
                        ? "3px solid #E8651A"
                        : "2px solid transparent",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedImage !== photo.url_photo) {
                        e.currentTarget.style.borderColor = "rgba(232,101,26,0.4)";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedImage !== photo.url_photo) {
                        e.currentTarget.style.borderColor = "transparent";
                        e.currentTarget.style.transform = "scale(1)";
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Details Column */}
            <div
              className="col-md-6"
              style={{ padding: isMobile ? "0 20px 24px" : "32px 40px 32px 16px" }}
            >
              {/* Price */}
              <div style={{ marginBottom: "24px" }}>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#6B6B6B",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    fontWeight: 500,
                  }}
                >
                  Precio
                </p>
                <div style={{ fontSize: "2rem", fontWeight: 700, color: "#1B2A4A" }}>
                  <span
                    style={{
                      textDecoration: product.on_clearance === 1 ? "line-through" : "none",
                      color: product.on_clearance === 1 ? "#999" : "#1B2A4A",
                      fontSize: product.on_clearance === 1 ? "1.3rem" : undefined,
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
                        fontSize: "2rem",
                        fontWeight: 700,
                        marginTop: "4px",
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

              {/* Description */}
              {product.description && (
                <div style={{ marginBottom: "24px" }}>
                  <p
                    style={{
                      color: "#2D2D2D",
                      lineHeight: 1.7,
                      fontSize: "0.95rem",
                    }}
                  >
                    {product.description}
                  </p>
                </div>
              )}

              {/* Features */}
              <div style={{ marginBottom: "28px" }}>
                <h6
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "#1B2A4A",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <i className="fas fa-star" style={{ color: "#E8651A", fontSize: "0.85rem" }}></i>
                  Características
                </h6>
                <ul style={{ listStyleType: "none", paddingLeft: 0, margin: 0 }}>
                  {product.features.map((feature, index) => (
                    <li
                      key={index}
                      style={{
                        padding: "10px 0",
                        borderBottom: "1px dashed #f0ebe5",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        color: "#2D2D2D",
                        fontSize: "0.95rem",
                      }}
                    >
                      <i
                        className="fas fa-check-circle"
                        style={{
                          color: "#E8651A",
                          marginTop: "3px",
                          flexShrink: 0,
                        }}
                      ></i>
                      {feature.feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <a
                  href={(() => {
                    const phone = "50585634943";
                    const text = `Hola+estoy+interesado+en+este+producto:%0D%0A%0D%0A*${encodeURIComponent(product.name)}*%0A*Precio:*%20${encodeURIComponent(product.price)}%0A*URL:*%20https%3A%2F%2Frestaurante.ryc-soluciones-nicaragua.com%2Fproducto%2F${encodeURIComponent(product.id)}`;
                    const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
                    return isMobileDevice
                      ? `https://wa.me/${phone}?text=${text}`
                      : `https://web.whatsapp.com/send?phone=${phone}&text=${text}`;
                  })()}
                  title={`Hablar sobre ${product.name} en WhatsApp`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    backgroundColor: "#25D366",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "30px",
                    padding: "14px 24px",
                    fontWeight: 600,
                    fontSize: "1rem",
                    boxShadow: "0 4px 16px rgba(37,211,102,0.3)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(37,211,102,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,211,102,0.3)";
                  }}
                >
                  <i className="fab fa-whatsapp" style={{ fontSize: "22px" }}></i>
                  Consultar por WhatsApp
                </a>

                <Link
                  to="/"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    backgroundColor: "#E8651A",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "30px",
                    padding: "14px 24px",
                    fontWeight: 600,
                    fontSize: "1rem",
                    boxShadow: "0 4px 16px rgba(232,101,26,0.3)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.backgroundColor = "#FF7A2F";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.backgroundColor = "#E8651A";
                  }}
                >
                  <i className="fas fa-utensils"></i>
                  Ver más productos
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Videos Section */}
        {(videoEmbedUrl || videoEmbedUrl2) && (
          <div
            style={{
              marginTop: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                marginBottom: "28px",
              }}
            >
              <div style={{ height: "2px", flex: 1, maxWidth: "60px", background: "linear-gradient(to right, transparent, #E8651A)" }}></div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#1B2A4A",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                <i className="fas fa-play-circle" style={{ color: "#E8651A", marginRight: "10px" }}></i>
                Videos del producto
              </h3>
              <div style={{ height: "2px", flex: 1, maxWidth: "60px", background: "linear-gradient(to left, transparent, #E8651A)" }}></div>
            </div>

            <div className="row justify-content-center">
              {[videoEmbedUrl, videoEmbedUrl2]
                .filter(Boolean)
                .map((video, index) => (
                  <div key={index} className="col-12 col-md-6 text-center mb-4">
                    <div
                      style={{
                        backgroundColor: "white",
                        borderRadius: "20px",
                        overflow: "hidden",
                        boxShadow: "0 4px 20px rgba(27,42,74,0.08)",
                        padding: "20px",
                      }}
                    >
                      <h5
                        style={{
                          color: "#1B2A4A",
                          fontFamily: "'Playfair Display', serif",
                          marginBottom: "16px",
                          fontWeight: 600,
                        }}
                      >
                        {index === 0 ? "Video del producto" : "Video adicional"}
                      </h5>

                      <div
                        style={{
                          width: "100%",
                          maxWidth: video.vertical ? "325px" : "600px",
                          aspectRatio: video.vertical ? "9 / 16" : "16 / 9",
                          margin: "0 auto",
                          overflow: "hidden",
                          borderRadius: "12px",
                        }}
                      >
                        <iframe
                          src={video.url}
                          title={`Video ${index + 1} del producto`}
                          style={{
                            width: "100%",
                            height: "100%",
                            border: 0,
                            display: "block",
                          }}
                          allow={
                            video.type === "tiktok"
                              ? "fullscreen"
                              : "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          }
                          allowFullScreen
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
