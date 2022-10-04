import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { formatDate } from "../../helpers/formatDate";
import { priceFormat } from "../../helpers/priceFormat";
import Carousel from "../Home/Carousel/Carousel";

import "./OrderCardAdmin.css";

const OrderCardAdmin = ({ order, setOrderDetails, getUserData }) => {
  //! VOLVER A VER agregar ordenamiento y filtros
  const location = useLocation();
  const [productsImages, setProductsImages] = useState(false);
  const [waitingResponse, setWaitingResponse] = useState(false);
  const {
    products,
    user,
    shipping_address,
    status,
    expiration_date_to,
    payment_date,
    shipping_cost,
    total,
  } = order;

  let actualDate = new Date().getTime(-10800000);

  useEffect(() => {
    let imagesArray = [];
    products?.forEach((e) => {
      imagesArray.push({ img: e.img, url: "" });
    });
    setProductsImages(imagesArray);
    // eslint-disable-next-line
  }, []);

  return (
    <div
      className="admin-order-card-container"
      onClick={() => {
        setOrderDetails({ ...order, images: productsImages });
        getUserData(user);
      }}
    >
      {location.pathname === "/admin/orders" && (
        <div className="admin-order-card-userid">
          <Link to={`/admin/users/${user}`}>
            <p>Usuario {user}</p>
          </Link>
        </div>
      )}

      <div className="profile-order-products-details">
        {productsImages.length && productsImages.length > 1 ? (
          <div className="profile-order-carousel-container">
            <Carousel
              images={productsImages}
              interval={2500}
              pausable={false}
              width="8rem"
              height="8rem"
              id={order.id}
            />
            {/* <div className="card-image-back-style"></div> */}
          </div>
        ) : (
          productsImages.length &&
          productsImages.length === 1 && (
            <div className="profile-order-carousel-container profile-order-img-container">
              <img
                key={productsImages[0].img}
                src={productsImages[0].img}
                alt={"product"}
              />
              {/* <div className="card-image-back-style"></div> */}
            </div>
          )
        )}

        {/* <p>{order.description}</p> */}
        <div className="profile-order-products-names-container">
          {React.Children.toArray(
            order.products.map((prod, i) =>
              i < 5 ? (
                <p>
                  {prod.quantity > 1 && `${prod.quantity}x `}
                  {prod.product_name}
                </p>
              ) : i === order.products.length - 1 ? (
                <p>{`+${i - 4} productos...`}</p>
              ) : (
                <></>
              )
            )
          )}
        </div>
      </div>

      <div className="admin-order-card-data-container">
        <span className="admin-order-card-total">
          Total ${priceFormat(total + shipping_cost).int}
        </span>
        <p>
          {`${shipping_address?.street_name} ${shipping_address?.street_number}, ${shipping_address?.city}`}
        </p>
        {status === "approved" && (
          <>
            <p>Aprobado el {formatDate(payment_date)}</p>
            <p>
              {" "}
              {actualDate < order.delivery_date ? "Llega el " : "Llegó el "}
              {formatDate(order.delivery_date)}
            </p>
          </>
        )}
        {status === "pending" && (
          <p>Vence el {formatDate(expiration_date_to)}</p>
        )}
        {status === "expired" && (
          <p>Caducado el {formatDate(expiration_date_to)}</p>
        )}
      </div>
    </div>
  );
};

export default OrderCardAdmin;
