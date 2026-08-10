import React from "react";

export const Button = ({
    children,
    className = "",
    onClick,
    type = "button",
    ...rest
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`px-4 py-2 rounded transition duration-150 font-medium ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
