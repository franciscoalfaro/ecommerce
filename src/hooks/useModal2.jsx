import { useEffect } from 'react';

const useModal2 = () => {
    const closeModal2 = () => {
        const modal = document.querySelector("#exampleModal2");
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
        closeModal2(); // Cierra el modal cuando el componente se monta
    }, []); // Se ejecuta solo una vez al montar el componente

    return closeModal2;
};

export default useModal2;
