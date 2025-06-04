/**
 * @file LoadingIndicator.jsx
 * @description A simple reusable loading indicator component using Bootstrap spinner.
 */
import React from 'react';

/**
 * A simple loading indicator component using Bootstrap spinner.
 * @param {object} props - The component props.
 * @param {string} [props.text="Caricamento..."] - Optional text to display below the spinner.
 * @param {'sm'|'md'} [props.size="md"] - Optional size for the spinner. 'md' is default Bootstrap spinner size. 'sm' for spinner-border-sm.
 *                                       Note: Bootstrap spinners don't have direct 'lg' class for spinner-border, only for spinner-grow.
 * @param {string} [props.textColor="text-primary"] - Color of the spinner. Defaults to primary.
 * @param {string} [props.className] - Additional class names for the container div.
 * @returns {JSX.Element} The LoadingIndicator component.
 */
export default function LoadingIndicator({ text = "Caricamento...", size = "md", textColor = "text-primary", className = "" }) {
  const spinnerSizeClass = size === 'sm' ? 'spinner-border-sm' : '';

  return (
    <div className={`text-center p-4 ${className}`}>
      <div className={`spinner-border ${textColor} ${spinnerSizeClass}`} role="status">
        <span className="visually-hidden">{text || 'Loading...'}</span> {/* Ensure visually-hidden always has content */}
      </div>
      {text && <p className="mt-2">{text}</p>}
    </div>
  );
}
