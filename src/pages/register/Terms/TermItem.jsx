import styles from './TermItem.module.css';
import { Card, Button, Modal } from '@compratodo/ui-components';

// components/TermItem.tsx
export const TermItem = ({
    term,
    checked,
    onToggle,
    onOpenModal,
    isModalOpen,
}) => (
    <Card title="" className={`grid-3 ${styles.terms} mb-2`}>
        <div className={`flex items-center ${styles.check}`}>
            <input
                className={styles.checkbox}
                type="checkbox"
                id={`term-${term.id}`}
                checked={checked}
                onChange={onToggle}
            />
        </div>

        <label className={`flex items-center ${styles.label}`} htmlFor={`term-${term.id}`}>
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
            btnClassName="p-2 sm:p-3 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-[#d0f3ff] rounded-full text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-colors text-sm flex-shrink-0"
        >
            {term.component}
        </Modal>
    </Card>
);