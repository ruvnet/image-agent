import { useState } from 'react';
import { downloadImage } from '../services/imageService';

const ImageDisplay = ({ imageData, isLoading, error }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = async () => {
    if (!imageData || !imageData.url) return;
    
    try {
      setIsDownloading(true);
      // The downloadImage function now handles both regular URLs and data URLs
      await downloadImage(imageData.url, 'pixelmuse-design.png');
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="image-display loading">
        <div className="loading-spinner"></div>
        <p>Creating your design...</p>
        <p className="loading-info">This may take a few moments</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="image-display error">
        <div className="error-icon">⚠️</div>
        <h3>Design Creation Error</h3>
        <p>{error}</p>
        <p className="error-help">Please try again or adjust your design description.</p>
      </div>
    );
  }
  
  if (!imageData || !imageData.url) {
    return (
      <div className="image-display empty">
        <div className="empty-icon">🖼️</div>
        <h3>Your Design Will Appear Here</h3>
        <p>Fill out the form and click "Create Design" to generate your image.</p>
      </div>
    );
  }
  
  return (
    <div className="image-display">
      <div className="image-container">
        <img 
          src={imageData.url} 
          alt="AI-generated design"
          className="generated-image"
        />
      </div>
      
      <div className="image-actions">
        <button 
          className="download-button"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? 'Downloading...' : 'Download Image'}
        </button>
        
        <div className="image-info">
          <p>Design created successfully!</p>
          <p className="image-size">Size: {imageData.size || 'Unknown'}</p>
          {imageData.generatorMode && (
            <p className="image-type">Type: {imageData.generatorMode === 'advertisement' ? 'Advertisement' : 'Logo'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageDisplay;