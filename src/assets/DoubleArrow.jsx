
import React from 'react'

const DoubleArrow = ({ size = 20, color = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="7 4 13 12 7 20" />
    <polyline points="13 4 19 12 13 20" />
  </svg>
);

export default DoubleArrow;