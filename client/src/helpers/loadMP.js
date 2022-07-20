import { MP_PKEY } from '../constants';

export const loadMercadoPago = (preferenceId, stopSpinner) => {
    try {
        const handleScriptLoad = () => {
            const mp = new window.MercadoPago(MP_PKEY, {
                locale: 'es-AR'
            });
            mp.checkout({
                preference: {
                    id: preferenceId
                },
                autoOpen: true
            });
        };

        const loadScript = (url) => {
            let script = document.createElement('script');
            script.type = 'text/javascript';

            if (script.readyState) {
                script.onreadystatechange = () => {
                    if (
                        script.readyState === 'loaded' ||
                        script.readyState === 'complete'
                    ) {
                        script.onreadystatechange = null;
                        handleScriptLoad();
                    }
                };
            } else {
                script.onload = () => handleScriptLoad();
            }
            script.src = url;
            document.getElementById('checkout-container').appendChild(script);
        };

        loadScript('https://sdk.mercadopago.com/js/v2');
        stopSpinner(false);
    } catch (error) {
        console.error(error);
        stopSpinner(false);
    }
};