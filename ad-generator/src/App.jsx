import { useState } from 'react';
import Header from './components/Header';
import WizardForm from './components/WizardForm';
import AdForm from './components/AdForm';
import ImageDisplay from './components/ImageDisplay';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import { generateImage } from './services/imageService';
import './App.css';
import './wizard-button.css';

function App() {
  const [imageData, setImageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isWizardActive, setIsWizardActive] = useState(false);

  const handleGenerateImage = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await generateImage({
        prompt: formData.prompt,
        size: formData.size,
        generatorMode: formData.generatorMode
      });
      
      if (response && response.data && response.data.length > 0) {
        // The imageService now handles both URL and b64_json formats
        // and converts b64_json to a data URL if needed
        if (response.data[0].url) {
          setImageData({
            url: response.data[0].url,
            size: formData.size,
            generatorMode: formData.generatorMode
          });
        } else if (response.data[0].b64_json) {
          // This should be handled by the imageService now, but just in case
          const dataUrl = `data:image/png;base64,${response.data[0].b64_json}`;
          setImageData({
            url: dataUrl,
            size: formData.size,
            generatorMode: formData.generatorMode
          });
        } else {
          throw new Error('No image URL or base64 data received from API');
        }
      } else {
        throw new Error('No image data received from API');
      }
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err.message || 'Failed to generate image. Please try again.');
      setImageData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="app-layout">
        <Header
          isWizardActive={isWizardActive}
          onToggleWizard={() => setIsWizardActive(!isWizardActive)}
        />
        
        <main className="main-content">
          <div className="container">
            <div className="content-grid">
              <div className="form-section">
                {isWizardActive ? (
                  <WizardForm
                    onSubmit={handleGenerateImage}
                    isLoading={isLoading}
                    onSwitchToSimple={() => setIsWizardActive(false)}
                  />
                ) : (
                  <AdForm
                    onSubmit={handleGenerateImage}
                    isLoading={isLoading}
                    onSwitchToWizard={() => setIsWizardActive(true)}
                  />
                )}
              </div>
              
              <div className="image-section">
                <ImageDisplay
                  imageData={imageData}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
