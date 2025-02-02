import React from "react";

function TextBox({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Enter your issue..."
      value={value}
      onChange={onChange}
    />
  );
}

export default TextBox;