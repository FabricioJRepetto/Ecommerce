import { MP_PKEY } from '../constants'

export const redirectToMercadoPago = (preferenceId) => {
  const handleScriptLoad = () => {
    const mp = new window.MercadoPago(MP_PKEY, {
      locale: 'es-AR'
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
};