const Address = require("../models/Address");

const getAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({ user: req.user._id });
    if (!address) return res.json({ message: "No address found" });
    return res.json(address);
  } catch (error) {
    next(error);
  }
};

const addAddress = async (req, res, next) => {
  try {
    const addressFound = await Address.findOne({
      user: req.user._id,
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
      const newAdd = new Address({
        address: [{ ...req.body, isDefault: true }],
        user: req.user._id,
      });
      await newAdd.save();
      return res.json({
        message: "New address registered.",
        newAdd: addressFound.address, //! VOLVER A VER tira error al agregar la primer address Cannot read properties of null (reading 'address'). Se soluciona con newAdd: [req.body], pero no renderiza la address agregada
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const { state, city, zip_code, street_name, street_number } = req.body;

    const updated = await Address.findOneAndUpdate(
      {
        user: req.user._id,
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
    return res.json({ message: "Address updated.", address: updated.address });
  } catch (error) {
    next(error);
  }
};

const removeAddress = async (req, res, next) => {
  try {
    const { address } = await Address.findOneAndUpdate(
      {
        user: req.user._id,
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
  try {
    await Address.findOneAndUpdate(
      {
        user: req.user._id,
        "address.isDefault": true,
      },
      {
        $set: {
          "address.$.isDefault": false,
        },
      }
    );

    const { address } = await Address.findOneAndUpdate(
      {
        user: req.user._id,
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
