import React from "react";

export const Input = ({ className = "", ...props }) => {
    return (
        <input
            className={`border rounded px-3 py-2 focus:outline-none ${className}`}
            {...props}
        />
    );
};
