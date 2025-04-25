# PixelMuse - AI-Powered Creative Design Studio

An application that generates advertisement images and logos using OpenAI's DALL-E model based on user descriptions and preferences.

## Features

- Generate custom advertisement images and logos using AI
- Advanced wizard interface with step-by-step guidance
- Customize designs with detailed options for typography, colors, and visual elements
- Choose between different styles, layouts, and photographic elements
- Dark/light mode theme support
- Responsive design for mobile and desktop
- Download generated images
- Simple and advanced modes for different user needs

## Tech Stack

- Vite.js
- React
- OpenAI API (DALL-E)
- CSS Variables for theming

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ad-generator.git
cd ad-generator
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### Simple Mode
1. Choose between advertisement or logo generation
2. Enter a detailed description of what you want to create
3. Select basic style and size options
4. Click "Generate Image"
5. Once the image is generated, you can download it using the "Download Image" button

### Wizard Mode
1. Click "Start Ad Wizard" to access the advanced interface
2. Follow the step-by-step process:
   - Basic Info: Choose between ad or logo and enter core details
   - Design Elements: Select color schemes, typography, and layout options
   - Content: Add headlines, descriptions, and calls to action
   - Advanced Options: Fine-tune with detailed settings for photography, visual elements, and more
   - Preview & Generate: Review your selections and generate your image
3. Download your custom-designed advertisement or logo

## Security Considerations

This application uses client-side API calls to OpenAI. For production use, consider implementing a backend proxy to securely handle API keys and requests.

## License

MIT

## Acknowledgements

- [OpenAI](https://openai.com/) for providing the DALL-E API
- [Vite.js](https://vitejs.dev/) for the frontend build tool
- [React](https://reactjs.org/) for the UI library
