import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../../hooks/useNotification";
import { addCart } from "../../Redux/reducer/cartSlice";
import Galery from "./Galery";
import { WishlistButton as Fav } from "./WishlistButton";
import "./Details.css";

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
        let aux = {...querys};
        delete aux.q;
        let filter = obj.filter;
        let value = obj.value;
        dispatch(loadQuerys({...aux, [filter]: value}));
        navigate('/results')
    }

    return (
        <div>
        {loading && <Spinner className='details-spinner'/>}
        {data && (
            <div>
                <div className="details-head-container">
                    <div className='bread-crumbs'>
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
                    <div className="details-head-main">
                        <Galery imgs={data.images} />
                        <div className="details-price-section">
                            <div>
                                <div className="details-fav-button-container">
                                    <Fav
                                        prodId={data._id}
                                        visible={true}
                                        fav={wishlist.includes(data._id)}
                                    />
                                </div>
                                <p>{data.brand?.toUpperCase()}</p>
                                <h1>{data.name}</h1>
                                <div onClick={() => addFilter({filter: 'category', value: data.category.id})}>{data.category.name}</div>
                                <del>{data.on_sale && "$" + data.price}</del>
                                <h2>
                                {`$ ${priceFormat(data.on_sale ? data.sale_price : data.price).int}${priceFormat(data.on_sale ? data.sale_price : data.price).cents || ''}`}
                                </h2>
                                {data.on_sale && (
                                <div className="details-sale-section">
                                    <Sale className="onsale-svg" />
                                    <p>{data.discount}% off</p>
                                </div>
                                )}
                                <p>{data.free_shipping && "free shipping"}</p>
                                <p>{data.available_quantity > 0 ? 'stock: '+data.available_quantity : 'out of stock'}</p>
                                <button disabled={data.available_quantity < 1} onClick={() => addToCart(data._id)}>Add to cart</button>
                                <br />
                                <button disabled={data.available_quantity < 1} onClick={() => buyNow(data._id)}>Buy now</button>
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

                <div>
                    <br />
                    <p>
                    <b>attributes</b>
                    </p>
                    <div>
                    {React.Children.toArray(
                        data.attributes?.map((e) => (
                        <p key={e.name}>{`${e.name}: ${e.value_name}`}</p>
                        ))
                    )}
                    </div>
                    <br />
                    {data.description && <p>{data.description}</p>}
                </div>
                <div></div>
            </div>
        )}
        </div>
    );
};

export default Details;