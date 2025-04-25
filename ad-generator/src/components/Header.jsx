import { useState } from 'react';
import Navigation from './Navigation';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const Header = ({ isWizardActive, onToggleWizard }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h1>
              <span className="logo-primary">Pixel</span>
              <span className="logo-secondary">Muse</span>
            </h1>
          </div>
          
          <div className="header-actions">
            <button
              className={`wizard-toggle-button ${isWizardActive ? 'active' : ''}`}
              onClick={onToggleWizard}
              aria-label={isWizardActive ? 'Switch to Simple Mode' : 'Start Design Wizard'}
            >
              {isWizardActive ? 'Simple Mode' : 'Start Design Wizard'}
              <span className="wizard-toggle-icon">✨</span>
            </button>
            <ThemeToggle />
            <button
              className="menu-toggle"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>
        
        <Navigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    </header>
  );
};

export default Header;