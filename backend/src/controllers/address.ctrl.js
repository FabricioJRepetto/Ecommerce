const Address = require("../models/Address");
const User = require("../models/user");
const setUserKey = require("../utils/setUserKey");

const getAddress = async (req, res, next) => {
  const { isGoogleUser, _id } = req.user;
  let userKey = setUserKey(isGoogleUser);

  try {
    const address = await Address.findOne({
      [userKey]: _id,
    });

    if (!address) return res.json({ message: "Address not found" });
    return res.json(address);
  } catch (error) {
    next(error);
  }
};

const addAddress = async (req, res, next) => {
  const { isGoogleUser, _id } = req.user;
  let userKey = setUserKey(isGoogleUser);

  try {
    const addressFound = await Address.findOne({
      [userKey]: _id,
    });

    if (addressFound) {
      if (addressFound.address.length > 0) {
        addressFound.address.push({ ...req.body, isDefault: false });
      } else {
        addressFound.address.push({ ...req.body, isDefault: true });
      }
      await addressFound.save();

      return res.json({
        message: "New address registered.",
        address: addressFound.address,
      });
    } else {
      const userFound = await User.findById(_id);
      const newAddress = new Address({
        address: [{ ...req.body, isDefault: true }],
        [userKey]: _id,
      });

      userFound.addresses = newAddress._id;
      await userFound.save();
      await newAddress.save();
      return res.json({
        message: "New address registered.",
        address: [newAddress], // VOLVER A VER tira error al agregar la primer address Cannot read properties of null (reading 'address'). Se soluciona con newAdd: [req.body], pero no renderiza la address agregada
        //! VOLVER A VER al crear la primer address se renderiza undefined undefined undefined undefined
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateAddress = async (req, res, next) => {
  const { state, city, zip_code, street_name, street_number } = req.body;

  const { isGoogleUser, _id } = req.user;
  let userKey = setUserKey(isGoogleUser);

  //! VOLVER A VER el edit address no funca, crea una address nueva

  try {
    const addressUpdated = await Address.findOneAndUpdate(
      {
        [userKey]: _id,
        "address._id": req.params.id,
      },
      {
        $set: {
          "address.$.state": state,
          "address.$.city": city,
          "address.$.zip_code": zip_code,
          "address.$.street_name": street_name,
          "address.$.street_number": street_number,
        },
      },
      { new: true }
    );

    return res.json({
      message: "Address updated.",
      address: addressUpdated.address,
    });
  } catch (error) {
    next(error);
  }
};

const removeAddress = async (req, res, next) => {
  const { isGoogleUser, _id } = req.user;
  let userKey = setUserKey(isGoogleUser);

  try {
    const { address } = await Address.findOneAndUpdate(
      {
        [userKey]: _id,
      },
      {
        $pull: {
          address: { _id: req.params.id },
        },
      },
      { new: true }
    );

    return res.json({ message: "Address removed", address });
  } catch (error) {
    next(error);
  }
};

const setDefault = async (req, res, next) => {
  const { isGoogleUser, _id } = req.user;
  let userKey = setUserKey(isGoogleUser);

  try {
    await Address.findOneAndUpdate(
      {
        [userKey]: _id,
        "address.isDefault": true,
      },
      {
        $set: {
          "address.$.isDefault": false,
        },
      }
    );
    //! VOLVER A VER ¿por qué se hacen dos findOneAndUpdate?
    const { address } = await Address.findOneAndUpdate(
      {
        [userKey]: _id,
        "address._id": req.params.id,
      },
      {
        $set: {
          "address.$.isDefault": true,
        },
      },
      { new: true }
    );

    res.json({ message: "Address selected.", address });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAddress,
  addAddress,
  updateAddress,
  removeAddress,
  setDefault,
};
