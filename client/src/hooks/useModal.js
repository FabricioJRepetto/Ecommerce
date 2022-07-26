import { useState } from "react";

export const useModal = (initialValue = false) => {
    const [isOpen, setIsOpen] = useState(initialValue);
    const [prop, setProp] = useState(null)
    const openModal = (prop) => {
        setIsOpen(true);
        prop ? setProp(prop) : setProp(false);
    };
    const closeModal = () => setIsOpen(false);

    return [isOpen, openModal, closeModal, prop];
};
