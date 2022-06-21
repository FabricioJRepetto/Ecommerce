import axios from "axios";
import React, { useState } from "react";
import { useAxios } from "../../hooks/useAxios";

const Profile = () => {
    const [render, setRender] = useState('details');
    const {data: orders, oLoading} = useAxios('GET', `/order/userall`);
    const {data: address, aLoading} = useAxios('GET', `/user/address/`);

    if (!aLoading) {
        console.log(address);
    }

    const deleteAddress = async (id) => { 
        await axios.delete(`/user/address/${id}`);
        //: recargar orders
    };
    
  return (
  <div>
    <h1>Profile</h1>
    <button onClick={()=> setRender('details')}>Account Details</button>
    <button onClick={()=> setRender('orders')}>Orders</button>
    <button onClick={()=> setRender('address')}>Shipping address</button>
    <button onClick={()=> setRender('whishlist')}>Whishlist</button>
    <hr/>
    <div>
        {(render === 'details') && 
        <div>detalles</div>}

        {(render === 'orders') && 
        <div>
            <h2>Orders</h2>
            {!oLoading
                ? orders?.map(e=>
                    <div key={e.id}>
                        {e.products?.map(pic=>
                            <img key={pic.id} src={pic.img} height={50} alt={'product'}/>
                        )}
                        <p>{e.description}</p>
                        <p>shipment address: {`
                            ${e.shipping_address.street_name} 
                            ${e.shipping_address.street_number}, 
                            ${e.shipping_address.city} 
                        `}</p>
                        <p>payment status: {e.status}</p>
                        <p>total payment: ${e.total}</p>
                        <p>- - -</p>
                    </div>
                )
                : <p>LOADING</p>}
        </div>}

        {(render === 'address') && 
        <div>
            <h1>Address</h1>
            {!aLoading
                ? React.Children.toArray(address?.address.map(e=>
                    <div key={e.id}>
                        <p>{`${e.street_name} ${e.street_number}, ${e.zip_code}, ${e.city}, ${e.state}.`}</p>
                        <button >edit</button>
                        <button onClick={()=>deleteAddress(e._id)}>delete</button>
                        <p >- - -</p>
                    </div>
                ))
                : <p>LOADING</p>}
        </div>}

        {(render === 'whishlist') && 
        <div>deseados</div>}
        
    </div>
  </div>
  );
};

export default Profile;
