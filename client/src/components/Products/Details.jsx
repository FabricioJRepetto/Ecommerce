import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Galery from "./Galery";
import { WishlistButton as Fav } from "./WishlistButton";
import { loadQuerys } from "../../Redux/reducer/productsSlice";
import { priceFormat } from "../../helpers/priceFormat";
import { useCheckout } from "../../hooks/useCheckout";
import ReturnButton from "../common/ReturnButton";
import LoaderBars from "../common/LoaderBars";
import Comments from "../common/Comments/Comments";
import Calification from "../common/Comments/Calification";

import "./Details.css";

const Details = () => {
  let { id } = useParams();
  const { wishlist } = useSelector((state) => state.cartReducer);
  const { session } = useSelector((state) => state.sessionReducer);
  const querys = useSelector((state) => state.productsReducer.searchQuerys);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToCart, buyNow } = useCheckout();

  const [data, setData] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attributesHeight, setAttributesHeight] = useState(null);
  const [attributesColumns, setAttributesColumns] = useState(false);
  const [description, setDescription] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (session && data) {
      // setear historial
      const payload = {
        product_id: data._id,
        category: data.category.id || "",
      };
      axios.post(`/history/visited`, payload);
    }
    // eslint-disable-next-line
  }, [data]);

  const handleWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowWidth);
    return () => {
      window.removeEventListener("resize", handleWindowWidth);
    };
  }, []);

  const handleAttributesColumns = () => {
    if (data && data.attributes) {
      if (data.attributes.length > 15 && windowWidth > 1200) {
        setAttributesColumns(true);
        if (windowWidth > 1640) {
          setAttributesHeight(
            `${Math.floor((data.attributes.length / 2) * 2.2)}rem`
          );
        } else if (windowWidth > 1550) {
          setAttributesHeight(
            `${Math.floor((data.attributes.length / 2) * 2.3)}rem`
          );
        } else if (windowWidth > 1350) {
          setAttributesHeight(
            `${Math.floor((data.attributes.length / 2) * 2.5)}rem`
          );
        } else if (windowWidth > 1200) {
          setAttributesHeight(
            `${Math.floor((data.attributes.length / 2) * 2.7)}rem`
          );
        }
      } else {
        setAttributesColumns(false);
        setAttributesHeight("fit-content");
      }
    }
  };

  useEffect(() => {
    handleAttributesColumns();
    // eslint-disable-next-line
  }, [data.attributes]);

  useEffect(() => {
    handleAttributesColumns();
    // eslint-disable-next-line
  }, [window.innerWidth]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await axios(`/product/${id}`);
      if (data.error) {
        setError(data.message);
      } else {
        if (data.product.premium) {
            return navigate(`/premium/${data.id}`)
        }

        //? new details destructuring
        let product = {...data.product, comments: data.comments, allowComment: data.allowComment }
        setData(product);
        setDescription(!!product.description);
        handleAttributesColumns();
      }

      setLoading(false);
    })();
    // eslint-disable-next-line
  }, [id]);

  const addFilter = async (obj) => {
    let aux = { ...querys };
    delete aux.q;
    let filter = obj.filter;
    let value = obj.value;
    dispatch(loadQuerys({ ...aux, [filter]: value }));
    navigate("/results");
  };

  const handleTabChange = (prop) => {
    setDescription(prop);
  };

  return (
    <div className="product-details-outer-container">
      {loading && (
        <div className="details-loader-container">
          <LoaderBars />
        </div>
      )}
      {error && (
        <div className="product-details-error component-fadeIn">
          <h1>{error}</h1>
          <ReturnButton to={-1} />
        </div>
      )}
      {data && (
        <div>
          <div className="details-head-container component-fadeIn">
            <div className="bread-crumbs">
              <div>
                {data.path_from_root?.length > 0 &&
                  React.Children.toArray(
                    data.path_from_root.map((c, index) => (
                      <span
                        key={c.id}
                        onClick={() =>
                          addFilter({ filter: "category", value: c.id })
                        }
                      >
                        {(index > 0 ? " > " : "") + c.name}
                      </span>
                    ))
                  )}
              </div>

              <Fav
                prodId={data._id}
                visible={true}
                position={false}
                fav={wishlist.includes(data._id)}
              />
            </div>
            <div className="details-head-main">
              {data && <Galery imgs={data.images} ripple={true} />}
              <div className="details-head-section">
                <div>
                  <div className="details-title-container">    
                    <p style={{color: '#656565'}}>{data.brand?.toUpperCase()}</p>
                    <h1>{data.name}</h1>

                    {data.average_calification && data.average_calification !== '0' 
                    ? <Calification num={parseFloat(data.average_calification)} hover/>
                    : <p className="details-calification">Aún sin reseñas</p>}

                    {data.seller === 'PROVIDER' && <p>vendedor <b className="provider-text">PROVIDER</b></p>}

                  </div>

                  <div className="details-price-section">
                    {data.on_sale && (
                      <div className="details-sale-section">
                        <p>
                          $<del>{priceFormat(data.price).int}</del>
                          <b>{" " + data.discount}% off</b>
                        </p>
                      </div>
                    )}
                    <h2>{`$ ${
                      priceFormat(data.on_sale ? data.sale_price : data.price)
                        .int
                    }`}</h2>
                    <b className="green">
                      {data.free_shipping && "Envío gratis"}
                    </b>
                  </div>

                  <button
                    className="g-white-button details-button"
                    disabled={data.available_quantity < 1}
                    onClick={() => addToCart(data._id)}
                  >
                    Agregar al carrito
                  </button>
                  <br />
                  <button
                    className="g-white-button details-button"
                    disabled={data.available_quantity < 1}
                    onClick={() => buyNow(data._id)}
                  >
                    Comprar ahora
                  </button>
                </div>

                {data.main_features && (
                  <div className="details-mainfeatures">
                    <b>Caracteristicas principales</b>
                    <div>
                      <ul>
                        {data.main_features.map((e) => (
                          <li key={e}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="tab-container">
            <div className="tab-button-container">
              {data.description && (
                <button
                  onClick={() => handleTabChange(true)}
                  className={`tab-button${
                    description ? " tab-button-active" : ""
                  }`}
                >
                  Descripción
                </button>
              )}

              {data.attributes && (
                <button
                  onClick={() => handleTabChange(false)}
                  className={`tab-button${
                    !description ? " tab-button-active" : ""
                  }`}
                >
                  Atributos
                </button>
              )}
            </div>

            {description ? (
              <div className="details-description-container">
                {data.description && <p>{data.description}</p>}
              </div>
            ) : (
              <div className="details-attributes-container">
                <div
                  className={`all-attributes-container${
                    attributesColumns ? " attributes-two-columns" : ""
                  }`}
                  style={{ height: attributesHeight, width: "fit-content" }}
                >
                  {React.Children.toArray(
                    data.attributes?.map(
                      (e) =>
                        e.value_name && (
                          <div className="attribute-container">
                            <div>{e.name}</div>
                            <div>{e.value_name}</div>
                          </div>
                        )
                    )
                  )}                  
                </div>
              </div>
            )}
          </div>

          {(!/MLA/g.test(data._id)) && <Comments 
            product_id={data._id}
            comments={data.comments}
            allowed={data.allowComment}/>}

        </div>
      )}
    </div>
  );
};

export default Details;
