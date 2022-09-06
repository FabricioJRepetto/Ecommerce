import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ReactComponent as Spinner } from "../../assets/svg/spinner.svg";
import ModalCard from "../Products/ModalCard";
import ChromaticText from "../common/ChromaticText";
import "./WishlistModal.css";

const WishlistModal = ({ close }) => {
  const navigate = useNavigate();
  const { wishlist } = useSelector((state) => state.cartReducer);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await axios("/wishlist/");
      setData(data);
      setLoading(false);
    })();
  }, [wishlist]);

  return (
    <div
      className={`card-modal-container${
        !loading ? " wishlist-modal-loaded" : ""
      }`}
    >
      {loading ? (
        <div className="modal-card-loading">
          <Spinner />
        </div>
      ) : (
        <div className="wishlist-modal-container">
          <div className="modal-card-header">Favoritos</div>
          {data.products.length > 0 ? (
            <div className="wishlist-modal-card-container">
              {React.Children.toArray(
                data?.products.map((e) => (
                  <ModalCard productData={e} fav close={close} />
                ))
              )}
            </div>
          ) : (
            <p className="modal-wishlist-empty">
              Aún no tienes productos deseados
            </p>
          )}
          <div
            onClick={() => [navigate("/profile/wishlist"), close()]}
            className="modal-card-all-favs pointer all-favs-text-container"
          >
            <ChromaticText text="Ver todos los productos deseados" />
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistModal;
