import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell } from "recharts";
import { priceFormat } from "../../helpers/priceFormat";
import "./Metrics.css";

const initialMetrics = {
  totalUsers: null,
  googleUsers: null,
  ownPublishedProducts: null,
  userPublishedProducts: null,
  productsSold: null,
  totalProfits: null,
  productsWished: null,
  productsOnSale: null,
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

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    name,
    value,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {value}
      </text>
    );
  };

  return (
    <div className="admin-metrics-container component-fadeIn">
      <h1>Métricas</h1>
      <div className="admin-metrics-all-charts-container">
        <div className="admin-metrics-chart-container">
          <h3>Productos publicados</h3>
          <div>
            <p style={{ color: "#0088FE" }}>Provider</p>
            <p style={{ color: "#00C49F" }}>Usuarios</p>
          </div>
          <PieChart width={190} height={190}>
            <Pie
              label={renderCustomizedLabel}
              labelLine={false}
              dataKey="products"
              outerRadius={80}
              fill="#8884d8"
              data={[
                {
                  name: "Provider",
                  products: metrics.ownPublishedProducts,
                },
                {
                  name: "Usuarios",
                  products: metrics.userPublishedProducts,
                },
              ]}
            >
              {[0, 1].map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </div>

        <div className="admin-metrics-chart-container">
          <h3>Órdenes</h3>
          <div>
            <p style={{ color: "#0088FE" }}>Completadas</p>
            <p style={{ color: "#00C49F" }}>Pendientes</p>
            <p style={{ color: "#FFBB28" }}>Expiradas</p>
          </div>
          <PieChart width={190} height={190}>
            <Pie
              label={renderCustomizedLabel}
              labelLine={false}
              dataKey="orders"
              outerRadius={80}
              fill="#8884d8"
              data={[
                {
                  name: "Completadas",
                  orders: metrics.ordersApproved,
                },
                {
                  name: "Pendientes",
                  orders: metrics.ordersPending,
                },
                {
                  name: "Expiradas",
                  orders: metrics.ordersExpired,
                },
              ]}
            >
              {[0, 1, 2].map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </div>

        <div className="admin-metrics-chart-container">
          <h3>Usuarios registrados</h3>
          <div>
            <p style={{ color: "#0088FE" }}>Email</p>
            <p style={{ color: "#00C49F" }}>Google</p>
          </div>
          <PieChart width={190} height={190}>
            <Pie
              label={renderCustomizedLabel}
              labelLine={false}
              dataKey="users"
              outerRadius={80}
              fill="#8884d8"
              data={[
                {
                  name: "Email",
                  users: metrics.totalUsers - metrics.googleUsers,
                },
                {
                  name: "Google",
                  users: metrics.googleUsers,
                },
              ]}
            >
              {[0, 1].map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>

      <div className="admin-metrics-text-boxes-container">
        <div className="admin-metrics-text-box">
          <p>Ofertas activas PROPIAS </p>
          <p>{metrics.productsOnSale}</p>
        </div>

        <div className="admin-metrics-text-box">
          <p>Productos vendidos</p>
          <p>{metrics.productsSold}</p>
        </div>

        <div className="admin-metrics-text-box">
          <p>Total de ventas</p>
          <p>${priceFormat(metrics.totalProfits).int}</p>
        </div>

        <div className="admin-metrics-text-box">
          <p>Productos deseados</p>
          <p>{metrics.productsWished}</p>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
