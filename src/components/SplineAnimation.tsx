import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

function SplineAnimation() {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0">
      <spline-viewer 
        url="https://prod.spline.design/Dta7Wufq-v3-SWID/scene.splinecode"
        className="w-full h-full"
      />
    </div>
  );
}

export default SplineAnimation;