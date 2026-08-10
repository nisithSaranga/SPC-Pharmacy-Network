import React from 'react';

export const Card = ({ children, className }) => (
    <div className={`border rounded-lg shadow bg-white ${className}`}>
        {children}
    </div>
);

export const CardHeader = ({ children }) => (
    <div className="border-b p-4">{children}</div>
);

export const CardContent = ({ children, className }) => (
    <div className={`p-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children }) => (
    <h2 className="text-lg font-bold">{children}</h2>
);

export const CardDescription = ({ children }) => (
    <p className="text-sm text-gray-600">{children}</p>
);

