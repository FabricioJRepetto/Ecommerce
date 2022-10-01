import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadIdProductToEdit } from '../../../Redux/reducer/productsSlice';
import { priceFormat } from '../../../helpers/priceFormat';
import Calification from '../../common/Comments/Calification';
import { useNotification } from '../../../hooks/useNotification';

import { ReactComponent as Edit } from "../../../assets/svg/edit.svg";
import { ReactComponent as Offer } from "../../../assets/svg/offer.svg";
import { ReactComponent as Pause } from "../../../assets/svg/pause.svg";
import { ReactComponent as Play } from "../../../assets/svg/play.svg";
import { 
    FormControl,
    FormLabel,
    Switch 
} from '@chakra-ui/react'

import './SaleMetrics.css'
import axios from 'axios';

const SaleMetrics = (data) => {
    const dispatch= useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const notification = useNotification();
    const [open, setOpen] = useState(false);
    const [product, setproduct] = useState(data.props.product || false)
    const [minSale, setMinSale] = useState(false);
    const [maxSale, setMaxSale] = useState(false);
    const [totalRevenue, setTotalRevenue] = useState(false)
    
    const {
        props, 
        openDeleteProduct, 
        openReactivateProduct,
        openDiscountProduct
    } = data;

    const { _id: prodId, on_sale, sale_price, discount, name, price, thumbnail, active, average_calification, available_quantity } = product;
    
    useEffect(() => {
        let maxSale = 0;
        let minSale = props?.sales[0] ? (props.sales[0].price * props.sales[0].quantity) : 0;
        let totalRevenue = 0;
        props?.sales.forEach(s => {
            totalRevenue += s.price * s.quantity;
            maxSale < (s.price * s.quantity) && (maxSale = s.price * s.quantity);
            minSale > (s.price * s.quantity) && (minSale = s.price * s.quantity);
        });
        setMinSale(minSale);
        setMaxSale(maxSale);
        setTotalRevenue(totalRevenue);
      // eslint-disable-next-line
    }, [data])
    

    const percenter = (num) => { 
        let aux = Math.round((num * 100) / maxSale)
        if (aux > 99) {
            return 99
        } else if (aux > 10) {
            return aux            
        } else {
            return 10
        }
    }

    const editProduct = () => {
        dispatch(loadIdProductToEdit(prodId));
        location.pathname !== "/admin/products"
        ? navigate("/create")
        : navigate("/admin/create");
    };

    const updateShipping = async (e) => { 
        e.preventDefault()
        e.target.disabled = true;        
        const {data} = await axios.put(`/product/shipping/${prodId}`);
        if (data?.product) setproduct(data.product);
        notification(data.message, '', data.type);
        e.target.disabled = false;
    };
    
    return (
        <div className='publication-card-container'>
            <div className='publication-card-header'>
                <div className="profile-order-carousel-container profile-order-img-container">
                    <img src={thumbnail} alt={"product"} />
                    <div className="card-image-back-style"></div>
                </div>
                <div>
                    <p>{name}</p>
                    {on_sale && <div className="card-price-container c-mrgn">
                        <div className="card-original-price">
                            {on_sale && <del>${priceFormat(price).int}</del>}
                        </div>
                        <div className="card-price-section">
                            <div className="minicard-price-section-inner">
                                <h2>${priceFormat(on_sale ? sale_price : price).int}</h2>
                            </div>

                            {on_sale && <div className="minicard-sale-section">
                                            <p>{`${Math.round(discount)}% off`}</p>
                                        </div>}
                        </div>
                    </div>}
                    <p>${priceFormat(price).int}</p>
                </div>
                <p onClick={()=>setOpen(!open)}>Ver más detalles</p>
            </div>

            {data && <div className={`publication-card-details ${open && 'metrics-open'}`}>

                <div className='publication-card-buttons'>
                    <span className="wishlist-edit-button-container publication-card-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            editProduct();
                        }}
                        >
                        <div className="publication-tootlip">Editar publicación</div>
                        <Edit />
                        <div className="wishlist-edit-gradient metric-card-svg"></div>
                    </span>

                    <span className="wishlist-offer-button-container publication-card-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            openDiscountProduct({ prodId, name, price });
                        }}
                        >
                        <div className="publication-tootlip">Agregar descuento</div>
                        <Offer />
                        <div className="wishlist-offer-gradient  metric-card-svg"></div>
                    </span>

                    {active 
                        ? <span className="wishlist-pause-button-container publication-card-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                openDeleteProduct({ prodId, name });
                            }}>
                            <div className="publication-tootlip">Pausar publicación</div>
                            <Pause />
                            <div className="wishlist-pause-gradient  metric-card-svg"></div>
                        </span>

                        : <span className="wishlist-play-button-container publication-card-button"
                            onClick={(e) => {
                            e.stopPropagation();
                            openReactivateProduct({ prodId, name });
                            }}
                        >
                            <div className="publication-tootlip">Reanudar publicación</div>
                            <Play />
                            <div className="wishlist-play-gradient  metric-card-svg"></div>
                        </span>}
                </div>

                <div>
                    <button onClick={updateShipping}>Envío gratis</button>
                    <button onClick={()=>navigate(`/details/${prodId}`)}>Ver en la tienda</button>
                </div>
                    

                <div className='publication-card-calification'>
                    <p>Calificación actual: </p>
                    <Calification hover input
                        num={average_calification}/>                
                </div>
                <p>Ventas: {props.sales.length}</p>
                <p>Ganancias totales: ${priceFormat(totalRevenue).int}</p>
                <p>Stock: {available_quantity}</p>
                <br/>

                <p>Últimas ventas:</p>
                <div className='sales-metrics-graph'>
                    {React.Children.toArray(props?.sales.map(s => (
                        <div className='sales-metrics-graph-bar'
                            style={{height: `${percenter(s.price * s.quantity)}%`, background: `#64d500${percenter(s.price * s.quantity)}`}}>
                                <div className='metrics-tooltip'>
                                    <p>{`Total: $${priceFormat(s.price*s.quantity).int}`}</p>
                                    <p>{`Unidades: ${s.quantity}`}</p>
                                    <p>{`${new Date(parseInt(s.payment_date)).toLocaleDateString('es-Ar')}`}</p>
                                </div>
                        </div>
                    )))}
                    <div className='metric-graph-max-indicator' >${
                        priceFormat(maxSale).int
                    }</div>
                    {minSale !== maxSale && <div className='metric-graph-max-indicator' style={{top: `calc(4rem + ${84 - percenter(minSale)}%)`}}>${
                        priceFormat(minSale).int
                    }</div>}
                </div>
            </div>}
        </div>
    )
}

export default SaleMetrics