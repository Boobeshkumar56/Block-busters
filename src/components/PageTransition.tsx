
import React, { ReactNode, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Reset animation on route change
    const page = pageRef.current;
    if (page) {
      page.style.opacity = "0";
      page.style.transform = "translateY(10px)";
      
      setTimeout(() => {
        page.style.opacity = "1";
        page.style.transform = "translateY(0)";
      }, 10);
    }
    
    // Find and animate staggered items
    const animateStaggeredItems = () => {
      if (!page) return;
      
      const items = page.querySelectorAll('.staggered-item');
      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('animate');
        }, 100 + (index * 50));
      });
    };
    
    setTimeout(animateStaggeredItems, 300);
  }, [location.pathname]);
  
  return (
    <div 
      ref={pageRef}
      className="page-transition-wrapper w-full min-h-screen"
      style={{
        opacity: 0,
        transform: "translateY(10px)",
        transition: "opacity 0.4s ease, transform 0.4s ease"
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
