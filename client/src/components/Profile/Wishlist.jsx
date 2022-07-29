import React from 'react';
import Card from '../Products/Card';

const Wishlist = ({ loading, wishlist, wl_id}) => {
  return (
    <div>
        <h1>Wishlist</h1>
        {!loading ? (
        <div className="profile-wishlistcard-container">
            {wishlist.length ? (
            React.Children.toArray(
                wishlist?.map((product) => (
                <Card
                    productData={product}
                    fav={wl_id.includes(product._id)}
                />
                ))
            )
            ) : (
            <p>Wishlist empty</p>
            )}
        </div>
        ) : (
        <div>LOADING</div>
        )}
    </div>
  )
}

export default Wishlist