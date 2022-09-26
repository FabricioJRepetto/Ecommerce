import { useRef } from "react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";
import CopiableText from "./CopiableText";
import "./FAQ.css";

const FAQ = () => {
  const { question } = useParams();
  const navigate = useNavigate();
  const questionRef = useRef(null);

  const [active, setActive] = useState();

  useEffect(() => {
    setActive(parseInt(question || 0));
    question === "4" &&
      setTimeout(() => {
        scrollTo();
      }, 100);
    // eslint-disable-next-line
  }, [question]);

  const scrollTo = () => {
    if (questionRef.current) {
      questionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  };

  return (
    <div className="faq-outer-container component-fadeIn">
      <div className="profile-section-indicator">FAQs</div>

      <div className="faq-content">
        <div className="faq-section">
          <div className="faq-content">
            <div className="faq-section">
              {typeof active === "number" && (
                <Accordion defaultIndex={[active < 6 ? active : 0]}>
                  <AccordionItem>
                    <h2>
                      <AccordionButton
                        className={`faq-title-btn ${
                          active === 0 && "faq-q-active"
                        }`}
                        onClick={() => setActive(0)}
                      >
                        <Box>¿Qué es Provider?</Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel className="faq-text-container">
                      <div className="faq-ponedordeonda"></div>
                      <b className="provider-text">Provider</b> es un proyecto
                      grupal con el objetivo de crear un e-commerce ficticio
                      completamente funcional. El catálogo se compone de
                      productos creados por nosotros, pero además, hace uso de
                      la API de Mercadolibre para mostrar resultados más amplios
                      a los usuarios.
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem>
                    <h2>
                      <AccordionButton
                        className={`faq-title-btn ${
                          active === 1 && "faq-q-active"
                        }`}
                        onClick={() => setActive(1)}
                      >
                        <Box>¿Qué ofrece?</Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel className="faq-text-container">
                      <div className="faq-ponedordeonda"></div>
                      Puedes crear una cuenta con tu email o iniciar sesión
                      directamente con tu usuario de Google.
                      <br />
                      Las principales características que encontrarás son:
                      <ul>
                        <li>
                          Pasarelas de pago de{" "}
                          <b className="provider-text">Stripe y Mercadopago</b>.{" "}
                          <br />
                          <label
                            htmlFor="accordion-button-:r4:"
                            className="faq-link-to-payment"
                          >
                            <i>Más detalles en esta sección.</i>
                          </label>
                        </li>
                        <li>
                          <b className="provider-text">
                            Notificaciones vía e-mail
                          </b>{" "}
                          de los eventos más importantes en tu cuenta, como
                          cambios de contraseña o resúmenes de compra.
                        </li>
                        <li>
                          <b className="provider-text">Ofertas flash</b>, una
                          selección de nuestros productos con descuentos
                          especiales que se renuevan cada 24 horas.
                        </li>
                        <li>
                          <b className="provider-text">Recomendaciones</b>{" "}
                          basadas en los últimos productos que visitaste.
                        </li>
                        <li>
                          Búsqueda basada en las{" "}
                          <b className="provider-text">categorías</b>{" "}
                          principales. Estas muestran una combinación entre
                          productos propios y productos de Mercadolibre.
                        </li>
                        <li>
                          <b className="provider-text">Buscador de ofertas</b>{" "}
                          que recopila ofertas propias y de Mercadolibre en un
                          solo lugar.
                        </li>
                        <li>
                          La posibilidad de dejar <b className="provider-text">reseñas</b>{" "} 
                          en los productos que has comprado. Estas afectan y 
                          modifican la calificación general del producto.
                        </li>
                        <li>
                          <b className="provider-text">Ventas</b>{" "} #Sección en construcción#
                        </li>
                      </ul>
                      En <b>Provider Store</b> podrás navegar solo entre
                      nuestros productos (dejando de lado los de Mercadolibre).
                      <br />
                      <b>Provider Premium</b> ofrece una pequeña selección de
                      productos, que por A o por B, consideramos lo
                      suficientemente especiales como para dedicarle un diseño
                      especial a cada uno.
                      <br />
                      <br />
                      En el perfil, además de poder ver y editar los detalles de
                      tu cuenta vas a encontrar:
                      <ul>
                        <li>
                          Una lista de tus productos{" "}
                          <b className="provider-text">favoritos.</b>
                        </li>
                        <li>
                          Un <b className="provider-text">historial</b> que
                          muestra los últimos productos que visitaste.
                        </li>
                        <li>
                          Una lista de las{" "}
                          <b className="provider-text">compras</b> que hayas
                          hecho y todos sus detalles.
                        </li>
                      </ul>
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem>
                    <h2>
                      <AccordionButton
                        className={`faq-title-btn ${
                          active === 2 && "faq-q-active"
                        }`}
                        onClick={() => setActive(2)}
                      >
                        <Box>¿Cómo se desarrolló?</Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel className="faq-text-container">
                      <div className="faq-ponedordeonda"></div>
                      Para todo lo que estás viendo ahora usamos{" "}
                      <b className="provider-text">React.js</b>,{" "}
                      <b className="provider-text">Redux</b> y mucha{" "}
                      <b className="provider-text">imaginación</b>.<br />
                      Para todo lo que está detrás del telón usamos{" "}
                      <b className="provider-text">Node.js</b>,{" "}
                      <b className="provider-text">Express</b>,{" "}
                      <b className="provider-text">MongoDB</b> y mucho{" "}
                      <b className="provider-text">esfuerzo...</b>
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem>
                    <h2>
                      <AccordionButton
                        className={`faq-title-btn ${
                          active === 3 && "faq-q-active"
                        }`}
                        onClick={() => setActive(3)}
                      >
                        <Box>¿Quién lo desarrolló?</Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel className="faq-text-container">
                      <div className="faq-ponedordeonda"></div>
                      <b
                        className="provider-text faq-link-to-about"
                        onClick={() => navigate("/about")}
                      >
                        Nosotros dos.
                      </b>
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem ref={questionRef}>
                    <h2>
                      <AccordionButton
                        className={`faq-title-btn ${
                          active === 4 && "faq-q-active"
                        }`}
                        onClick={() => setActive(4)}
                      >
                        <Box>¿Cómo realizo un pago?</Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel className="faq-text-container">
                      <div className="faq-ponedordeonda"></div>
                      Todas las transacciones en Provider están en{" "}
                      <b className="provider-text">modo prueba</b>, se simula el
                      pago en la plataforma que selecciones (Stripe o
                      Mercadopago). Para esto, es necesario introducir los datos
                      correspondientes en la pasarela de pagos que desees
                      utilizar.
                      <div className="faq-checkouts">
                        <div>
                          <div className="faq-logo">
                            <img
                              src="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663894003/Stripe_Logo-2_otuyhn.png"
                              alt="stripe logo"
                            />
                          </div>
                          <div>
                            <ul>
                              <li>
                                Número de tarjeta:
                                <br />
                                <CopiableText text={"4242 4242 4242 4242"} />
                              </li>
                              <li>
                                Fecha de expiración:
                                <br />
                                <b>Cualquier fecha mayor a la actual</b>
                              </li>
                              <li>
                                cvc:
                                <br />
                                <CopiableText text={"123"} />
                              </li>
                              <li>
                                E-mail:
                                <br />
                                <b>Cualquiera</b>
                              </li>
                              <li>
                                Nombre:
                                <br />
                                <b>Cualquiera</b>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div>
                          <div className="faq-logo">
                            <img
                              src="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663894003/Mercadopago_Logo-2_anidpy.png"
                              alt="Mercadopago logo"
                            />
                          </div>
                          <div>
                            <ul>
                              <li>
                                Número de tarjeta:
                                <br />
                                <CopiableText text={"5416 7526 0258 2580"} />
                              </li>
                              <li>
                                Fecha de expiración:
                                <br />
                                <CopiableText text={"11/25"} />
                              </li>
                              <li>
                                cvc:
                                <br />
                                <CopiableText text={"123"} />
                              </li>
                              <li>
                                Nombre:
                                <br />
                                <CopiableText text={"APRO"} />
                              </li>
                              <li>
                                dni:
                                <br />
                                <CopiableText text={"12345678"} />
                              </li>
                              <li>
                                E-mail:
                                <br />
                                <b>Cualquier email argentino (importante)</b>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </AccordionPanel>
                  </AccordionItem>

                  {/* <AccordionItem>
                    <h2>
                      <AccordionButton
                        className={`faq-title-btn ${
                          active === 5 && "faq-q-active"
                        }`}
                        onClick={() => setActive(5)}
                      >
                        <Box>¿Qué Random no?</Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel className="faq-text-container">
                      <div className="faq-ponedordeonda"></div>
                      Sí, diría que sí.
                    </AccordionPanel>
                  </AccordionItem> */}
                </Accordion>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
