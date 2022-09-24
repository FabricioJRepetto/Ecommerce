import React from 'react'
import './SelectAddress.css'

const SelectAddress = ({address, handleSelect, openAddForm, closeAddList}) => {
  return (
    <div className='select-addres-modal-container'>
        <h1>Selecciona una dirección</h1>
        <div>
            {address?.map((e) => (
                <div key={e._id}
                    onClick={() => handleSelect(e._id.toString())}
                    className='select-address-modal-card'>
                    {`${e.street_name} ${e.street_number}, ${e.zip_code}, ${e.city}, ${e.state}`}                    
                </div>
            ))}
        </div>
            <button
                className='g-white-button details-button'
                onClick={() => {
                    openAddForm(true);
                    closeAddList();
                }}
            >
                Añadir una nueva
            </button>
    </div>
  )
}

export default SelectAddress