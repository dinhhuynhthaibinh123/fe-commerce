import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";

export const StoreModal = () => {
    const storeModal = useStoreModal();

    return (
        <Modal
            title="Create Store"
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
            description="Add a new store to manage products and categories."
        >
            Create Store Modal
        </Modal>
    );
};
