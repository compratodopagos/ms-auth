import { Card, Button, Modal } from '@compratodo/ui-components';

// components/TermItem.tsx
export const TermItem = ({
    term,
    checked,
    onToggle,
    onOpenModal,
    isModalOpen,
}: {
    term: { id: string; label: string; component: React.ReactNode };
    checked: boolean;
    onToggle: () => void;
    onOpenModal: () => void;
    isModalOpen: boolean;
}) => (
    <Card title="" className="grid-3 terms mb-2">
        <div className="flex items-center check">
            <input
                type="checkbox"
                id={`term-${term.id}`}
                checked={checked}
                onChange={onToggle}
            />
        </div>

        <label className="flex items-center label" htmlFor={`term-${term.id}`}>
            <p className="ml-2 mr-2">{term.label}</p>
        </label>

        <Button type="button" variant="accent" onClick={onOpenModal}>
            <b>Consultar</b>
        </Button>

        <Modal
            title=""
            isOpen={isModalOpen}
            size="small"
            onClose={onOpenModal}
        >
            {term.component}
        </Modal>
    </Card>
);