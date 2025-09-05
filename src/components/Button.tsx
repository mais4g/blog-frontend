import styles from "../styles/components/Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  children: React.ReactNode;
}

export default function Button({ variant = "primary", children, ...props }: ButtonProps) {
  return (
    <button {...props} className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  );
}