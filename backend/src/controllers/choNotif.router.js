const { default: axios } = require("axios");
const order = require("../models/order");

// object.charges.data[0].paid: true
// object.charges.data[0].payment_intent: id
// object.status: 'succeeded' 
const notificationStripe = async (req, res, next) => {
    try {
        const { object } = req.body,
            paid = object.charges.data[0].paid,
            id = object.charges.data[0].payment_intent,
            status = object.status;



        if (paid && status === 'succeeded') {
            const newOrder = await order.findOneAndUpdate(
                { payment_intent: id },
                {
                    '$set': {
                        'status': 'approved'
                    }
                })
        };

        res.status(200).send('hola buen dia');
    } catch (error) {
        next(error)
    }
};

const notificationMercadopago = async (req, res, next) => {
    try {
        console.log(req.query);
        const { type, id } = req.query;

        if (type === 'payment') {
            const { data } = await axios(`https://api.mercadopago.com/v1/payments/${id}`);
            console.log('##### MERCADOPAGO');
            console.log(data);
        }

        res.status(200).send('')
    } catch (error) {
        next(error)
    }
};

module.exports = {
    notificationStripe,
    notificationMercadopago
};

/* Notification STRIPE
{
    "object": {
        "id": "pi_3LS8QnCyWZVtXgfr0mN4qMBZ",
            "object": "payment_intent",
                "amount": 15050000,
                    "amount_capturable": 0,
                        "amount_details": {
            "tip": {
            }
        },
        "amount_received": 15050000,
            "application": null,
                "application_fee_amount": null,
                    "automatic_payment_methods": null,
                        "canceled_at": null,
                            "cancellation_reason": null,
                                "capture_method": "automatic",
                                    "charges": {
            "object": "list",
                "data": [{
                    "id": "ch_3LS8QnCyWZVtXgfr0hAyUidh",
                    "object": "charge",
                    "amount": 15050000,
                    "amount_captured": 15050000,
                    "amount_refunded": 0,
                    "application": null,
                    "application_fee": null,
                    "application_fee_amount": null,
                    "balance_transaction": "txn_3LS8QnCyWZVtXgfr0PP15kpa",
                    "billing_details": {
                        "address": {
                            "city": null,
                            "country": "AR",
                            "line1": null,
                            "line2": null,
                            "postal_code": null,
                            "state": null
                        },
                        "email": "test@test.com",
                        "name": "apro",
                        "phone": null
                    },
                    "calculated_statement_descriptor": "PROVIDER ECOMMERCE",
                    "captured": true,
                    "created": 1659406023,
                    "currency": "ars",
                    "customer": "cus_MAVWq9mG56eJGJ",
                    "description": null,
                    "destination": null,
                    "dispute": null,
                    "disputed": false,
                    "failure_balance_transaction": null,
                    "failure_code": null,
                    "failure_message": null,
                    "fraud_details": {},
                    "invoice": null,
                    "livemode": false,
                    "metadata": {},
                    "on_behalf_of": null,
                    "order": null,
                    "outcome": {
                        "network_status": "approved_by_network",
                        "reason": null,
                        "risk_level": "normal",
                        "risk_score": 13,
                        "seller_message": "Payment complete.",
                        "type": "authorized"
                    },
                    "paid": true,
                    "payment_intent": "pi_3LS8QnCyWZVtXgfr0mN4qMBZ",
                    "payment_method": "pm_1LSAVeCyWZVtXgfry9pqvvPM",
                    "payment_method_details": {
                        "card": {
                            "brand": "visa",
                            "checks": {
                                "address_line1_check": null,
                                "address_postal_code_check": null,
                                "cvc_check": "pass"
                            },
                            "country": "US",
                            "exp_month": 11,
                            "exp_year": 2025,
                            "fingerprint": "eI4PDsLEeq10cbo2",
                            "funding": "credit",
                            "installments": null,
                            "last4": "4242",
                            "mandate": null,
                            "network": "visa",
                            "three_d_secure": null,
                            "wallet": null
                        },
                        "type": "card"
                    },
                    "receipt_email": null,
                    "receipt_number": null,
                    "receipt_url": "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTDV6eDRDeVdaVnRYZ2ZyKMmNopcGMgZMOohRANg6LBYO7epMmENNiQXO9xjxCCUMBT1qMWaU4R0dtUWR6mihnXP8M4T7cdD3CJPt",
                    "refunded": false,
                    "refunds": {
                        "object": "list",
                        "data": [],
                        "has_more": false,
                        "total_count": 0,
                        "url": "/v1/charges/ch_3LS8QnCyWZVtXgfr0hAyUidh/refunds"
                    },
                    "review": null,
                    "shipping": null,
                    "source": null,
                    "source_transfer": null,
                    "statement_descriptor": null,
                    "statement_descriptor_suffix": null,
                    "status": "succeeded",
                    "transfer_data": null,
                    "transfer_group": null
                }],
                    "has_more": false,
                        "total_count": 1,
                            "url": "/v1/charges?payment_intent=pi_3LS8QnCyWZVtXgfr0mN4qMBZ"
        },
        "client_secret": "pi_3LS8QnCyWZVtXgfr0mN4qMBZ_secret_0svRAd5xUBlDoWP4bJaamRuDN",
            "confirmation_method": "automatic",
                "created": 1659398033,
                    "currency": "ars",
                        "customer": "cus_MAVWq9mG56eJGJ",
                            "description": null,
                                "invoice": null,
                                    "last_payment_error": null,
                                        "livemode": false,
                                            "metadata": { },
        "next_action": null,
            "on_behalf_of": null,
                "payment_method": "pm_1LSAVeCyWZVtXgfry9pqvvPM",
                    "payment_method_options": {
            "card": {
                "installments": null,
                    "mandate_options": null,
                        "network": null,
                            "request_three_d_secure": "automatic"
            }
        },
        "payment_method_types": [
            "card"
        ],
            "processing": null,
                "receipt_email": null,
                    "review": null,
                        "setup_future_usage": null,
                            "shipping": null,
                                "source": null,
                                    "statement_descriptor": null,
                                        "statement_descriptor_suffix": null,
                                            "status": "succeeded",
                                                "transfer_data": null,
                                                    "transfer_group": null
    }
}
*/