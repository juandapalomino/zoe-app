import { FC, ReactNode } from "react";
import styles from "./Modal.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const Modal: FC<Props> = ({ isOpen, onClose, title, children }) => {
  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.isVisible : ""}`}
      onClick={onClose}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {title && <div className={styles.header}>{title}</div>}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
