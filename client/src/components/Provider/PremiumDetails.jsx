import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCheckout } from "../../hooks/useCheckout";
import { priceFormat } from "../../helpers/priceFormat";
import { resizer } from "../../helpers/resizer";
import Carousel from "../Home/Carousel/Carousel";
import { ArrowDownIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { WishlistButton } from "../Products/WishlistButton";
import Calification from "../common/Comments/Calification";
import Comments from "../common/Comments/Comments";

import "./PremiumDetails.css";

const PremiumDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(false);
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tabOpen, setTabOpen] = useState(false);
  const { addToCart, buyNow } = useCheckout();
  const { wishlist } = useSelector((state) => state.cartReducer);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [scroll, setScroll] = useState(false);
  const { session } = useSelector((state) => state.sessionReducer);
  const reference = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const whiteBgIds = ["630805253f8827294d4b17b4", "6316471837c51526ec170292"];

  const attributesSection = useRef(null);
  const scrollTo = () => {
    if (attributesSection.current) {
      setTabOpen(true);
      attributesSection.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  };

  const handleWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  const scrollPercent = () => {
    let scrollTop = window.scrollY;
    let docHeight = document.body.offsetHeight;
    let winHeight = window.innerHeight;
    let scrollPercent = scrollTop / (docHeight - winHeight);
    let scrollPercentRounded = Math.round(scrollPercent * 100);
    setScroll(scrollPercentRounded > 14);
  };

  //? agrega producto al historial
  useEffect(() => {
    if (session && product) {
      // setear historial
      const payload = {
        product_id: product._id,
        category: product.category.id || "",
      };
      axios.post(`/history/visited`, payload);
    }
    // eslint-disable-next-line
  }, [product]);

  useEffect(() => {
    window.addEventListener("resize", handleWindowWidth);
    window.addEventListener("scroll", scrollPercent);
    return () => {
      window.removeEventListener("resize", handleWindowWidth);
      window.addEventListener("scroll", scrollPercent);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(!entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );
    if (reference.current) observer.observe(reference.current);

    return () => {
      // eslint-disable-next-line
      if (reference.current) observer.unobserve(reference.current);
    };
  }, [reference, loading]);

  useEffect(() => {
    (async () => {
      const { data } = await axios(`/product/${id}`);
      if (data.error) {
        setError(data.message);
      } else if (!data.product.premium) {
        setError("ID de producto incorrecto");
      } else {
        let product = {
          ...data.product,
          comments: data.comments,
          allowComment: data.allowComment,
        };
        
        setProduct(product);

        let aux = product.images.map((e) => ({
          img: e.imgURL,
          url: "",
        }));
        setImages(aux);

        setLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="premiumdetails-container component-fadeIn">
      {loading && <></>}
      {error && (
        <div className="premiumdetails-error component-fadeIn">
          <h1>{error}</h1>
        </div>
      )}
      {product && (
        <div className="premiumdetails-content component-fadeIn">
          <div className="premiumdetails-head">
            <div className="provider-premium-sign"></div>

            <div
              className="premiumdetails-details"
              style={{
                color: product.premiumData.textColor
                  ? product.premiumData.textColor
                  : "white",
                backgroundColor:
                  windowWidth <= 1240 && product.premiumData.color,
              }}
            >
              <span className="pd-favButton-container">
                <WishlistButton
                  prodId={product.id}
                  visible
                  fav={wishlist.includes(product.id)}
                  position={false}
                />
              </span>

              <div className="pp-sign-mobile"></div>

              {product.premiumData.logo ? (
                <div className="premiumdetails-logo">
                  <img src={product.premiumData.logo} alt="" />
                </div>
              ) : (
                <h1 className="premiumdetails-name">{product.name}</h1>
              )}

              <Calification num={product.average_calification} hover/>

              <div className="pd-head-price">
                <h2>{product.premiumData.miniDescription}</h2>

                <div className="premiumdetails-price">
                  <span>${priceFormat(product.price).int}</span>
                  <span>{priceFormat(product.price).cents}</span>
                  {product.available_quantity < 1 ? (
                    <div className="pd-stock-container">
                      <div
                        className="premiumdetails-nostock"
                        title="Fuera de stock"
                      >
                        Fuera de stock
                      </div>
                    </div>
                  ) : (
                    product.free_shipping && (
                      <p className="provider-text">Envío gratis</p>
                    )
                  )}
                </div>

                <div ref={reference} className="premiumdetails-buttons">
                  <button
                    className={`g-white-button details-button ${
                      whiteBgIds.includes(id) && "secondary-button"
                    }`}
                    disabled={product.available_quantity < 1}
                    onClick={() => addToCart(id)}
                  >
                    Agregar al carrito
                  </button>
                  <button
                    className={`g-white-button details-button ${
                      whiteBgIds.includes(id) && "secondary-button"
                    }`}
                    disabled={product.available_quantity < 1}
                    onClick={() => buyNow(id)}
                  >
                    Comprar ahora
                  </button>
                </div>

                {product.main_features && (
                  <div className="premiumdetails-mainfeatures">
                    <ul>
                      {product.main_features.map((e) => (
                        <li key={e}>· {e}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div
                  className="premiumdetails-toAttributesButton"
                  onClick={scrollTo}
                >
                  Ver especificaciones
                  <ArrowDownIcon />
                </div>
              </div>
            </div>

            <div className="premiumdetails-images">
              {images && (
                <Carousel
                  images={images}
                  indicators
                  height={"80vh"}
                  width={"80vh"}
                />
              )}
            </div>

            <div
              className="premiumdetails-background"
              style={{ backgroundColor: product.premiumData.color }}
            ></div>
          </div>

          {product.premiumData.video && (
            <div className="pd-video-container">
              <div>
                <video
                  autoPlay
                  playsInline
                  muted
                  disablePictureInPicture
                  loop
                  controls
                  controlsList="nodownload"
                >
                  <source
                    src={product.premiumData.video}
                    type="video/mp4"
                  ></source>
                </video>
              </div>
            </div>
          )}

          {React.Children.toArray(
            product.premiumData.extraText.map((e) => (
              <div
                className="premiumdetails-section"
                style={e.soloImg 
                        ? { backgroundColor: e.bgColor, justifyContent: "center", overflow: 'hidden' } 
                        : {backgroundColor: e.bgColor, justifyContent: "center"}}>
                <div
                  className="pd-text-container-mobile"
                  style={{
                    color: product.premiumData.textColor
                      ? product.premiumData.textColor
                      : "white",
                    ...e.textPos,
                    top:
                      windowWidth <= 1100
                        ? e.soloText
                          ? "unset"
                          : "0%"
                        : e.textPos?.top || false                        
                  }}
                >
                  <h2 style={{width: e.soloText ? '100%' : ''}}>{e.title}</h2>
                  <p style={{width: e.soloText ? '100%' : ''}}>{e.text}</p>
                </div>

                {e.img && (
                  <img
                    src={e.img}
                    alt="section img"
                    style={{
                      ...e.imgPos,
                      top:
                        windowWidth <= 1100 && !e.soloImg
                          ? "40%"
                          : e.imgPos.top,
                    }}
                  />
                )}

                {e.video && (
                  <div className="pd-section-video-container" style={e.vidPos}>
                    <video
                      autoPlay
                      playsInline
                      muted
                      disablePictureInPicture
                      loop
                    >
                      <source src={e.video} type="video/mp4"></source>
                    </video>
                  </div>
                )}
              </div>
            ))
          )}

          {product.id === "6316471837c51526ec170292" && (
            <div className="pd-second-carousel-container">
              <Carousel
                images={product.premiumData.carouselImg}
                indicators
                interval={4000}
                width={windowWidth < 1100 ? "100%" : "50vw"}
                id="instructions"
              />
            </div>
          )}

          <div
            ref={attributesSection}
            className={`tab-container pd-tab`}
            onClick={() => setTabOpen(!tabOpen)}
            style={{
              height: tabOpen
                ? `${product.attributes.length * 2 + 5 + "rem"}`
                : "2.5rem",
            }}
          >
            <div className="tab-button-container">
              <button className="tab-button tab-button-active">
                Atributos{" "}
                <ChevronDownIcon
                  className={`pd-tab-icon ${tabOpen && "pd-tab-icon-close"}`}
                />
              </button>
            </div>
            <div className="premiumdetails-attributes">
              {React.Children.toArray(
                product.attributes?.map(
                  (e) =>
                    e.value_name && (
                      <div className="pd-attribute-container">
                        <div>{e.name}</div>
                        <div>{e.value_name}</div>
                      </div>
                    )
                )
              )}
            </div>
          </div>

          <div className="pd-logo-footer">
            {product.id === "62df1257d0bcaed708e4feb7" ? (
              <video
                src="https://res.cloudinary.com/dsyjj0sch/video/upload/v1662187563/2F5TPqZn_03sjNI4_nb7shw.mp4"
                muted
                autoPlay
                playsInline
                disablePictureInPicture
                width={300}
                loop
                style={{ filter: "grayscale(1) contrast(1.2)" }}
              ></video>
            ) : (
              <div
                style={{
                  WebkitMaskImage: `url('${resizer(
                    product.premiumData.logo,
                    310
                  )}')`,
                  maskImage: `url('${resizer(product.premiumData.logo, 310)}')`,
                }}
              ></div>
            )}
          </div>

          <Comments 
            product_id={product.id} 
            comments={product.comments} 
            allowed={product.allowComment}/>

          <div
            className={`premiumdetails-fixed ${
              isVisible && scroll && "premiumdetails-fixed-on"
            }`}
          >
            <div className="premiumdetails-fixed-content">
              <div className="pd-fixed-name">
                <p>{product.name}</p>
                <span>
                  <span>${priceFormat(product.price).int}</span>
                  <span>{priceFormat(product.price).cents}</span>
                </span>
              </div>
              <button
                className="g-white-button details-button"
                disabled={product.available_quantity < 1}
                onClick={() => addToCart(id)}
              >
                Agregar al carrito
              </button>
              <button
                className="g-white-button details-button"
                disabled={product.available_quantity < 1}
                onClick={() => buyNow(id)}
              >
                Comprar ahora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumDetails;
