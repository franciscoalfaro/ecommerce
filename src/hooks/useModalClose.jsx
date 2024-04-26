import { useEffect } from 'react';

const useModalClose = () => {
    const closeModal = () => {
        const modal = document.querySelector("#exampleModal");
        if (modal) {
            modal.classList.remove("show");
            modal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("modal-open");
            const backdrop = document.querySelector(".modal-backdrop");
            if (backdrop) {
                document.body.removeChild(backdrop);
            }
        }
    };

    useEffect(() => {
        closeModal(); // Cierra el modal cuando el componente se monta
    }, []); // Se ejecuta solo una vez al montar el componente

    return closeModal;
};

export default useModalClose;
