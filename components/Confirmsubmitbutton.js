// components/ConfirmSubmitButton.js
"use client";

export default function ConfirmSubmitButton({
  children,
  message = "Are you sure?",
  className = "era-button",
  style
}) {
  return (
    <button
      type="submit"
      className={className}
      style={style}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}