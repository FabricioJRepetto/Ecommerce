import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { useAxios } from '../../hooks/useAxios';
import { useNotification } from '../../hooks/useNotification';
import { addCart } from '../../Redux/reducer/cartSlice';
import Galery from './Galery';
import { WhishlistButton as Fav } from './WhishlistButton';
import './Details.css'

import { ReactComponent as Sale } from '../../assets/svg/sale.svg'

const Details = () => {
    let { id } = useParams();
    const cart = useSelector((state) => state.cartReducer.onCart);
    const whishlist = useSelector((state) => state.cartReducer.whishlist);
    const session = useSelector((state) => state.sessionReducer.session);
    const dispatch = useDispatch();
    const navigate =useNavigate();
    const [notification] = useNotification();

    const { data, loading, error } = useAxios('GET', `/product/${id}`);

    useEffect(() => {
        if (!loading && session && data) {
            // setear historial
            const payload = {
                product_id: data._id,
                category: data.category || '',
            };
            axios.post(`/history/visited`, payload);
        }
        // eslint-disable-next-line
    }, [loading])
    

    const addToCart = async (id) => {
        if (session) {
            const { statusText, data } = await axios.post(`/cart/${id}`);
            statusText === 'OK' && !cart.includes(id) && dispatch(addCart(id));
            notification(data.message, '/cart', `${statusText === 'OK' ? 'success' : 'warning'}`);
        } else {
            notification('Log in to proceed.', '/signin', 'warning')
        }
  };

  const buyNow = async (id) => { 
        if (session) {
            await axios.post(`/cart/`, {product_id: id});
            navigate('/buyNow');
        } else {
            notification('Log in to proceed.', '/signin', 'warning')
        }
   }

  return (
    <div>
        <h1>Details</h1>
        {loading && <p>LOADING</p>}
        {error && <p>{error}</p>}
        {data && 
            <div>
                <div className='details-head-container'>
                    <Galery imgs={data.images} />
                    <div className='details-price-section'>

                        <div>
                            <Fav prodId={data._id} visible={true} fav={whishlist.includes(data._id)}/>
                            <p>{data.brand?.toUpperCase()}</p>
                            <h2>{data.name}</h2>
                            <del>{data.on_sale && '$'+data.price}</del>
                            <h2>{data.on_sale ? '$'+data.sale_price : '$'+data.price}</h2>
                            { data.on_sale && <div className='details-sale-section'>
                                    <Sale className='onsale-svg'/>
                                    <p>{data.discount}% off</p>
                                </div>}
                            <p>{data.free_shipping && 'free shipping'}</p>
                            <button onClick={() => addToCart(data._id)}>Add to cart</button>
                            <br />
                            <button onClick={() => buyNow(data._id)}>Buy now</button>
                        </div>

                        {data.main_features &&
                        <div>
                            <p><b>Main features</b></p>
                            <div>
                                {data.main_features.map(e=>
                                    <p key={e}>{e}</p>
                                )}
                            </div>
                        </div>}

                    </div>
                </div>
                
                <div>
                    <br />
                    <p><b>attributes</b></p>
                    <div>
                        {React.Children.toArray(data.attributes?.map(e=>
                            <p key={e.name}>{`${e.name}: ${e.value_name}`}</p>
                        ))}
                    </div>
                    <br />
                    {data.description && <p>{data.description}</p>}
                </div>
                <div></div>
            </div>
        }
    </div>
  )
}

export default Details