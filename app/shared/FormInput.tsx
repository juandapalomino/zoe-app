import { FC, InputHTMLAttributes } from "react";
import styles from "./FormInput.module.css";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FormInput: FC<Props> = ({ label, id, ...rest }) => (
  <div className={styles.field}>
    <label htmlFor={id}>{label}</label>
    <input id={id} {...rest} />
  </div>
);

export default FormInput;
