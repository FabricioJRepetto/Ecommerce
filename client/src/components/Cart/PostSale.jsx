import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loadCart } from "../../Redux/reducer/cartSlice";
import "./PostSale.css";
import Carousel from "../Home/Carousel/Carousel";
import LoaderBars from "../common/LoaderBars";
import DeliveryProgress from "../common/DeliveryProgress";
import { ReactComponent as Spinner } from "../../assets/svg/spinner.svg";
import ReturnButton from "../common/ReturnButton";

const PostSale = () => {
  const [order, setOrder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState(false);
  const [background, setBackground] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [params] = useSearchParams(),
    id = params.get("external_reference");
  let status = params.get("status") || "cancelled";

  useEffect(() => {
    (async () => {
      const { data } = await axios(`/order/${id}`);
      if (!data.products) {
        console.error("no order");
        navigate("/");
      }
      console.log(data);
      setOrder(data);
      setLoading(false);

      if (data && !data?.payment_date && status === "approved")
        deliveryWaiter(id);

      let aux = [];
      data.products.forEach((e) => {
        aux.push({ img: e.img, url: "" });
      });
      setImages(aux);

      if (data && status === "approved") {
        console.log("llega aca approved #1");
        //? background effect
        setBackground("postsale-approved animation-start");
        setTimeout(() => {
          setBackground("postsale-approved animation-loop");
        }, 6000);
        console.log("llega aca approved #2");

        if (data.order_type === "cart") {
          console.log("llega aca approved #3");
          //? vaciar carrito
          await axios.delete(`/cart/empty`);

          //? Vaciar el estado de redux onCart
          dispatch(loadCart([]));

          //? Quitar last_order en el carrito de la db
          await axios.put(`/cart/order/`);
        } else {
          console.log("llega aca approved #3b");
          //? vaciar el buynow
          axios.post(`/cart/`, { product_id: "" });
        }
        console.log("llega aca approved #4");
        //? Cambiar el estado a 'processing'
        await axios.put(`/order/${id}`, {
          status: "processing",
        });

        console.log("llega aca approved #5");
        //? en el back (choNotif):
        // cambia orden a pagada
        // resta unidades de cada stock
      }

      if (data && status !== "approved" && data.status !== "approved") {
        console.log("llega aca not approved");

        setBackground("postsale-pending animation-start");
        setTimeout(() => {
          setBackground("postsale-pending animation-loop");
        }, 6000);
        //? si llega como null o cancelled cambiar estado a "pending"
        if (status === "null" || status === "cancelled") {
          console.log("llega aca cambiar estado");

          await axios.put(`/order/${id}`, {
            status: "pending",
          });
        } else {
          console.log("llega aca cambiar estado");
          //? cambiar estado de la orden si el status no es aprobado en ninguno de los casos
          await axios.put(`/order/${id}`, {
            status,
          });
        }
      }
    })();
    //eslint-disable-next-line
  }, []);

  const deliveryWaiter = async (id) => {
    try {
      console.log("pidiendo orden nueva");
      const { data } = await axios(`/order/${id}`);
      if (data.payment_date) {
        console.log("orden nueva recibida");
        setOrder(data);
      } else {
        throw new Error("");
      }
    } catch (error) {
      setTimeout(() => {
        deliveryWaiter(id);
      }, 2000);
    }
  };

  const messageQuantity = () => {
    if (order.products.length === 1) {
      if (order.products[0].quantity > 1) {
        return "¡Los productos ya son tuyos!";
      } else {
        return "¡El producto ya es tuyo!";
      }
    }

    return "¡Los productos ya son tuyos!";
  };

  return (
    <div className="postsale-container">
      {loading && !order ? (
        <LoaderBars />
      ) : (
        <div className="postsale-inner">
          <div className={`postsale-header ${background}`}>
            <div className="postsale-img-container">
              <Carousel
                images={images}
                interval={2500}
                pausable={false}
                width="25vh"
                height="25vh"
              />
              <div className="card-image-back-style"></div>
            </div>
          </div>
          <div className="postsale-details-container">
            {status === "approved" && (
              <div>
                <h1>¡YA CASI!</h1>
                <h3>{messageQuantity()}</h3>
                <h3>Ahora estamos preparando el envío</h3>

                {order?.delivery_date ? (
                  <DeliveryProgress order={order} />
                ) : (
                  <Spinner />
                )}
              </div>
            )}
            {status !== "approved" && (
              <div>
                <h1>HUBO UN ERROR...</h1>
                <h3>¡Pero puedes retomar el pago!</h3>
                <button className="g-white-button">
                  <a href={order?.payment_link}>Voy a intentarlo de nuevo</a>
                </button>
                <p className="postsale-text-margin">
                  También puedes encontrar el link de pago en tu perfil para
                  realizarlo más tarde
                </p>
              </div>
            )}
            <p>{`Estado del pago: ${status}`}</p>
            <p>Medio de pago: {order?.payment_source}</p>
            <p>
              Id de orden: <i>{order?.id}</i>
            </p>
            <div className="postsale-back-container">
              <ReturnButton to={"/cart"} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostSale;
