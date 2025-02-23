import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, type = "button", className, disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700 transition 
        ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
