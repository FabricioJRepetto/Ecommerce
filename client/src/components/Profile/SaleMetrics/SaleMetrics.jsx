import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadIdProductToEdit } from '../../../Redux/reducer/productsSlice';
import { priceFormat } from '../../../helpers/priceFormat';
import Calification from '../../common/Comments/Calification';

import { ReactComponent as Edit } from "../../../assets/svg/edit.svg";
import { ReactComponent as Offer } from "../../../assets/svg/offer.svg";
import { ReactComponent as Pause } from "../../../assets/svg/pause.svg";
import { ReactComponent as Play } from "../../../assets/svg/play.svg";
import { useEffect } from 'react';

import './SaleMetrics.css'

const SaleMetrics = (data) => {
    const dispatch= useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [minSale, setMinSale] = useState(false);
    const [maxSale, setMaxSale] = useState(false);
    const [totalRevenue, setTotalRevenue] = useState(false)

    const {
        props, 
        openDeleteProduct, 
        openReactivateProduct,
        openDiscountProduct
    } = data;

    const { prodId, name, price, thumbnail, active, average_calification, available_quantity } = props.product;
    
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
        setLoading(false);
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

    const editProduct = (prodId) => {
        dispatch(loadIdProductToEdit(prodId));
        location.pathname !== "/admin/products"
        ? navigate("/create")
        : navigate("/admin/create");
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
                    <p>${priceFormat(price).int}</p>
                </div>
                <p onClick={()=>setOpen(!open)}>Ver más detalles</p>
            </div>

            {!loading && <div className={`publication-card-details ${open && 'metrics-open'}`}>

                <div className='publication-card-buttons'>
                    <span className="wishlist-edit-button-container publication-card-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            editProduct(prodId);
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