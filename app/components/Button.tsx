"use client";
import { FC, PropsWithChildren } from "react";

interface ButtonProps {
    onClick?: () => void;
}
const Button: FC<PropsWithChildren<ButtonProps>> = ({ onClick, children }) => {
    return (
        <button
            onClick={onClick}
            className="bg-opacity-40 bg-white rounded-full px-4 py-2"
        >
            {children}
        </button>
    );
};

export default Button;
