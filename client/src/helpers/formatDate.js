export const formatDate = (d) => {
    if (d === undefined) {
        return "fecha invalida";
    }
    if (typeof d === "string") {
        return d.toString().slice(0, -13).replace("T", " ");
    } else {
        return new Date(d).toLocaleDateString("es-AR", {
            weekday: "long",
            month: "long",
            day: "numeric",
        });
    }
};
