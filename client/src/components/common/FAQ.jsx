import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'
import './FAQ.css'

const FAQ = () => {
    const {question} = useParams();
    const navigate = useNavigate()

    const [active, setActive] = useState()

    useEffect(() => {
      setActive(parseInt(question || 0))
      // eslint-disable-next-line
    }, [question])

    const copyToClipboard = (str) => {
        if (navigator && navigator.clipboard && navigator.clipboard.writeText)
            return navigator.clipboard.writeText(str);
        return Promise.reject('The Clipboard API is not available.');
    };
    
  return (
    <div className='faq-outer-container component-fadeIn'>

        <div className='profile-section-indicator'>FAQs</div>

        <div className='faq-content'>
            <div className='faq-section'>
                <div className='faq-content'>
                    <div className='faq-section'>
                        {typeof active === 'number' && <Accordion defaultIndex={[active]}>

                            <AccordionItem>
                                <h2>
                                    <AccordionButton className={`faq-title-btn ${active === 0 && 'faq-q-active'}`} 
                                        onClick={() => setActive(0)}>
                                        <Box>
                                            ¿Qué es Provider?
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel className='faq-text-container'>
                                    <div className='faq-ponedordeonda'></div>
                                    <b className='provider-text'>Provider</b> es un proyecto grupal con el objetivo de crear un e-commerce ficticio completamente funcional. El catálogo se compone de productos creados por nosotros, pero además, hace uso de la API de Mercadolibre para mostrar resultados más amplios a los usuarios.                        
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem>
                                <h2>
                                    <AccordionButton className={`faq-title-btn ${active === 1 && 'faq-q-active'}`} 
                                        onClick={() => setActive(1)}>
                                        <Box>
                                            ¿Qué ofrece?
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel className='faq-text-container'>
                                    <div className='faq-ponedordeonda'></div>
                                    Puedes crear cuenta con tu email o iniciar sesión directamente con tu usuario de Google.<br/>
                                    Las principales características que encontrarás son:
                                        <ul>
                                            <li>Pasarelas de pago de <b className='provider-text'>Stripe y Mercadopago</b>. <br/>
                                            <label htmlFor='accordion-button-:r4:' className='faq-link-to-payment'><i>Más detalles en esta sección.</i></label>
                                            </li>
                                            <li>Las <b className='provider-text'><i>ofertas flash</i></b>, una selección de nuestros productos con descuentos especiales y que rotan cada 24 horas.</li>
                                            <li><b className='provider-text'>Recomendaciones</b> basadas en los ultimos productos que visitaste.</li>
                                            <li>Búsqueda basada en las <b className='provider-text'>categorías</b> principales. Estas muestran una combinación entre productos propios y productos de Mercadolibre.</li>
                                            <li>El <b className='provider-text'>buscador de ofertas</b>, que recopila ofertas propias y de Mercadolibre en un solo lugar.</li>
                                        </ul>
                                    En <b>Provider Store</b> podrás navegar entre nuestros productos exclusivamente (dejando de lado los de Mercadolibre).<br/> 
                                    <b>Provider Premium</b> ofrece una pequeña selección de productos, que por A o por B, consideramos lo suficientemente especiales como para dedicarle un diseño especial a cada uno.<br/><br/>
                                    
                                    En el perfil, además de poder ver y editar los detalles de tu cuenta y vas a encontrar:
                                        <ul>
                                            <li>Una lista de tus productos <b className='provider-text'>favoritos.</b></li>
                                            <li>Un <b className='provider-text'>historial</b> que muestra los ultimos productos que visitaste.</li>
                                            <li>Una lista de las <b className='provider-text'>compras</b> que hayas hecho y todos sus detalles.</li>
                                        </ul>
                                    
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem>
                                <h2>
                                    <AccordionButton className={`faq-title-btn ${active === 2 && 'faq-q-active'}`} 
                                        onClick={() => setActive(2)}>
                                        <Box>
                                            ¿Cómo se desarrolló?
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel className='faq-text-container'>
                                    <div className='faq-ponedordeonda'></div>
                                    Para todo lo que estás viendo ahora usamos <b className='provider-text'>React.js</b>, <b className='provider-text'>Redux</b> y mucha <b className='provider-text'>imaginación</b>.<br/>
                                    Para todo lo que está detrás del telón usamos <b className='provider-text'>Node.js</b>, <b className='provider-text'>Express</b>, <b className='provider-text'>MongoDB</b> y mucho <b className='provider-text'>esfuerzo...</b>
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem>
                                <h2>
                                    <AccordionButton className={`faq-title-btn ${active === 3 && 'faq-q-active'}`} 
                                        onClick={() => setActive(3)}>
                                        <Box>
                                            ¿Quién lo desarrolló?
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel className='faq-text-container'>
                                    <div className='faq-ponedordeonda'></div>
                                    <b className='provider-text faq-link-to-about' onClick={() => navigate('/about')}>Nosotros dos.</b>
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem>
                                <h2>
                                    <AccordionButton className={`faq-title-btn ${active === 4 && 'faq-q-active'}`} 
                                        onClick={() => setActive(4)}>
                                        <Box>
                                            ¿Cómo realizo un pago?
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel className='faq-text-container'>
                                    <div className='faq-ponedordeonda'></div>
                                    Todas las transacciones en Provider están en <b className='provider-text'>modo prueba</b>, solo se simula el pago en la plataforma que selecciones (Stripe o Mercadopago). Para esto, es necesario introducir los datos correspondientes a la pasarela de pagos que desees utilizar.

                                    <div className='faq-checkouts'>
                                        <div>
                                            <div className='faq-logo'>
                                                <img src="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663894003/Stripe_Logo-2_otuyhn.png" alt="stripe logo" />
                                            </div>
                                            <div>
                                                <ul>
                                                    <li>
                                                        Número de tarjeta:<br/>
                                                        <b className='copiable' onClick={()=>copyToClipboard('4242 4242 4242 4242')}>4242 4242 4242 4242</b>
                                                    </li>
                                                    <li>
                                                        Fecha de expiración:<br/><b>Cualquier fecha mayor a la actual</b>
                                                    </li>
                                                    <li>
                                                        cvc:<br/><b className='copiable' onClick={()=>copyToClipboard('123')}>123</b>
                                                    </li>
                                                    <li>
                                                        E-mail:<br/><b>Cualquiera</b>
                                                    </li>
                                                    <li>
                                                        Nombre:<br/><b>Cualquiera</b>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div>
                                            <div className='faq-logo'>
                                                <img src="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663894003/Mercadopago_Logo-2_anidpy.png" alt="Mercadopago logo" />
                                            </div>
                                            <div>
                                                <ul>
                                                    <li>
                                                        Número de tarjeta:<br/>
                                                        <b className='copiable' onClick={()=>copyToClipboard('5416 7526 0258 2580')}>5416 7526 0258 2580</b>
                                                    </li>
                                                    <li>
                                                        Fecha de expiración:<br/>
                                                        <b className='copiable' onClick={()=>copyToClipboard('11/25')}>11/25</b>
                                                    </li>
                                                    <li>
                                                        cvc:<br/><b className='copiable' onClick={()=>copyToClipboard('123')}>123</b>
                                                    </li>
                                                    <li>
                                                        Nombre:<br/><b className='copiable' onClick={()=>copyToClipboard('APRO')}>APRO</b>
                                                    </li>
                                                    <li>
                                                        dni:<br/><b className='copiable' onClick={()=>copyToClipboard('12345678')}>12345678</b>
                                                    </li>
                                                    <li>
                                                        E-mail:<br/><b>Cualquier email argentino (importante)</b>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem>
                                <h2>
                                    <AccordionButton className={`faq-title-btn ${active === 5 && 'faq-q-active'}`} 
                                        onClick={() => setActive(5)}>
                                        <Box>
                                            ¿Qué Random no?
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel className='faq-text-container'>
                                    <div className='faq-ponedordeonda'></div>
                                    Sí, diría que sí.
                                </AccordionPanel>
                            </AccordionItem>

                        </Accordion>}
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}

export default FAQ