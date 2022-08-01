const checkoutNotif = (req, res, next) => {
    try {
        console.log(req.body);
        res.status(200).send('hola buen dia')
    } catch (error) {
        next(error)
    }
};