'use client';

import React from 'react';

interface AppLogoIconProps {
  className?: string;
}

export const AppLogoIcon: React.FC<AppLogoIconProps> = ({ className = 'w-10 h-10 shrink-0' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id="logoBookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E0F2FE" />
        </linearGradient>
      </defs>

      {/* Background squircle */}
      <rect width="64" height="64" rx="18" fill="url(#logoBgGrad)" />
      <rect
        x="1.5"
        y="1.5"
        width="61"
        height="61"
        rx="16.5"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.5"
      />

      {/* Neural synapses / sparks above the open book */}
      <path
        d="M32 15V23"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.95"
      />
      <circle cx="32" cy="13" r="2.5" fill="#FFFFFF" />

      <path
        d="M22 19L27 24"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx="20" cy="17" r="2" fill="#BAE6FD" />

      <path
        d="M42 19L37 24"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx="44" cy="17" r="2" fill="#BAE6FD" />

      {/* Open Book Pages with subtle depth */}
      <path
        d="M32 25C26 23.5 17 24.5 13 26.5V47.5C17 45.5 26 44.5 32 46.5C38 44.5 47 45.5 51 47.5V26.5C47 24.5 38 23.5 32 25Z"
        fill="url(#logoBookGrad)"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Spine */}
      <path
        d="M32 25V46.5"
        stroke="#0284C7"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Page details (lines) */}
      <path
        d="M18 32C22 31.2 26 31.5 28 32.2"
        stroke="#0284C7"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M18 37C22 36.2 26 36.5 28 37.2"
        stroke="#0284C7"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M46 32C42 31.2 38 31.5 36 32.2"
        stroke="#0284C7"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M46 37C42 36.2 38 36.5 36 37.2"
        stroke="#0284C7"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.65"
      />
    </svg>
  );
};

export default AppLogoIcon;
