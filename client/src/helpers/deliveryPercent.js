export const deliveryPercent = (date, start) => {
    let total = date - start;
    let progress = date - Date.now();
    let percent = Math.floor(100 - (progress * 100) / total);

    let state = "";
    if (percent > 10 && percent <= 30) {
        state = "Dispatching";
    } else if (percent > 30 && percent <= 70) {
        state = "Ready to deliver";
    } else if (percent > 70 && percent < 100) {
        state = "Delivering...";
    } else if (percent >= 100) {
        state = "Delivered!";
    } else {
        state = "Geting your package ready";
    }
    percent > 100 && (percent = 100);

    return { percent, state };
};