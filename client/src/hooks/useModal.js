import { useState } from "react";

export const useModal = (initialValue = false) => {
    const [isOpen, setIsOpen] = useState(initialValue);
    const [prop, setProp] = useState()
    const openModal = (prop) => {
        setIsOpen(true);
        setProp(prop);
    };
    const closeModal = () => setIsOpen(false);

  return [isOpen, openModal, closeModal, prop];
};
