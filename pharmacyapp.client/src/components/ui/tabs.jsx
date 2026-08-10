import React, { useState } from 'react';

export const Tabs = ({ defaultValue, children, className }) => {
    const [active, setActive] = useState(defaultValue);

    return (
        <div className={className}>
            {React.Children.map(children, child => {
                if (child.type.displayName === "TabsList") {
                    return React.cloneElement(child, { active, setActive });
                }
                if (child.type.displayName === "TabsContent") {
                    return child.props.value === active ? child : null;
                }
                return child;
            })}
        </div>
    );
};

export const TabsList = ({ children, active, setActive, className }) => (
    <div className={className}>
        {React.Children.map(children, child =>
            React.cloneElement(child, { active, setActive })
        )}
    </div>
);

export const TabsTrigger = ({ children, value, active, setActive }) => (
    <button
        className={`px-4 py-2s border ${active === value ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        onClick={() => setActive(value)}
    >
        {children}
    </button>
);

export const TabsContent = ({ children }) => <div>{children}</div>;

Tabs.displayName = "Tabs";
TabsList.displayName = "TabsList";
TabsTrigger.displayName = "TabsTrigger";
TabsContent.displayName = "TabsContent";

