import { useState, useCallback } from "react";

export type ModalType = string | null;

export function useModal(initialState: ModalType = null) {
    const [activeModal, setActiveModal] = useState<ModalType>(initialState);

    const openModal = useCallback((modalType: string) => {
        setActiveModal(modalType);
    }, []);

    const closeModal = useCallback(() => {
        setActiveModal(null);
    }, []);

    const isOpen = useCallback((modalType: string) => {
        return activeModal === modalType;
    }, [activeModal]);

    return {
        activeModal,
        openModal,
        closeModal,
        isOpen,
    };
}
