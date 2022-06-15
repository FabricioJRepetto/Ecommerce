const Address = require('../models/Address');

const getAddress = async (req, res, next) => { 
    try {
        const address = await Address.findOne({ user: req.user._id })
        if (address) return res.json(address);            
        return res.json({message: 'No address found'});
    } catch (error) {
        next(error);
    }
 };
 
const addAddress = async (req, res, next) => { 
    try {
        // const {
        //     state, 
        //     city, 
        //     zip_code, 
        //     street_name, 
        //     street_number } = req.body;

        const add = await Address.findOne({
            user: req.user._id 
        });

        if (add) {
            add.address.push(req.body);
            await add.save();

            return res.json({message: 'New address registered.'});
        } else {
            const newAdd = new Address({
                address: [req.body],
                user: req.user._id
            });
            await newAdd.save();
            return res.json({message: 'Address registered.'});
        };
    } catch (error) {
        next(error);
    }
 };

const updateAddress = async (req, res, next) => { 
    try {
        // params.id
        // user._id
        // body
        const target = req.params.id

        await Address.findOneAndUpdate({
            'user': req.user._id,
            'address.id': target
        }, 
            req.body,
            {new: true}
        );
        
        return res.status(200);
    } catch (error) {
        next(error);
    }
 };

const removeAddress = async (req, res, next) => { 
    try {
        const target = req.params.id

        const removed = await Address.updateOne({ 
            'user': req.user._id 
        },
        {
            $pull: {
                'address': {'_id': target}
            }
        }
        );
        
        return res.json(removed);
    } catch (error) {
        next(error);
    }
 };

module.exports = {
    getAddress,
    addAddress,
    updateAddress,
    removeAddress,
}