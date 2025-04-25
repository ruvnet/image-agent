import { useState } from 'react';

const AdForm = ({ onSubmit, isLoading, onSwitchToWizard }) => {
  const [formData, setFormData] = useState({
    prompt: '',
    size: '1024x1024',
  });
  
  const [errors, setErrors] = useState({});
  
  const sizes = [
    { value: '1024x1024', label: 'Square (1024x1024)' },
    { value: '1024x1536', label: 'Portrait (1024x1536)' },
    { value: '1536x1024', label: 'Landscape (1536x1024)' },
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.prompt.trim()) {
      newErrors.prompt = 'Please enter a description for your design';
    } else if (formData.prompt.length < 10) {
      newErrors.prompt = 'Design description should be at least 10 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <div className="ad-form-container">
      <div className="ad-form-header">
        <h2>Quick Design Creator</h2>
        <button
          type="button"
          className="wizard-button"
          onClick={onSwitchToWizard}
        >
          Use Design Wizard
          <span className="wizard-icon">✨</span>
        </button>
      </div>
      <p className="form-description">
        Describe your design and PixelMuse will generate it for you using AI.
      </p>
      <div className="wizard-promo">
        <p>Want more options? <button onClick={onSwitchToWizard} className="text-button">Try our advanced design wizard</button> for complete creative control.</p>
      </div>
      
      <form className="ad-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="prompt">Design Description</label>
          <textarea
            id="prompt"
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
            placeholder="Describe your design in detail (e.g., A modern corporate advertisement with people in an office, bright lighting, professional atmosphere)"
            rows={5}
            className={errors.prompt ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.prompt && <div className="error-message">{errors.prompt}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="size">Size</label>
          <select
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            disabled={isLoading}
          >
            {sizes.map(size => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Design'}
        </button>
      </form>
    </div>
  );
};

export default AdForm;