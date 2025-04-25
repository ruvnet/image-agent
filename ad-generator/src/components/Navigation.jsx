import { useEffect } from 'react';

const Navigation = ({ isOpen, onClose }) => {
  // Close menu when ESC key is pressed
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <nav className={`navigation ${isOpen ? 'open' : ''}`}>
      <div className="navigation-backdrop" onClick={onClose}></div>
      <div className="navigation-content">
        <div className="navigation-header">
          <h2>Menu</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>
        <ul className="navigation-menu">
          <li><a href="#" onClick={onClose}>Home</a></li>
          <li><a href="#" onClick={onClose}>Create Ad</a></li>
          <li><a href="#" onClick={onClose}>Design Logo</a></li>
          <li><a href="#" onClick={onClose}>Gallery</a></li>
          <li><a href="#" onClick={onClose}>About PixelMuse</a></li>
          <li><a href="#" onClick={onClose}>Contact</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;