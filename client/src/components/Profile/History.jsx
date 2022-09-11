import React from "react";
import LoaderBars from "../common/LoaderBars";
import HistoryCard from "./HistoryCard";
import "./History.css";

const History = ({ loading, history, wl_id }) => {
  return (
    <div>
      {!loading ? (
        <>
          <h1>Historial</h1>
          <div className="profile-history-container">
            {history.length ? (
              React.Children.toArray(
                history?.map((e) => (
                  <HistoryCard
                    key={e._id}
                    img={e.thumbnail}
                    name={e.name}
                    price={e.price}
                    premium={e.premium}
                    sale_price={e.sale_price}
                    discount={e.discount}
                    prodId={e._id}
                    free_shipping={e.free_shipping ? true : false}
                    on_sale={e.on_sale}
                    fav={wl_id.includes(e._id)}
                    fadeIn={true}
                  />
                ))
              )
            ) : (
              <p>Aún no has visto ningún producto</p>
            )}
          </div>
        </>
      ) : (
        <LoaderBars />
      )}
    </div>
  );
};

export default History;
