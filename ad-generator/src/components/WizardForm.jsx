import { useState } from 'react';
import PropTypes from 'prop-types';
import './WizardForm.css';

// Step indicators component
const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="step-indicator">
      <div className="step-progress">
        <div
          className="step-progress-bar"
          style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
      <div className="step-circles">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`step-circle ${i < currentStep ? 'completed' : i === currentStep ? 'active' : ''}`}
          >
            <span>{i + 1}</span>
          </div>
        ))}
      </div>
      <div className="step-labels">
        <span>Basic Info</span>
        <span>Design</span>
        <span>Content</span>
        <span>Advanced</span>
        <span>Preview</span>
      </div>
    </div>
  );
};

StepIndicator.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired
};

// Accordion component for collapsible sections
const Accordion = ({ title, children, isOpen, toggleAccordion }) => {
  return (
    <div className={`accordion ${isOpen ? 'open' : ''}`}>
      <div className="accordion-header" onClick={toggleAccordion}>
        <h4>{title}</h4>
        <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );
};

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleAccordion: PropTypes.func.isRequired
};

// Tab component for organizing content
const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired
    })
  ).isRequired,
  activeTab: PropTypes.number.isRequired,
  setActiveTab: PropTypes.func.isRequired
};

// Main wizard component
const WizardForm = ({ onSubmit, isLoading, onSwitchToSimple }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Info (Step 1)
    generatorMode: 'advertisement', // or 'logo'
    adType: 'product',
    purpose: 'awareness',
    targetAudience: '',
    companyName: '',
    industry: '',
    
    // Design Elements (Step 2)
    colorScheme: 'professional',
    fontStyle: 'modern',
    adStyle: 'corporate',
    layout: 'balanced',
    
    // Content (Step 3)
    headline: '',
    description: '',
    callToAction: '',
    
    // Advanced Options (Step 4) - Shared
    visualElements: [],
    mood: 'neutral',
    detailLevel: 'medium',
    specificFonts: [],
    brandColors: '',
    
    // Advanced Options (Step 4) - Advertisement specific
    photographicStyle: 'realistic',
    lighting: 'natural',
    perspective: 'front',
    
    // Advanced Options (Step 4) - Logo specific
    logoType: 'combination',
    logoStyle: 'modern',
    textCase: 'mixed',
    textWeight: 'regular',
    colorSchemeCount: '2',
    brandValues: '',
    targetMarket: '',
    competitors: '',
    
    // Technical (used in all steps)
    size: '1024x1024',
    prompt: '', // This will be constructed from all the above fields
  });
  
  // State for UI components
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [openAccordions, setOpenAccordions] = useState({
    // Advertisement accordions
    photographicElements: true,
    visualStyle: false,
    typography: false,
    brandElements: false,
    
    // Logo accordions
    logoType: true,
    logoStyle: false,
    brandIdentity: false
  });
  
  // Toggle accordion state
  const toggleAccordion = (accordionName) => {
    setOpenAccordions(prev => ({
      ...prev,
      [accordionName]: !prev[accordionName]
    }));
  };
  
  // Options for form fields
  const sizes = [
    { value: '1024x1024', label: 'Square (1024x1024)' },
    { value: '1024x1536', label: 'Portrait (1024x1536)' },
    { value: '1536x1024', label: 'Landscape (1536x1024)' },
  ];
  
  const adTypes = [
    { value: 'product', label: 'Product Advertisement' },
    { value: 'service', label: 'Service Advertisement' },
    { value: 'brand', label: 'Brand Awareness' },
    { value: 'event', label: 'Event Promotion' },
  ];
  
  const purposes = [
    { value: 'awareness', label: 'Brand Awareness' },
    { value: 'conversion', label: 'Sales Conversion' },
    { value: 'engagement', label: 'Customer Engagement' },
    { value: 'information', label: 'Information Sharing' },
  ];
  
  const colorSchemes = [
    { value: 'professional', label: 'Professional (Blue, Gray)' },
    { value: 'vibrant', label: 'Vibrant (Bright, Colorful)' },
    { value: 'minimal', label: 'Minimal (Black, White)' },
    { value: 'warm', label: 'Warm (Red, Orange, Yellow)' },
    { value: 'cool', label: 'Cool (Blue, Green, Purple)' },
    { value: 'pastel', label: 'Pastel (Soft, Light Colors)' },
    { value: 'monochrome', label: 'Monochrome (Single Color)' },
    { value: 'earthy', label: 'Earthy (Natural Tones)' },
  ];
  
  const fontStyles = [
    { value: 'modern', label: 'Modern Sans-Serif' },
    { value: 'classic', label: 'Classic Serif' },
    { value: 'playful', label: 'Playful Display' },
    { value: 'elegant', label: 'Elegant Script' },
    { value: 'bold', label: 'Bold Impact' },
    { value: 'minimalist', label: 'Clean Minimalist' },
    { value: 'retro', label: 'Vintage Typography' },
    { value: 'handwritten', label: 'Handwritten Style' },
  ];
  
  const adStyles = [
    { value: 'corporate', label: 'Corporate Professional' },
    { value: 'casual', label: 'Casual Friendly' },
    { value: 'luxury', label: 'Luxury Premium' },
    { value: 'minimalist', label: 'Clean Minimalist' },
    { value: 'retro', label: 'Vintage Retro' },
    { value: 'futuristic', label: 'Modern Futuristic' },
    { value: 'artistic', label: 'Creative Artistic' },
    { value: 'playful', label: 'Fun Playful' },
  ];
  
  const layouts = [
    { value: 'balanced', label: 'Balanced (Equal text and image)' },
    { value: 'image-dominant', label: 'Image Dominant (Large visuals)' },
    { value: 'text-dominant', label: 'Text Dominant (Focus on copy)' },
    { value: 'grid', label: 'Grid Layout (Multiple sections)' },
    { value: 'asymmetric', label: 'Asymmetric (Dynamic balance)' },
    { value: 'centered', label: 'Centered (Focus on middle)' },
    { value: 'split', label: 'Split Screen (Two halves)' },
    { value: 'layered', label: 'Layered (Overlapping elements)' },
  ];
  
  // New advanced options
  const photographicStyles = [
    { value: 'realistic', label: 'Realistic Photography' },
    { value: 'studio', label: 'Studio Photography' },
    { value: 'lifestyle', label: 'Lifestyle Photography' },
    { value: 'documentary', label: 'Documentary Style' },
    { value: 'product', label: 'Product Photography' },
    { value: 'aerial', label: 'Aerial/Drone Photography' },
    { value: 'abstract', label: 'Abstract Photography' },
    { value: 'architectural', label: 'Architectural Photography' },
  ];
  
  const visualElements = [
    { value: 'people', label: 'People/Models' },
    { value: 'product', label: 'Product Close-up' },
    { value: 'nature', label: 'Natural Elements' },
    { value: 'technology', label: 'Technology' },
    { value: 'geometric', label: 'Geometric Shapes' },
    { value: 'icons', label: 'Icons/Symbols' },
    { value: 'illustrations', label: 'Illustrations' },
    { value: 'textures', label: 'Textures/Patterns' },
  ];
  
  const moods = [
    { value: 'neutral', label: 'Neutral' },
    { value: 'happy', label: 'Happy/Uplifting' },
    { value: 'serious', label: 'Serious/Professional' },
    { value: 'relaxed', label: 'Calm/Relaxed' },
    { value: 'energetic', label: 'Energetic/Dynamic' },
    { value: 'luxurious', label: 'Luxurious/Elegant' },
    { value: 'nostalgic', label: 'Nostalgic/Retro' },
    { value: 'futuristic', label: 'Futuristic/Innovative' },
  ];
  
  const lightingOptions = [
    { value: 'natural', label: 'Natural Daylight' },
    { value: 'studio', label: 'Studio Lighting' },
    { value: 'dramatic', label: 'Dramatic Lighting' },
    { value: 'soft', label: 'Soft Diffused Light' },
    { value: 'bright', label: 'Bright High-Key' },
    { value: 'dark', label: 'Dark Low-Key' },
    { value: 'backlit', label: 'Backlit/Silhouette' },
    { value: 'colorful', label: 'Colorful Lighting' },
  ];
  
  const perspectiveOptions = [
    { value: 'front', label: 'Front View' },
    { value: 'angle', label: 'Angled View' },
    { value: 'side', label: 'Side View' },
    { value: 'aerial', label: 'Aerial/Top-Down' },
    { value: 'closeup', label: 'Close-Up' },
    { value: 'wideangle', label: 'Wide Angle' },
    { value: 'fisheye', label: 'Fisheye/Distorted' },
    { value: 'isometric', label: 'Isometric View' },
  ];
  
  const detailLevels = [
    { value: 'minimal', label: 'Minimal Details' },
    { value: 'low', label: 'Low Detail' },
    { value: 'medium', label: 'Medium Detail' },
    { value: 'high', label: 'High Detail' },
    { value: 'ultra', label: 'Ultra-Detailed' },
  ];
  
  const specificFontOptions = [
    { value: 'helvetica', label: 'Helvetica' },
    { value: 'futura', label: 'Futura' },
    { value: 'garamond', label: 'Garamond' },
    { value: 'roboto', label: 'Roboto' },
    { value: 'montserrat', label: 'Montserrat' },
    { value: 'playfair', label: 'Playfair Display' },
    { value: 'opensans', label: 'Open Sans' },
    { value: 'georgia', label: 'Georgia' },
    { value: 'arial', label: 'Arial' },
    { value: 'times', label: 'Times New Roman' },
    { value: 'didot', label: 'Didot' },
    { value: 'avenir', label: 'Avenir' },
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
  
  // Handle checkbox changes for multi-select options
  const handleCheckboxChange = (e, optionGroup) => {
    const { value, checked } = e.target;
    
    setFormData(prev => {
      // If the field doesn't exist yet or isn't an array, initialize it
      if (!Array.isArray(prev[optionGroup])) {
        prev[optionGroup] = [];
      }
      
      // Add or remove the value based on checked state
      if (checked) {
        return {
          ...prev,
          [optionGroup]: [...prev[optionGroup], value]
        };
      } else {
        return {
          ...prev,
          [optionGroup]: prev[optionGroup].filter(item => item !== value)
        };
      }
    });
  };
  
  const validateStep = () => {
    const newErrors = {};
    
    if (currentStep === 0) {
      // Validate Step 1: Basic Info
      if (formData.generatorMode === 'advertisement') {
        if (!formData.targetAudience.trim()) {
          newErrors.targetAudience = 'Please describe your target audience';
        }
      } else if (formData.generatorMode === 'logo') {
        if (!formData.companyName?.trim()) {
          newErrors.companyName = 'Please enter your company name';
        }
        if (!formData.industry?.trim()) {
          newErrors.industry = 'Please enter your industry';
        }
      }
    } else if (currentStep === 2) {
      // Validate Step 3: Content
      if (formData.generatorMode === 'advertisement') {
        if (!formData.headline.trim()) {
          newErrors.headline = 'Please enter a headline for your advertisement';
        }
        if (!formData.description.trim()) {
          newErrors.description = 'Please enter a description for your advertisement';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const constructPrompt = () => {
    let prompt = '';
    
    // Define font descriptions for both advertisement and logo modes
    const fontDesc = {
      'modern': 'clean, contemporary sans-serif typography with precise spacing and alignment',
      'classic': 'elegant serif typography with traditional proportions and refined character',
      'playful': 'expressive display typography with personality and creative flair',
      'elegant': 'sophisticated script typography with flowing curves and graceful connections',
      'bold': 'strong, impactful typography with heavy weight and commanding presence',
      'minimalist': 'restrained, minimal typography with ample whitespace and careful proportions',
      'retro': 'vintage-inspired typography with nostalgic characteristics from historical periods',
      'handwritten': 'authentic handwritten-style typography with organic, personal qualities'
    };
    
    // Define color scheme descriptions for both advertisement and logo modes
    const colorDesc = {
      'professional': 'sophisticated professional color palette dominated by confident blues and neutral grays',
      'vibrant': 'energetic, attention-grabbing color scheme with bright, saturated hues that create visual excitement',
      'minimal': 'refined minimalist palette focusing on black, white, and subtle grayscale tones',
      'warm': 'inviting warm color spectrum featuring reds, oranges, and yellows that evoke comfort and energy',
      'cool': 'calming cool color harmony with blues, greens, and purples creating a sense of trust and tranquility',
      'pastel': 'soft, approachable pastel palette with gentle, light-toned colors creating a friendly atmosphere',
      'monochrome': 'sophisticated single-color scheme with various tints and shades creating depth while maintaining harmony',
      'earthy': 'grounded natural palette with organic earth tones evoking authenticity and connection to nature'
    };
    
    if (formData.generatorMode === 'advertisement') {
      // Start with a more descriptive introduction
      prompt = `Create a visually striking ${formData.adType} advertisement with a professional ${formData.adStyle} aesthetic. `;
      
      // Add detailed layout description
      const layoutDesc = {
        'balanced': 'balanced composition with harmonious distribution of text and imagery',
        'image-dominant': 'visually impactful design where imagery takes center stage, with minimal but strategic text placement',
        'text-dominant': 'typography-focused layout with powerful messaging as the focal point, supported by complementary visuals',
        'grid': 'organized grid-based structure with multiple content sections arranged in a clean, systematic layout',
        'asymmetric': 'dynamic asymmetrical balance that creates visual interest through intentional imbalance',
        'centered': 'centered composition with the main elements radiating from the middle for a focused, attention-grabbing design',
        'split': 'split-screen design with a clear division between two complementary content areas',
        'layered': 'sophisticated layered composition with overlapping elements creating depth and visual hierarchy'
      };
      prompt += `Structure the advertisement with a ${layoutDesc[formData.layout] || formData.layout + ' layout'}. `;
      
      // Add rich typography and color scheme descriptions
      const fontDesc = {
        'modern': 'clean, contemporary sans-serif typography with precise spacing and alignment',
        'classic': 'elegant serif typography with traditional proportions and refined character',
        'playful': 'expressive display typography with personality and creative flair',
        'elegant': 'sophisticated script typography with flowing curves and graceful connections',
        'bold': 'strong, impactful typography with heavy weight and commanding presence',
        'minimalist': 'restrained, minimal typography with ample whitespace and careful proportions',
        'retro': 'vintage-inspired typography with nostalgic characteristics from historical periods',
        'handwritten': 'authentic handwritten-style typography with organic, personal qualities'
      };
      
      const colorDesc = {
        'professional': 'sophisticated professional color palette dominated by confident blues and neutral grays',
        'vibrant': 'energetic, attention-grabbing color scheme with bright, saturated hues that create visual excitement',
        'minimal': 'refined minimalist palette focusing on black, white, and subtle grayscale tones',
        'warm': 'inviting warm color spectrum featuring reds, oranges, and yellows that evoke comfort and energy',
        'cool': 'calming cool color harmony with blues, greens, and purples creating a sense of trust and tranquility',
        'pastel': 'soft, approachable pastel palette with gentle, light-toned colors creating a friendly atmosphere',
        'monochrome': 'sophisticated single-color scheme with various tints and shades creating depth while maintaining harmony',
        'earthy': 'grounded natural palette with organic earth tones evoking authenticity and connection to nature'
      };
      
      prompt += `Implement ${fontDesc[formData.fontStyle] || formData.fontStyle + ' typography'} paired with a ${colorDesc[formData.colorScheme] || formData.colorScheme + ' color scheme'}. `;
      
      // Add purpose and target audience with more context
      const purposeDesc = {
        'awareness': 'brand awareness campaign that establishes recognition and visibility',
        'conversion': 'sales-focused conversion campaign designed to drive immediate action',
        'engagement': 'engagement-oriented campaign that fosters interaction and connection',
        'information': 'informational campaign that educates and communicates key details'
      };
      
      prompt += `Design this advertisement for a ${purposeDesc[formData.purpose] || formData.purpose + ' campaign'} specifically targeting ${formData.targetAudience}. `;
      
      // Add headline and description with emphasis on their importance
      prompt += `Feature this headline prominently: "${formData.headline}". `;
      prompt += `Support with this descriptive copy: "${formData.description}". `;
      
      // Add call to action if provided
      if (formData.callToAction) {
        prompt += `Include a compelling call to action that stands out: "${formData.callToAction}". `;
      }
      
      // Add advanced photographic elements with rich descriptions
      if (formData.photographicStyle && formData.photographicStyle !== 'realistic') {
        const photoDesc = {
          'studio': 'professional studio photography with controlled lighting and pristine backgrounds',
          'lifestyle': 'authentic lifestyle photography capturing natural moments and relatable scenarios',
          'documentary': 'documentary-style photography with journalistic authenticity and storytelling',
          'product': 'detailed product photography highlighting features with precision and clarity',
          'aerial': 'dramatic aerial/drone photography offering unique overhead perspectives',
          'abstract': 'creative abstract photography using form, color, and texture as artistic elements',
          'architectural': 'structured architectural photography emphasizing lines, spaces, and built environments'
        };
        prompt += `Utilize ${photoDesc[formData.photographicStyle] || formData.photographicStyle + ' photography'}. `;
      }
      
      // Add visual elements if selected with more context
      if (formData.visualElements && formData.visualElements.length > 0) {
        const elementDescriptions = {
          'people': 'authentic-looking people/models that resonate with the target audience',
          'product': 'detailed product close-ups that showcase key features and benefits',
          'nature': 'organic natural elements that add warmth and environmental context',
          'technology': 'modern technology components suggesting innovation and advancement',
          'geometric': 'clean geometric shapes providing structure and contemporary design elements',
          'icons': 'intuitive icons/symbols that communicate concepts efficiently',
          'illustrations': 'custom illustrations adding unique artistic character',
          'textures': 'rich textures/patterns creating depth and tactile interest'
        };
        
        const enhancedElements = formData.visualElements.map(el =>
          elementDescriptions[el] || el
        );
        
        prompt += `Incorporate these visual elements: ${enhancedElements.join('; ')}. `;
      }
      
      // Add mood if specified with emotional context
      if (formData.mood && formData.mood !== 'neutral') {
        const moodDesc = {
          'happy': 'happy/uplifting emotional tone that inspires positivity and optimism',
          'serious': 'serious/professional atmosphere conveying expertise and trustworthiness',
          'relaxed': 'calm/relaxed ambiance promoting peace of mind and comfort',
          'energetic': 'energetic/dynamic feeling full of vitality and momentum',
          'luxurious': 'luxurious/elegant mood suggesting premium quality and sophistication',
          'nostalgic': 'nostalgic/retro sentiment evoking fond memories and emotional connection',
          'futuristic': 'futuristic/innovative spirit communicating cutting-edge advancement'
        };
        prompt += `Establish a ${moodDesc[formData.mood] || formData.mood + ' mood'}. `;
      }
      
      // Add lighting if specified with technical detail
      if (formData.lighting && formData.lighting !== 'natural') {
        const lightingDesc = {
          'studio': 'controlled studio lighting with perfect exposure and professional polish',
          'dramatic': 'dramatic lighting with strong contrast between light and shadow for emotional impact',
          'soft': 'soft diffused lighting creating gentle transitions and flattering illumination',
          'bright': 'bright high-key lighting with minimal shadows for an open, airy feeling',
          'dark': 'moody low-key lighting emphasizing shadows and creating intimate atmosphere',
          'backlit': 'artistic backlighting/silhouette effect creating dramatic outlines and depth',
          'colorful': 'creative colored lighting adding vibrant atmosphere and contemporary edge'
        };
        prompt += `Illuminate with ${lightingDesc[formData.lighting] || formData.lighting + ' lighting'}. `;
      }
      
      // Add perspective if specified with compositional guidance
      if (formData.perspective && formData.perspective !== 'front') {
        const perspectiveDesc = {
          'angle': 'dynamic angled viewpoint creating depth and interest',
          'side': 'revealing side view showing profile and lateral details',
          'aerial': 'impressive aerial/top-down perspective offering a comprehensive overview',
          'closeup': 'intimate close-up framing highlighting fine details and textures',
          'wideangle': 'expansive wide-angle view capturing broader context and environment',
          'fisheye': 'creative fisheye/distorted perspective for artistic impact',
          'isometric': 'technical isometric view with consistent 30-degree angles'
        };
        prompt += `Frame the composition from a ${perspectiveDesc[formData.perspective] || formData.perspective + ' perspective'}. `;
      }
      
      // Add detail level if specified with clarity about execution
      if (formData.detailLevel && formData.detailLevel !== 'medium') {
        const detailDesc = {
          'minimal': 'minimal, essential details focusing only on core elements for a clean, uncluttered aesthetic',
          'low': 'low level of detail with simplified forms and reduced complexity',
          'high': 'high level of detail with careful attention to textures, shadows, and fine elements',
          'ultra': 'ultra-detailed execution with exceptional clarity and precision in every element'
        };
        prompt += `Render with ${detailDesc[formData.detailLevel] || formData.detailLevel + ' level of detail'}. `;
      }
      
      // Add specific fonts if selected with typographic guidance
      if (formData.specificFonts && formData.specificFonts.length > 0) {
        prompt += `Incorporate these specific typefaces for maximum brand alignment: ${formData.specificFonts.join(', ')}. `;
      }
      
      // Add brand colors if specified with design context
      if (formData.brandColors) {
        prompt += `Use this exact brand color palette for visual consistency: ${formData.brandColors}. `;
      }
      
      // Add a final quality instruction
      prompt += `Create a high-quality, professional advertisement that effectively communicates the message while maintaining visual appeal and brand coherence.`;
    } else {
      // Logo generator prompt with enhanced descriptions
      prompt = `Design a distinctive professional logo for "${formData.companyName}" in the ${formData.industry} industry. `;
      
      // Add logo type
      const logoTypeDesc = {
        'wordmark': 'wordmark/text-only logo that focuses on distinctive typography of the full company name',
        'lettermark': 'lettermark/monogram logo using the initials or first letter of the company name',
        'symbol': 'symbolic/iconic logo that represents the brand through a distinctive mark without text',
        'combination': 'combination mark that pairs a symbol with text for a complete brand representation',
        'emblem': 'emblem/badge-style logo where text is contained within a symbol or distinctive shape',
        'mascot': 'character/mascot logo featuring an illustrated character that represents the brand',
        'abstract': 'abstract/geometric logo using non-representational shapes to create a unique visual identity'
      };
      
      prompt += `Create a ${logoTypeDesc[formData.logoType] || 'professional logo'}. `;
      
      // Add style and typography details
      const logoStyleDesc = {
        'modern': 'modern/minimal style with clean lines and contemporary aesthetics',
        'classic': 'classic/traditional style with timeless appeal and established presence',
        'vintage': 'vintage/retro style evoking nostalgia and heritage',
        'playful': 'playful/fun style with approachable character and personality',
        'luxury': 'luxury/premium style suggesting exclusivity and superior quality',
        'tech': 'tech/digital style communicating innovation and cutting-edge solutions',
        'handcrafted': 'handcrafted/organic style with authentic, artisanal qualities',
        'geometric': 'geometric/abstract style using precise shapes and mathematical forms'
      };
      
      const adStyleDesc = {
        'corporate': 'corporate professional style conveying reliability and expertise',
        'casual': 'approachable casual style creating friendly, accessible brand perception',
        'luxury': 'premium luxury style suggesting exclusivity and superior quality',
        'minimalist': 'refined minimalist style with clean lines and essential elements only',
        'retro': 'characterful vintage/retro style evoking nostalgia and established heritage',
        'futuristic': 'innovative futuristic style communicating cutting-edge advancement',
        'artistic': 'unique artistic style with creative expression and memorable visual identity',
        'playful': 'engaging playful style adding personality and approachable character'
      };
      
      // Use logoStyle if available, otherwise fall back to adStyle
      const styleDescription = formData.logoStyle ?
        (logoStyleDesc[formData.logoStyle] || formData.logoStyle + ' style') :
        (adStyleDesc[formData.adStyle] || formData.adStyle + ' style');
      
      prompt += `Design the logo with a ${styleDescription} incorporating ${fontDesc[formData.fontStyle] || formData.fontStyle + ' typography'} and a ${colorDesc[formData.colorScheme] || formData.colorScheme + ' color palette'}. `;
      
      // Add text case and weight if specified
      if (formData.textCase) {
        const textCaseDesc = {
          'uppercase': 'UPPERCASE lettering for bold impact',
          'lowercase': 'lowercase lettering for a modern, approachable feel',
          'mixed': 'mixed case lettering for balanced readability',
          'titlecase': 'Title Case lettering for professional presentation'
        };
        prompt += `Use ${textCaseDesc[formData.textCase] || formData.textCase + ' text'}. `;
      }
      
      if (formData.textWeight) {
        const textWeightDesc = {
          'light': 'light weight typography for elegance and sophistication',
          'regular': 'regular weight typography for balanced readability',
          'medium': 'medium weight typography for clear visibility',
          'bold': 'bold weight typography for strong impact and presence',
          'black': 'black/heavy weight typography for maximum visual impact'
        };
        prompt += `Apply ${textWeightDesc[formData.textWeight] || formData.textWeight + ' weight'}. `;
      }
      
      // Add color scheme count if specified
      if (formData.colorSchemeCount) {
        const colorCountDesc = {
          '1': 'monochromatic color scheme using variations of a single color',
          '2': 'duotone color scheme with two complementary or contrasting colors',
          '3': 'tritone color scheme with three harmonious colors',
          '4+': 'multicolor scheme with four or more carefully balanced colors'
        };
        prompt += `Implement a ${colorCountDesc[formData.colorSchemeCount] || formData.colorSchemeCount + '-color scheme'}. `;
      }
      
      // Add brand description
      if (formData.description) {
        prompt += `The brand essence is described as: "${formData.description}" - ensure the design reflects these qualities. `;
      }
      
      // Add brand values if provided
      if (formData.brandValues) {
        prompt += `Embody these core brand values: ${formData.brandValues}. `;
      }
      
      // Add target market if provided
      if (formData.targetMarket) {
        prompt += `Appeal to this target market: ${formData.targetMarket}. `;
      }
      
      // Add mood if specified
      if (formData.mood && formData.mood !== 'neutral') {
        const moodDesc = {
          'happy': 'happy/uplifting emotional tone that inspires positivity and optimism',
          'serious': 'serious/professional atmosphere conveying expertise and trustworthiness',
          'relaxed': 'calm/relaxed ambiance promoting peace of mind and comfort',
          'energetic': 'energetic/dynamic feeling full of vitality and momentum',
          'luxurious': 'luxurious/elegant mood suggesting premium quality and sophistication',
          'nostalgic': 'nostalgic/retro sentiment evoking fond memories and emotional connection',
          'futuristic': 'futuristic/innovative spirit communicating cutting-edge advancement'
        };
        prompt += `Establish a ${moodDesc[formData.mood] || formData.mood + ' mood'}. `;
      }
      
      // Add advanced options for logo if provided
      if (formData.visualElements && formData.visualElements.length > 0) {
        prompt += `Integrate these key visual elements into the logo design: ${formData.visualElements.join(', ')}. `;
      }
      
      if (formData.specificFonts && formData.specificFonts.length > 0) {
        prompt += `Use these specific typefaces for the logotype: ${formData.specificFonts.join(', ')}. `;
      }
      
      if (formData.brandColors) {
        prompt += `Apply this exact color palette: ${formData.brandColors}. `;
      }
      
      // Add detail level if specified
      if (formData.detailLevel && formData.detailLevel !== 'medium') {
        const detailDesc = {
          'minimal': 'minimal, essential details focusing only on core elements for a clean, uncluttered aesthetic',
          'low': 'low level of detail with simplified forms and reduced complexity',
          'high': 'high level of detail with careful attention to textures, shadows, and fine elements',
          'ultra': 'ultra-detailed execution with exceptional clarity and precision in every element'
        };
        prompt += `Render with ${detailDesc[formData.detailLevel] || formData.detailLevel + ' level of detail'}. `;
      }
      
      // Add competitors to differentiate from if provided
      if (formData.competitors) {
        prompt += `Ensure the design is distinct from competitors like ${formData.competitors}. `;
      }
      
      // Add final quality instruction
      prompt += `Create a versatile, memorable logo that works effectively at different scales and in various applications while perfectly representing the brand's identity. The logo should be simple enough to be recognizable at small sizes but distinctive enough to stand out in the marketplace.`;
    }
    
    return prompt;
  };
  
  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        // On final step, construct the prompt and submit
        // Only include the valid parameters for the OpenAI API: prompt, size, n
        const finalFormData = {
          prompt: constructPrompt(),
          size: formData.size,
          n: 1
        };
        onSubmit(finalFormData);
      }
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleModeToggle = (mode) => {
    setFormData(prev => ({
      ...prev,
      generatorMode: mode,
      // Reset some fields when switching modes
      ...(mode === 'logo' ? { 
        adType: '', 
        purpose: '',
        companyName: prev.companyName || '',
        industry: prev.industry || ''
      } : {})
    }));
  };
  
  // Render different form steps based on currentStep
  const renderStep = () => {
    switch (currentStep) {
      case 0: // Step 1: Basic Info
        return (
          <div className="wizard-step">
            <h3>Basic Information</h3>
            
            <div className="mode-toggle-container">
              <div className="mode-toggle">
                <button 
                  className={`mode-button ${formData.generatorMode === 'advertisement' ? 'active' : ''}`}
                  onClick={() => handleModeToggle('advertisement')}
                  type="button"
                >
                  Design Advertisement
                </button>
                <button 
                  className={`mode-button ${formData.generatorMode === 'logo' ? 'active' : ''}`}
                  onClick={() => handleModeToggle('logo')}
                  type="button"
                >
                  Design Logo
                </button>
              </div>
            </div>
            
            {formData.generatorMode === 'advertisement' ? (
              <>
                <div className="form-group">
                  <label htmlFor="adType">Advertisement Type</label>
                  <select
                    id="adType"
                    name="adType"
                    value={formData.adType}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    {adTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="purpose">Advertisement Purpose</label>
                  <select
                    id="purpose"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    {purposes.map(purpose => (
                      <option key={purpose.value} value={purpose.value}>
                        {purpose.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="targetAudience">Target Audience</label>
                  <textarea
                    id="targetAudience"
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleChange}
                    placeholder="Describe your target audience (e.g., Young professionals aged 25-35 interested in fitness and wellness)"
                    rows={3}
                    className={errors.targetAudience ? 'error' : ''}
                    disabled={isLoading}
                  />
                  {errors.targetAudience && <div className="error-message">{errors.targetAudience}</div>}
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="companyName">Company Name</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName || ''}
                    onChange={handleChange}
                    placeholder="Enter your company name"
                    className={errors.companyName ? 'error' : ''}
                    disabled={isLoading}
                  />
                  {errors.companyName && <div className="error-message">{errors.companyName}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="industry">Industry</label>
                  <input
                    type="text"
                    id="industry"
                    name="industry"
                    value={formData.industry || ''}
                    onChange={handleChange}
                    placeholder="Enter your industry (e.g., Technology, Healthcare, Finance)"
                    className={errors.industry ? 'error' : ''}
                    disabled={isLoading}
                  />
                  {errors.industry && <div className="error-message">{errors.industry}</div>}
                </div>
              </>
            )}
            
            <div className="form-group">
              <label htmlFor="size">Image Size</label>
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
          </div>
        );
        
      case 1: // Step 2: Design Elements
        return (
          <div className="wizard-step">
            <h3>Design Elements</h3>
            
            <div className="form-group">
              <label htmlFor="colorScheme">Color Scheme</label>
              <div className="color-scheme-selector">
                {colorSchemes.map(scheme => (
                  <div 
                    key={scheme.value}
                    className={`color-scheme-option ${formData.colorScheme === scheme.value ? 'selected' : ''}`}
                    onClick={() => handleChange({ target: { name: 'colorScheme', value: scheme.value } })}
                  >
                    <div className={`color-preview ${scheme.value}`}></div>
                    <span>{scheme.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="fontStyle">Font Style</label>
              <select
                id="fontStyle"
                name="fontStyle"
                value={formData.fontStyle}
                onChange={handleChange}
                disabled={isLoading}
              >
                {fontStyles.map(font => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="adStyle">Style</label>
              <select
                id="adStyle"
                name="adStyle"
                value={formData.adStyle}
                onChange={handleChange}
                disabled={isLoading}
              >
                {adStyles.map(style => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="layout">Layout</label>
              <select
                id="layout"
                name="layout"
                value={formData.layout}
                onChange={handleChange}
                disabled={isLoading}
              >
                {layouts.map(layout => (
                  <option key={layout.value} value={layout.value}>
                    {layout.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
        
      case 2: // Step 3: Content
        return (
          <div className="wizard-step">
            <h3>{formData.generatorMode === 'advertisement' ? 'Advertisement Content' : 'Logo Content'}</h3>
            
            <div className="form-group">
              <label htmlFor="headline">{formData.generatorMode === 'advertisement' ? 'Headline' : 'Tagline (Optional)'}</label>
              <input
                type="text"
                id="headline"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                placeholder={formData.generatorMode === 'advertisement' ? 
                  "Enter your advertisement's main headline" : 
                  "Enter your company's tagline (optional)"}
                className={errors.headline ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.headline && <div className="error-message">{errors.headline}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="description">{formData.generatorMode === 'advertisement' ? 'Description' : 'Brand Description'}</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={formData.generatorMode === 'advertisement' ? 
                  "Describe your advertisement in detail" : 
                  "Describe your brand's values and personality"}
                rows={4}
                className={errors.description ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.description && <div className="error-message">{errors.description}</div>}
            </div>
            
            {formData.generatorMode === 'advertisement' && (
              <div className="form-group">
                <label htmlFor="callToAction">Call to Action (Optional)</label>
                <input
                  type="text"
                  id="callToAction"
                  name="callToAction"
                  value={formData.callToAction}
                  onChange={handleChange}
                  placeholder="Enter a call to action (e.g., 'Shop Now', 'Learn More')"
                  disabled={isLoading}
                />
              </div>
            )}
          </div>
        );
        
      case 3: // Step 4: Advanced Options
        return (
          <div className="wizard-step">
            <h3>Advanced Options</h3>
            <p className="advanced-description">Fine-tune your image with these advanced settings</p>
            
            {formData.generatorMode === 'advertisement' ? (
              <Tabs
                tabs={[
                  {
                    label: 'Photography',
                    content: (
                      <div className="tab-section">
                        <Accordion
                          title="Photographic Elements"
                          isOpen={openAccordions.photographicElements}
                          toggleAccordion={() => toggleAccordion('photographicElements')}
                        >
                          <div className="form-group">
                            <label htmlFor="photographicStyle">Photographic Style</label>
                            <select
                              id="photographicStyle"
                              name="photographicStyle"
                              value={formData.photographicStyle}
                              onChange={handleChange}
                              disabled={isLoading}
                            >
                              {photographicStyles.map(style => (
                                <option key={style.value} value={style.value}>
                                  {style.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="form-group">
                            <label>Visual Elements (Select multiple)</label>
                            <div className="checkbox-group">
                              {visualElements.map(element => (
                                <div key={element.value} className="checkbox-item">
                                  <input
                                    type="checkbox"
                                    id={`visual-${element.value}`}
                                    value={element.value}
                                    checked={formData.visualElements.includes(element.value)}
                                    onChange={(e) => handleCheckboxChange(e, 'visualElements')}
                                    disabled={isLoading}
                                  />
                                  <label htmlFor={`visual-${element.value}`}>{element.label}</label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Accordion>
                        
                        <Accordion
                          title="Visual Style"
                          isOpen={openAccordions.visualStyle}
                          toggleAccordion={() => toggleAccordion('visualStyle')}
                        >
                          <div className="form-group">
                            <label htmlFor="mood">Mood</label>
                            <select
                              id="mood"
                              name="mood"
                              value={formData.mood}
                              onChange={handleChange}
                              disabled={isLoading}
                            >
                              {moods.map(mood => (
                                <option key={mood.value} value={mood.value}>
                                  {mood.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="lighting">Lighting</label>
                            <select
                              id="lighting"
                              name="lighting"
                              value={formData.lighting}
                              onChange={handleChange}
                              disabled={isLoading}
                            >
                              {lightingOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="perspective">Perspective</label>
                            <select
                              id="perspective"
                              name="perspective"
                              value={formData.perspective}
                              onChange={handleChange}
                              disabled={isLoading}
                            >
                              {perspectiveOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="detailLevel">Detail Level</label>
                            <select
                              id="detailLevel"
                              name="detailLevel"
                              value={formData.detailLevel}
                              onChange={handleChange}
                              disabled={isLoading}
                            >
                              {detailLevels.map(level => (
                                <option key={level.value} value={level.value}>
                                  {level.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Accordion>
                      </div>
                    )
                  },
                  {
                    label: 'Typography',
                    content: (
                      <div className="tab-section">
                        <Accordion
                          title="Typography Options"
                          isOpen={openAccordions.typography}
                          toggleAccordion={() => toggleAccordion('typography')}
                        >
                          <div className="form-group">
                            <label>Specific Fonts (Select multiple)</label>
                            <div className="checkbox-group">
                              {specificFontOptions.map(font => (
                                <div key={font.value} className="checkbox-item">
                                  <input
                                    type="checkbox"
                                    id={`font-${font.value}`}
                                    value={font.value}
                                    checked={formData.specificFonts.includes(font.value)}
                                    onChange={(e) => handleCheckboxChange(e, 'specificFonts')}
                                    disabled={isLoading}
                                  />
                                  <label htmlFor={`font-${font.value}`} style={{fontFamily: font.value}}>
                                    {font.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Accordion>
                      </div>
                    )
                  },
                  {
                    label: 'Brand',
                    content: (
                      <div className="tab-section">
                        <Accordion
                          title="Brand Elements"
                          isOpen={openAccordions.brandElements}
                          toggleAccordion={() => toggleAccordion('brandElements')}
                        >
                          <div className="form-group">
                            <label htmlFor="brandColors">Brand Colors (Hex codes or color names)</label>
                            <input
                              type="text"
                              id="brandColors"
                              name="brandColors"
                              value={formData.brandColors}
                              onChange={handleChange}
                              placeholder="e.g., #FF5733, blue, forest green"
                              disabled={isLoading}
                            />
                            {formData.brandColors && (
                              <div className="color-picker-preview">
                                {formData.brandColors.split(',').map((color, index) => (
                                  <div
                                    key={index}
                                    className="color-swatch"
                                    style={{backgroundColor: color.trim()}}
                                    title={color.trim()}
                                  ></div>
                                ))}
                              </div>
                            )}
                          </div>
                        </Accordion>
                      </div>
                    )
                  }
                ]}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            ) : (
              // Logo Generator Advanced Options
              <Tabs
                tabs={[
                  {
                    label: 'Logo Style',
                    content: (
                      <div className="tab-section">
                        <Accordion
                          title="Logo Type"
                          isOpen={openAccordions.logoType || true}
                          toggleAccordion={() => toggleAccordion('logoType')}
                        >
                          <div className="form-group">
                            <label htmlFor="logoType">Logo Type</label>
                            <select
                              id="logoType"
                              name="logoType"
                              value={formData.logoType || 'combination'}
                              onChange={handleChange}
                              disabled={isLoading}
                            >
                              <option value="wordmark">Wordmark (Text Only)</option>
                              <option value="lettermark">Lettermark (Initials)</option>
                              <option value="symbol">Symbol/Icon Only</option>
                              <option value="combination">Combination (Symbol + Text)</option>
                              <option value="emblem">Emblem/Badge Style</option>
                              <option value="mascot">Character/Mascot</option>
                              <option value="abstract">Abstract/Geometric</option>
                            </select>
                          </div>
                          
                          <div className="form-group">
                            <label>Visual Elements (Select multiple)</label>
                            <div className="checkbox-group">
                              {visualElements.map(element => (
                                <div key={element.value} className="checkbox-item">
                                  <input
                                    type="checkbox"
                                    id={`logo-visual-${element.value}`}
                                    value={element.value}
                                    checked={formData.visualElements.includes(element.value)}
                                    onChange={(e) => handleCheckboxChange(e, 'visualElements')}
                                    disabled={isLoading}
                                  />
                                  <label htmlFor={`logo-visual-${element.value}`}>{element.label}</label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Accordion>
                        
                        <Accordion
                          title="Style & Aesthetics"
                          isOpen={openAccordions.logoStyle}
                          toggleAccordion={() => toggleAccordion('logoStyle')}
                        >
                          <div className="form-group">
                            <label htmlFor="logoStyle">Logo Style</label>
                            <select
                              id="logoStyle"
                              name="logoStyle"
                              value={formData.logoStyle || 'modern'}
                              onChange={handleChange}
                              disabled={isLoading}
                            >
                              <option value="modern">Modern/Minimal</option>
                              <option value="classic">Classic/Traditional</option>
                              <option value="vintage">Vintage/Retro</option>
                              <option value="playful">Playful/Fun</option>
                              <option value="luxury">Luxury/Premium</option>
                              <option value="tech">Tech/Digital</option>
                              <option value="handcrafted">Handcrafted/Organic</option>
                              <option value="geometric">Geometric/Abstract</option>
                            </select>
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="detailLevel">Detail Level</label>
                            <select
                              id="detailLevel"
                              name="detailLevel"
                              value={formData.detailLevel}
                              onChange={handleChange}
                              disabled={isLoading}
                            >
                              {detailLevels.map(level => (
                                <option key={level.value} value={level.value}>
                                  {level.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="mood">Mood/Feeling</label>
                            <select
                              id="mood"
                              name="mood"
                              value={formData.mood}
                              onChange={handleChange}
                              disabled={isLoading}
                            >
                              {moods.map(mood => (
                                <option key={mood.value} value={mood.value}>
                                  {mood.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Accordion>
                      </div>
                    )
                  },
                  {
                    label: 'Typography',
                    content: (
                      <div className="tab-section">
                        <Accordion
                          title="Typography Options"
                          isOpen={openAccordions.typography}
                          toggleAccordion={() => toggleAccordion('typography')}
                        >
                          <div className="form-group">
                            <label htmlFor="textCase">Text Case</label>
                            <select
                              id="textCase"
                              name="textCase"
                              value={formData.textCase || 'mixed'}
                              onChange={handleChange}
                              disabled={isLoading}
                            >
                              <option value="uppercase">UPPERCASE</option>
                              <option value="lowercase">lowercase</option>
                              <option value="mixed">Mixed Case</option>
                              <option value="titlecase">Title Case</option>
                            </select>
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="textWeight">Font Weight</label>
                            <select
                              id="textWeight"
                              name="textWeight"
                              value={formData.textWeight || 'regular'}
                              onChange={handleChange}
                              disabled={isLoading}
                            >
                              <option value="light">Light</option>
                              <option value="regular">Regular</option>
                              <option value="medium">Medium</option>
                              <option value="bold">Bold</option>
                              <option value="black">Black/Heavy</option>
                            </select>
                          </div>
                          
                          <div className="form-group">
                            <label>Specific Fonts (Select multiple)</label>
                            <div className="checkbox-group">
                              {specificFontOptions.map(font => (
                                <div key={font.value} className="checkbox-item">
                                  <input
                                    type="checkbox"
                                    id={`logo-font-${font.value}`}
                                    value={font.value}
                                    checked={formData.specificFonts.includes(font.value)}
                                    onChange={(e) => handleCheckboxChange(e, 'specificFonts')}
                                    disabled={isLoading}
                                  />
                                  <label htmlFor={`logo-font-${font.value}`} style={{fontFamily: font.value}}>
                                    {font.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Accordion>
                      </div>
                    )
                  },
                  {
                    label: 'Brand',
                    content: (
                      <div className="tab-section">
                        <Accordion
                          title="Brand Colors"
                          isOpen={openAccordions.brandElements}
                          toggleAccordion={() => toggleAccordion('brandElements')}
                        >
                          <div className="form-group">
                            <label htmlFor="brandColors">Brand Colors (Hex codes or color names)</label>
                            <input
                              type="text"
                              id="brandColors"
                              name="brandColors"
                              value={formData.brandColors}
                              onChange={handleChange}
                              placeholder="e.g., #FF5733, blue, forest green"
                              disabled={isLoading}
                            />
                            {formData.brandColors && (
                              <div className="color-picker-preview">
                                {formData.brandColors.split(',').map((color, index) => (
                                  <div
                                    key={index}
                                    className="color-swatch"
                                    style={{backgroundColor: color.trim()}}
                                    title={color.trim()}
                                  ></div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="colorSchemeCount">Number of Colors</label>
                            <select
                              id="colorSchemeCount"
                              name="colorSchemeCount"
                              value={formData.colorSchemeCount || '2'}
                              onChange={handleChange}
                              disabled={isLoading}
                            >
                              <option value="1">Monochrome (1 color)</option>
                              <option value="2">Duotone (2 colors)</option>
                              <option value="3">Tritone (3 colors)</option>
                              <option value="4+">Multicolor (4+ colors)</option>
                            </select>
                          </div>
                        </Accordion>
                        
                        <Accordion
                          title="Brand Identity"
                          isOpen={openAccordions.brandIdentity}
                          toggleAccordion={() => toggleAccordion('brandIdentity')}
                        >
                          <div className="form-group">
                            <label htmlFor="brandValues">Brand Values (comma separated)</label>
                            <input
                              type="text"
                              id="brandValues"
                              name="brandValues"
                              value={formData.brandValues || ''}
                              onChange={handleChange}
                              placeholder="e.g., Innovation, Trust, Quality"
                              disabled={isLoading}
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="targetMarket">Target Market</label>
                            <input
                              type="text"
                              id="targetMarket"
                              name="targetMarket"
                              value={formData.targetMarket || ''}
                              onChange={handleChange}
                              placeholder="e.g., Young professionals, Families, B2B clients"
                              disabled={isLoading}
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="competitors">Competitors (optional)</label>
                            <input
                              type="text"
                              id="competitors"
                              name="competitors"
                              value={formData.competitors || ''}
                              onChange={handleChange}
                              placeholder="e.g., Company A, Company B"
                              disabled={isLoading}
                            />
                          </div>
                        </Accordion>
                      </div>
                    )
                  }
                ]}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}
          </div>
        );
        
      case 4: // Step 5: Preview & Generate
        return (
          <div className="wizard-step">
            <h3>Preview & Generate</h3>
            
            <div className="preview-container">
              <h4>Summary</h4>
              
              <div className="preview-section">
                <h5>Basic Information</h5>
                <p><strong>Type:</strong> {formData.generatorMode === 'advertisement' ? 
                  `${adTypes.find(t => t.value === formData.adType)?.label || formData.adType}` : 
                  'Logo Design'}</p>
                
                {formData.generatorMode === 'advertisement' ? (
                  <>
                    <p><strong>Purpose:</strong> {purposes.find(p => p.value === formData.purpose)?.label || formData.purpose}</p>
                    <p><strong>Target Audience:</strong> {formData.targetAudience}</p>
                  </>
                ) : (
                  <>
                    <p><strong>Company:</strong> {formData.companyName}</p>
                    <p><strong>Industry:</strong> {formData.industry}</p>
                  </>
                )}
              </div>
              
              <div className="preview-section">
                <h5>Design Elements</h5>
                <p><strong>Color Scheme:</strong> {colorSchemes.find(c => c.value === formData.colorScheme)?.label || formData.colorScheme}</p>
                <p><strong>Font Style:</strong> {fontStyles.find(f => f.value === formData.fontStyle)?.label || formData.fontStyle}</p>
                <p><strong>Style:</strong> {adStyles.find(s => s.value === formData.adStyle)?.label || formData.adStyle}</p>
                {formData.generatorMode === 'advertisement' && (
                  <p><strong>Layout:</strong> {layouts.find(l => l.value === formData.layout)?.label || formData.layout}</p>
                )}
              </div>
              
              <div className="preview-section">
                <h5>Content</h5>
                {formData.headline && <p><strong>{formData.generatorMode === 'advertisement' ? 'Headline' : 'Tagline'}:</strong> {formData.headline}</p>}
                {formData.description && <p><strong>Description:</strong> {formData.description}</p>}
                {formData.generatorMode === 'advertisement' && formData.callToAction && (
                  <p><strong>Call to Action:</strong> {formData.callToAction}</p>
                )}
              </div>
              
              <div className="preview-section">
                <h5>Advanced Options</h5>
                {formData.photographicStyle !== 'realistic' && (
                  <p><strong>Photographic Style:</strong> {photographicStyles.find(s => s.value === formData.photographicStyle)?.label || formData.photographicStyle}</p>
                )}
                
                {formData.visualElements && formData.visualElements.length > 0 && (
                  <p><strong>Visual Elements:</strong> {formData.visualElements.map(el =>
                    visualElements.find(v => v.value === el)?.label || el
                  ).join(', ')}</p>
                )}
                
                {formData.mood !== 'neutral' && (
                  <p><strong>Mood:</strong> {moods.find(m => m.value === formData.mood)?.label || formData.mood}</p>
                )}
                
                {formData.lighting !== 'natural' && (
                  <p><strong>Lighting:</strong> {lightingOptions.find(l => l.value === formData.lighting)?.label || formData.lighting}</p>
                )}
                
                {formData.perspective !== 'front' && (
                  <p><strong>Perspective:</strong> {perspectiveOptions.find(p => p.value === formData.perspective)?.label || formData.perspective}</p>
                )}
                
                {formData.detailLevel !== 'medium' && (
                  <p><strong>Detail Level:</strong> {detailLevels.find(d => d.value === formData.detailLevel)?.label || formData.detailLevel}</p>
                )}
                
                {formData.specificFonts && formData.specificFonts.length > 0 && (
                  <p><strong>Specific Fonts:</strong> {formData.specificFonts.map(font =>
                    specificFontOptions.find(f => f.value === font)?.label || font
                  ).join(', ')}</p>
                )}
                
                {formData.brandColors && (
                  <p><strong>Brand Colors:</strong> {formData.brandColors}</p>
                )}
              </div>
              
              <div className="preview-section">
                <h5>Technical Details</h5>
                <p><strong>Size:</strong> {sizes.find(s => s.value === formData.size)?.label || formData.size}</p>
              </div>
              
              <div className="prompt-preview">
                <h5>AI Prompt Preview</h5>
                <p>{constructPrompt()}</p>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="wizard-form-container">
      <div className="wizard-header">
        <h2>{formData.generatorMode === 'advertisement' ? 'Design Your Advertisement' : 'Design Your Logo'}</h2>
        <button
          type="button"
          className="switch-form-button"
          onClick={onSwitchToSimple}
        >
          Switch to Simple Mode
        </button>
      </div>
      
      <p className="wizard-description">
        Create professional designs with our intuitive step-by-step wizard
      </p>
      
      <StepIndicator currentStep={currentStep} totalSteps={5} />
      
      <form className="wizard-form">
        {renderStep()}
        
        <div className="wizard-navigation">
          {currentStep > 0 && (
            <button 
              type="button" 
              className="back-button"
              onClick={handleBack}
              disabled={isLoading}
            >
              Back
            </button>
          )}
          
          <button 
            type="button" 
            className="next-button"
            onClick={handleNext}
            disabled={isLoading}
          >
            {currentStep === 4 ? (isLoading ? 'Generating...' : 'Generate') : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

WizardForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSwitchToSimple: PropTypes.func.isRequired
};

export default WizardForm;