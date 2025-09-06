import styles from "../styles/components/Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export default function Button({ 
  variant = "primary", 
  size = "md",
  loading = false,
  children, 
  disabled,
  ...props 
}: ButtonProps) {
  return (
    <button 
      {...props} 
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${loading ? styles.loading : ''}`}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading && (
        <span className={styles.spinner} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2v4m0 12v4m8-8h-4M8 12H4m15.364 6.364l-2.828-2.828M8.464 8.464L5.636 5.636m12.728 0l-2.828 2.828m-8.486 8.486l-2.828 2.828" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </span>
      )}
      <span className={styles.content}>{children}</span>
    </button>
  );
}