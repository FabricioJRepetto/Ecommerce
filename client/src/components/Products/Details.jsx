import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../../hooks/useNotification";
import { addCart } from "../../Redux/reducer/cartSlice";
import Galery from "./Galery";
import { WishlistButton as Fav } from "./WishlistButton";
import "./Details.css";

import Footer from '../common/Footer'
import { ReactComponent as Sale } from "../../assets/svg/sale.svg";
import { ReactComponent as Spinner } from "../../assets/svg/spinner.svg";
import { loadQuerys } from "../../Redux/reducer/productsSlice";
import { priceFormat } from "../../helpers/priceFormat";

const Details = () => {
  let { id } = useParams();
  const cart = useSelector((state) => state.cartReducer.onCart);
  const { wishlist } = useSelector((state) => state.cartReducer);
  const { session } = useSelector((state) => state.sessionReducer);
  const querys = useSelector((state) => state.productsReducer.searchQuerys);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notification] = useNotification();

  const [data, setData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attributesHeight, setAttributesHeight] = useState(null);
  const [attributesColumns, setAttributesColumns] = useState(false);
    const [description, setDescription] = useState(true)

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

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await axios(`/product/${id}`);
      setData(data);
      setDescription(!!data.description)
      if (data.attributes) {
        if (data.attributes.length > 15) {
          setAttributesColumns(true);
          setAttributesHeight(`${Math.floor((data.attributes.length / 2) * 2.2)}rem`);
        } else {
          setAttributesHeight('fit-content');
        }
      }
      setLoading(false);
    })();
    // eslint-disable-next-line
  }, [id]);

  const addToCart = async (id) => {
    if (session) {
      const { statusText, data } = await axios.post(`/cart/${id}`);
      statusText === "OK" && !cart.includes(id) && dispatch(addCart(id));
      notification(
        data.message,
        "/cart",
        `${statusText === "OK" ? "success" : "warning"}`
      );
    } else {
      notification("Log in to proceed.", "/signin", "warning");
    }
  };

  const buyNow = async (id) => {
    if (session) {
      await axios.post(`/cart/`, { product_id: id });
      navigate("/buyNow");
    } else {
      notification("Log in to proceed.", "/signin", "warning");
    }
  };

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
     }

    return (
        <div>
        {loading && <Spinner className='details-spinner'/>}
        {data && (
            <div>
                <div className="details-head-container">
                    <div className='bread-crumbs'>
                        <div>
                            {data.path_from_root?.length > 0 &&
                                React.Children.toArray(
                                    data.path_from_root.map((c, index) => (
                                        <span key={c.id} onClick={ () => addFilter({filter: 'category', value: c.id})}>
                                            { (index > 0 ? ' > ' : '') + c.name }
                                        </span>
                                    ))
                                )
                            }
                        </div>

                        <Fav
                            prodId={data._id}
                            visible={true}
                            position={false}
                            fav={wishlist.includes(data._id)} />
                    </div>
                    <div className="details-head-main">
                        <Galery imgs={data.images} ripple={true}/>
                        <div className="details-head-section">
                            <div>                                
                                <div className="details-title-container">
                                    <p>{data.brand?.toUpperCase()}</p>
                                    <h1>{data.name}</h1>                                    
                                </div>
                               
                                <div className="details-price-section">
                                    {data.on_sale && (
                                        <div className="details-sale-section">
                                            <p>$<del>{priceFormat(data.price).int}</del> 
                                            <b>{' '+data.discount}% off</b></p>
                                        </div>
                                    )}
                                    <h2>{`$ ${priceFormat(data.on_sale ? data.sale_price : data.price).int}${priceFormat(data.on_sale ? data.sale_price : data.price).cents || ''}`}</h2>
                                    <p>{data.free_shipping && "free shipping"}</p>
                                </div>
                                
                                <button className="g-white-button details-button" disabled={data.available_quantity < 1} onClick={() => addToCart(data._id)}>Add to cart</button>
                                <br />
                                <button className="g-white-button details-button" disabled={data.available_quantity < 1} onClick={() => buyNow(data._id)}>Buy now</button>
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

                        {data.description && <button onClick={()=>handleTabChange(true)} 
                            className={`tab-button ${description ? 'tab-button-active' : ''}`}>
                                Descripción
                        </button>}

                        {data.attributes && <button onClick={()=>handleTabChange(false)} 
                            className={`tab-button ${!description ? 'tab-button-active' : ''}`}>
                                Atributos
                        </button>}
                    </div>
                    
                    {description 
                    ? <div className="details-description-container">{data.description && <p>{data.description}</p>}</div>
                    : <div className="details-attributes-container">
                        <div className={`all-attributes-container ${
                            attributesColumns ? "attributes-two-columns" : ""
                            }`}
                            style={{ height: attributesHeight }}
                        >
                            {React.Children.toArray(
                            data.attributes?.map((e) => (
                                (e.value_name) &&
                                <div className="attribute-container">
                                    <div>{e.name}</div>
                                    <div>{e.value_name}</div>
                                </div>
                                
                            ))
                            )}
                        </div>
                    </div>
                    }
                </div>

            </div>
        )}
        <Footer />
        </div>
    );
};

export default Details;
