import React, { FC, ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "neutral" | "inline";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
}

const Button: FC<Props> = ({
  type = "button",
  variant = "primary",
  icon,
  iconPosition = "left", // Default to 'left'
  children,
  className = "",
  ...rest
}) => {
  const iconElement = icon && <span className={styles.icon}>{icon}</span>;

  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${
        styles[`icon-${iconPosition}`]
      } ${className}`}
      {...rest}
    >
      {iconPosition === "left" && iconElement}
      {children}
      {iconPosition === "right" && iconElement}
    </button>
  );
};

export default Button;
