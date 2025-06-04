/**
 * @file AlertMessage.jsx
 * @description A reusable component to display Bootstrap alert messages.
 */
import React from 'react';

/**
 * Displays a Bootstrap alert message.
 * @param {object} props - The component props.
 * @param {"primary"|"secondary"|"success"|"danger"|"warning"|"info"|"light"|"dark"} [props.type="info"] - The type of alert, corresponding to Bootstrap alert classes.
 * @param {string} props.message - The message to display within the alert. If empty or null, the component renders nothing.
 * @param {string} [props.className=""] - Additional class names to apply to the alert div for custom styling.
 * @param {React.ReactNode} [props.children] - Optional children to render inside the alert, e.g., for more complex content.
 * @returns {JSX.Element|null} The AlertMessage component, or null if no message is provided.
 */
export default function AlertMessage({ type = "info", message, className = "", children }) {
  if (!message && !children) {
    return null; // Don't render if there's no message and no children
  }

  return (
    <div className={`alert alert-${type} ${className}`} role="alert">
      {message}
      {children && <div className="mt-2">{children}</div>} {/* Render children below message if provided */}
    </div>
  );
}
