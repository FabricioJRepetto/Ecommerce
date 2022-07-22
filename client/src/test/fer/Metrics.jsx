import { useEffect, useState } from "react";
import axios from "axios";

const initialMetrics = {
  totalUsers: null,
  googleUsers: null,
  publishedProducts: null,
  productsSold: null,
  totalProfits: null,
  productsWished: null,
  activeSales: null,
  ordersApproved: null,
  ordersPending: null,
  ordersExpired: null,
};

const Metrics = () => {
  const [metrics, setMetrics] = useState(initialMetrics);

  useEffect(() => {
    axios("/admin/metrics")
      .then(({ data }) => {
        setMetrics(data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <h4>Usuarios registrados: {metrics.totalUsers}</h4>
      <h4>Usuarios de Google: {metrics.googleUsers}</h4>
      <h4>Productos publicados: {metrics.publishedProducts}</h4>
      <h4>Ofertas activas PROPIAS: {metrics.activeSales}</h4>
      <h4>Productos vendidos: {metrics.productsSold}</h4>
      <h4>Ganancias totales: {metrics.totalProfits}</h4>
      <h4>Productos deseados: {metrics.productsWished}</h4>
      <h4>Órdenes completadas: {metrics.ordersApproved}</h4>
      <h4>Órdenes pendientes: {metrics.ordersPending}</h4>
      <h4>Órdenes expiradas: {metrics.ordersExpired}</h4>
    </div>
  );
};

export default Metrics;
