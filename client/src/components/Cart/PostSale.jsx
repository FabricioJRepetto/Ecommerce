import axios from 'axios'
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom'
import { loadCart } from '../../Redux/reducer/cartSlice';
import './PostSale.css';
import Carousel from '../Home/Carousel/Carousel';
import LoaderBars from '../common/LoaderBars';
import DeliveryProgress from '../common/DeliveryProgress';
import { ReactComponent as Spinner } from '../../assets/svg/spinner.svg';
const PostSale = () => {
    const [order, setOrder] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingDelivery, setLoadingDelivery] = useState(true);
    const [images, setImages] = useState(false);
    const [background, setBackground] = useState('')
    const dispatch = useDispatch();
    
    const [params] = useSearchParams(),
    id = params.get('external_reference');
    let status = params.get('status') || 'cancelled';
    
    useEffect(() => {
        (async () => {
            if (status === 'null' || status === 'cancelled') {
                setBackground('postsale-pending animation-start');
                setTimeout(() => {
                    setBackground('postsale-pending animation-loop');                    
                }, 6000);
                // return navigate('/')
            };
            
            const { data } = await axios(`/order/${id}`);
            console.log(data);
            setOrder(data);                

            let aux = [];
            data.products.forEach(e => {
                aux.push({img: e.img, url: ''});
            });
            setImages(aux);

            setLoading(false)
            
            if (status === 'approved') {
                if (data.order_type === 'cart') {
                    //? vaciar carrito
                    await axios.delete(`/cart/empty`);
                    
                    //? Vaciar el estado de redux onCart
                    dispatch(loadCart([]));
                    
                    //? Quitar last_order en el carrito de la db
                    await axios.put(`/cart/order/`);
                } else {
                    //? vaciar el buynow
                    axios.post(`/cart/`, {product_id: ''});
                }
                //? Cambiar el estado a 'processing'
                await axios.put(`/order/${id}`,{
                    status: 'processing'
                });
                //? en el back (choNotif):
                // cambia orden a pagada    
                // resta unidades de cada stock

                //? background effect
                setBackground('postsale-approved animation-start');
                setTimeout(() => {
                    setBackground('postsale-approved animation-loop');                    
                }, 6000);
            };
            if (status !== 'approved' && data.status !== 'approved') {
                setBackground('postsale-pending animation-start');
                setTimeout(() => {
                    setBackground('postsale-pending animation-loop');                    
                }, 6000);
                //? cambiar estado de la orden si el status no es aprobado en ninguno de los casos
                await axios.put(`/order/${id}`,{
                    status
                });
            }
        })()
      // eslint-disable-next-line
    }, [])

    const deliveryWaiter = async (id) => {
        let aux = null;
        aux = setInterval(async () => {
            const { data } = await axios(`/order/${id}`);
            if (data.payment_date) {
                setOrder(data);
                setLoadingDelivery(false);
                clearInterval(aux)
            }
        }, 1000);
     }

    const messageQuantity = () => {
        if (order.products.length === 1) {
            if (order.products[0].quantity > 1) {
                return 'Los productos ya son tuyos!'
            } else {
                return 'El producto ya es tuyo!'
            }
        } 

        return 'Los productos ya son tuyos!'        
     };
    
    return (
        <div className='postsale-container'>
            { (loading && !order )
                ? <LoaderBars />
                : <div className='postsale-inner'>
                    <div className={`postsale-header ${background}`}>
                        <div className="postsale-img-container">
                            <Carousel images={images} interval={2500} pausable ={false} width="15vw" height='15vw'/>
                            <div className='card-image-back-style'></div>
                        </div>                        
                    </div>
                    <div className="postsale-details-container">
                        {status === 'approved' && <div>
                            <h1>YA CASI!</h1>
                            <h3>{messageQuantity()}</h3>
                            <h3>Ahora estamos preparando el envío.</h3>

                            {order.delivery_date 
                                ? <DeliveryProgress order={order}/>
                                : <Spinner />
                            }
                        </div>}
                        {/* <p>Resumen: {order?.description}</p> */}
                        {status !== 'approved' && <div>
                            <h1>HUBO ALGÚN ERROR...</h1>
                            <h3>Pero podés retomar el pago!</h3>
                            <button className='g-white-button'>
                                <a href={order.payment_link}>Voy a intentarlo de nuevo</a>
                            </button>
                            <p className='postsale-text-margin'>También podés encontrar el link de pago en tu perfil para realizarlo más tarde.</p>
                        </div>}
                        <p>{`Estado del pago: ${status}`}</p>
                        <p>Medio de pago: {order.payment_source}</p>
                        <p>Id de orden: <i>{order?.id}</i></p>
                    </div>
                </div>}
        </div>
    )
}

export default PostSale