import React from "react";
import LoaderBars from "../common/LoaderBars";
import HistoryCard from "./HistoryCard";
import "./History.css";

const History = ({ loading, history, wl_id }) => {
  return (
    <div className="component-fadeIn">
      {!loading ? (
        <>
          <h1>Historial</h1>
          <div className="profile-history-container">
            {history.length ? (
              React.Children.toArray(
                history?.map((e) => (
                  <HistoryCard
                    product={e}
                    free_shipping={e.free_shipping ? true : false}
                    fav={wl_id.includes(e._id)}
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
