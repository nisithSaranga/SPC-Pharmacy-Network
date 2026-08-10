import React from "react";

export const Label = ({ children, className = "", htmlFor }) => {
    return (
        <label htmlFor={htmlFor} className={`block mb-1 font-medium ${className}`}>
            {children}
        </label>
    );
};
