import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddressCard from "../Profile/AddressCard";
import OrderCardAdmin from "./OrderCardAdmin";
import { adminLoadUserDetails } from "../../Redux/reducer/sessionSlice";
import UserCardResume from "./UserCardResume";
import WishlistCard from "../Profile/WishlistCard";
import OrderDetails from "../Profile/OrderDetails";
import ReturnButton from "../common/ReturnButton";
import SaleMetrics from "../Profile/SaleMetrics/SaleMetrics";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";
import "./UserDetails.css";

const UserDetails = ({ openBanUser, openUnbanUser, openPromoteUser }) => {
  const [user, setUser] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [publications, setPublications] = useState([]);
  const dispatch = useDispatch();
  const { adminUserDetails } = useSelector((state) => state.sessionReducer);
  const [orderDetails, setOrderDetails] = useState({});
  const [active, setActive] = useState();

  const { userData, addressData, ordersData, wishlistData, publicationsData } =
    adminUserDetails;

  useEffect(() => {
    if (Object.keys(adminUserDetails).length) {
      setUser(userData);
      setAddresses(addressData);
      setOrders(ordersData);
      setWishlist(wishlistData);
      setPublications(publicationsData);
    } // eslint-disable-next-line
  }, [adminUserDetails]);

  const placeholder = async (id) => {};

  useEffect(() => {
    return () => {
      dispatch(adminLoadUserDetails({}));
    }; // eslint-disable-next-line
  }, []);

  return (
    <div className="admin-user-details-container">
      <div className="admin-user-details-main-data">
        <UserCardResume
          user={user}
          openBanUser={openBanUser}
          openUnbanUser={openUnbanUser}
          openPromoteUser={openPromoteUser}
        />
      </div>

      {Object.keys(orderDetails).length > 0 ? (
        <div className="admin-order-details-container">
          <OrderDetails
            order={orderDetails}
            removeOrderDetails={() => setOrderDetails({})}
          />
          <ReturnButton
            to={`/admin/users/${userData._id}`}
            onClick={() => setOrderDetails({})}
          />
        </div>
      ) : (
        <div className="admin-user-details-complementary-data">
          <Accordion defaultIndex={[active < 4 ? active : 0]}>
            {addresses && addresses.length > 0 && (
              <AccordionItem>
                <h2>
                  <AccordionButton onClick={() => setActive(0)}>
                    <Box>Direcciones</Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  {React.Children.toArray(
                    addresses.map((address) => (
                      <AddressCard address={address} />
                    ))
                  )}{" "}
                </AccordionPanel>
              </AccordionItem>
            )}
            {orders && orders.length > 0 && (
              <AccordionItem>
                <h2>
                  <AccordionButton onClick={() => setActive(1)}>
                    <Box>Órdenes</Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <div className="usercard-details-wishlist-container">
                    {React.Children.toArray(
                      orders.map((order) => (
                        <OrderCardAdmin
                          order={order}
                          setOrderDetails={setOrderDetails}
                          getUserData={placeholder}
                        />
                      ))
                    )}
                  </div>
                </AccordionPanel>
              </AccordionItem>
            )}
            {publications && publications.length > 0 && (
              <div className="admin-user-details-publications-container">
                <AccordionItem>
                  <h2>
                    <AccordionButton onClick={() => setActive(2)}>
                      <Box>Publicaciones</Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel>
                    {publications?.map((p) => (
                      <SaleMetrics
                        props={p}
                        /*  openDeleteProduct={openDeleteProduct}
                  openReactivateProduct={openReactivateProduct}
                  openDiscountProduct={openDiscountProduct} */
                      />
                    ))}
                  </AccordionPanel>
                </AccordionItem>
              </div>
            )}
            {wishlist && wishlist.length > 0 && (
              <AccordionItem>
                <h2>
                  <AccordionButton onClick={() => setActive(3)}>
                    <Box>Favoritos</Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <div className="usercard-details-wishlist-container">
                    {React.Children.toArray(
                      wishlist.map((product) => (
                        <div className="usercard-details-wishlist-card-container">
                          <WishlistCard productData={product} />
                        </div>
                      ))
                    )}
                  </div>
                </AccordionPanel>
              </AccordionItem>
            )}
          </Accordion>
          <div className="admin-user-details-return-container">
            <ReturnButton to={`/admin/users`} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
