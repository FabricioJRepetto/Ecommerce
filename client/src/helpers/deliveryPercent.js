export const deliveryPercent = (date, start) => {
  let total = date - start;
  let progress = date - Date.now();
  let percent = Math.floor(100 - (progress * 100) / total);

  let state = "";
  if (percent > 10 && percent <= 20) {
    state = "Listo para enviar";
  } else if (percent > 20 && percent <= 40) {
    state = "Despachando";
  } else if (percent > 40 && percent < 100) {
    state = "Enviado...";
  } else if (percent >= 100) {
    state = "¡Entregado!";
  } else {
    state = "Preparando tu orden...";
  }
  percent > 100 && (percent = 100);

  return { percent, state };
};
