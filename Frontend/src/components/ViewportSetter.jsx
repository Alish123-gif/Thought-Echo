"use client";

import { useEffect } from 'react';

export default function ViewportSetter() {
  useEffect(() => {
    // Find the existing viewport meta tag
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    
    // If no viewport meta tag exists, create one
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    
    // Set the desired viewport content
    viewportMeta.content = 'width=device-width, initial-scale=0.80, minimum-scale=0.80, maximum-scale=5.0';
    
    // This effect should run only once
  }, []);
  
  return null; // This component doesn't render anything
}
