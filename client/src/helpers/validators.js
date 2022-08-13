import * as yup from "yup";

export const validatePrice = (value) => {
  if (value === undefined) return false;
  return /^\d+(.\d{1,2})?$/.test(value);
};

export const validateNumbers = (value) => {
  if (value === undefined) return false;
  return /^[0-9]*$/.test(value);
};

export const validateImgs = (imagesList, warnTimer, productImg) => {
  const fileTypesAllowed = ["image/jpeg", "image/png"];
  let warnFlagFormat = false;
  let warnFlagExcess = false;
  let warnFlagSize = false;

  for (const image of imagesList) {
    console.log(image.size);
  }

  for (let i = 0; i < imagesList.length; i++) {
    if (!fileTypesAllowed.includes(imagesList[i].type)) {
      warnFlagFormat = true;
      imagesList.splice(i, 1);
      i--;
    } else if (imagesList[i].size > 10526315) {
      warnFlagSize = true;
      imagesList.splice(i, 1);
      i--;
    }
  }
  if (productImg?.length + imagesList?.length > 8) {
    let excess = productImg?.length + imagesList?.length - 8;
    warnFlagExcess = true;
    imagesList.splice(-excess, excess);
  }
  if (warnFlagExcess || warnFlagFormat || warnFlagSize) {
    warnTimer(
      "image",
      `${
        warnFlagFormat &&
        "Formato no soportado. Seleccione imagenes .jpg .jpeg o .png"
      }
      ${
        warnFlagFormat && warnFlagExcess && `\n`
      } //! VOLVER A VER meter salto de linea
      ${warnFlagExcess && "Se permiten 8 imágenes como máximo"}
      ${
        warnFlagExcess && warnFlagSize && `\n`
      } //! VOLVER A VER meter salto de linea
      ${
        warnFlagFormat && warnFlagSize && !warnFlagExcess && `\n`
      } //! VOLVER A VER meter salto de linea
      ${warnFlagSize && "Las imágenes deben pesar menos de 10mb"}`
    );
  }
};

export const validationProductFormSchema = yup.object().shape({
  name: yup
    .string()
    .required("Ingresa el título")
    .min(5, "Se admite como mínimo 5 caracteres")
    .max(25, "Se admite como máximo 25 caracteres"),
  price: yup
    .string()
    .required("Ingresa el precio")
    .max(15, "El precio debe tener como máximo 15 dígitos")
    .test(
      "price",
      "El precio debe ser un número válido (ej: '1234.56')",
      (value) => validatePrice(value)
    ),
  brand: yup
    .string()
    .required("Ingresa la marca")
    .max(20, "Se admite como máximo 20 caracteres"),
  available_quantity: yup
    .string()
    .required("Ingresa el stock")
    .max(4, "El stock debe ser un número menor a 10000")
    .test("stock", "El stock debe ser un número", (value) =>
      validateNumbers(value)
    ),
  description: yup
    .string()
    .required("Ingresa la descripción")
    .max(500, "La descripción admite hasta 500 caracteres"),
  main_features: yup.array().of(
    yup.object().shape({
      value: yup
        .string()
        .required("Ingresa las características principales")
        .max(20, "Se admite como máximo 20 caracteres"),
    })
  ),
  attributes: yup.array().of(
    yup.object().shape({
      name: yup
        .string()
        .required("Ingresa el nombre del atributo")
        .max(20, "Se admite como máximo 20 caracteres"),
      value_name: yup
        .string()
        .required("Ingresa la descripción del atributo")
        .max(20, "Se admite como máximo 20 caracteres"),
    })
  ),
  free_shipping: yup
    .bool('El tipo de envío solo acepta "true" o "false" como valor')
    .required("Selecciona el tipo de envío"),
});
