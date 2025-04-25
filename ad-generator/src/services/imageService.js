import axios from 'axios';

// OpenAI API configuration
const API_URL = 'https://api.openai.com/v1/images/generations';

/**
 * Generate an image using OpenAI's DALL-E model
 * @param {Object} params - Parameters for image generation
 * @param {string} params.prompt - The text prompt to generate an image from
 * @param {string} params.size - Image size (e.g., '1024x1024', '512x512')
 * @param {number} params.n - Number of images to generate (default: 1)
 * @returns {Promise<Object>} - The generated image data
 */
export const generateImage = async (params) => {
  try {
    // Get API key from environment variables
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      // For demo purposes, return a placeholder image if no API key is provided
      console.warn('No OpenAI API key provided. Using placeholder image.');
      return {
        data: [
          {
            url: 'https://placehold.co/1024x1024/3a86ff/ffffff?text=API+Key+Required',
            revised_prompt: 'This is a placeholder image. Please add your OpenAI API key to .env.local file.'
          }
        ]
      };
    }
    
    // Only use the parameters that are valid for the OpenAI API
    // Based on curl.txt, these are: model, prompt, n, and size
    
    // Validate size parameter - only allow supported sizes
    const supportedSizes = ['1024x1024', '1024x1536', '1536x1024'];
    let size = params.size || '1024x1024';
    
    // If size is not supported, default to 1024x1024
    if (!supportedSizes.includes(size)) {
      console.warn(`Unsupported size: ${size}. Defaulting to 1024x1024.`);
      size = '1024x1024';
    }
    
    const validParams = {
      model: "gpt-image-1",
      n: 1,
      size: size,
    };
    
    // Enhance the prompt if it's too short or generic
    let enhancedPrompt = params.prompt;
    if (params.prompt && params.prompt.length < 100 && !params.prompt.includes('style') && !params.prompt.includes('color scheme')) {
      enhancedPrompt += " Create a high-quality, professional image with attention to detail.";
    }
    
    // Create the final request parameters with only valid fields
    const requestParams = {
      ...validParams,
      prompt: enhancedPrompt,
    };
    
    // Log the exact request parameters being sent to the API
    console.log('🔍 DEBUG - Final API request parameters:', JSON.stringify(requestParams, null, 2));
    console.log('🔍 DEBUG - Sending request to:', API_URL);
    
    // Make API request
    const response = await axios.post(API_URL, requestParams, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    
    // Log the complete raw response
    console.log('🔍 DEBUG - Complete raw response:', response);
    
    // Log response status and headers
    console.log('🔍 DEBUG - Response status:', response.status);
    console.log('🔍 DEBUG - Response headers:', response.headers);
    
    // Log the raw response data
    console.log('🔍 DEBUG - Raw response data:', JSON.stringify(response.data, null, 2));
    
    // Check the structure of the response data
    console.log('🔍 DEBUG - Response data type:', typeof response.data);
    console.log('🔍 DEBUG - Response data has data property:', Boolean(response.data.data));
    
    if (response.data.data) {
      console.log('🔍 DEBUG - Data array length:', response.data.data.length);
      console.log('🔍 DEBUG - First data item:', response.data.data[0]);
      
      if (response.data.data[0]) {
        console.log('🔍 DEBUG - URL exists:', Boolean(response.data.data[0].url));
        console.log('🔍 DEBUG - b64_json exists:', Boolean(response.data.data[0].b64_json));
        
        // If b64_json exists, convert it to a data URL
        if (response.data.data[0].b64_json) {
          console.log('🔍 DEBUG - Using b64_json data');
          // Create a data URL from the base64 string
          response.data.data[0].url = `data:image/png;base64,${response.data.data[0].b64_json}`;
          console.log('🔍 DEBUG - Created data URL from b64_json');
          
          // Log the first 50 characters of the base64 string to verify format
          const b64Preview = response.data.data[0].b64_json.substring(0, 50) + '...';
          console.log('🔍 DEBUG - Base64 preview:', b64Preview);
        } else if (response.data.data[0].url) {
          console.log('🔍 DEBUG - URL value:', response.data.data[0].url);
        } else {
          console.warn('🔍 DEBUG - Neither URL nor b64_json found in response');
        }
      }
    }
    
    return response.data;
  } catch (error) {
    // Log the complete error object
    console.error('🔍 DEBUG - Error in generateImage:', error);
    
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      
      console.error('🔍 DEBUG - API Error Response:', {
        status,
        statusText: error.response.statusText,
        data: JSON.stringify(data, null, 2),
        headers: error.response.headers
      });
      
      if (status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI API key.');
      } else if (status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (status === 400) {
        // For 400 errors, extract the specific parameter error
        const errorMessage = data.error?.message || 'Invalid request parameters';
        console.error('🔍 DEBUG - API 400 Error:', errorMessage);
        
        // Check for specific parameter errors
        if (errorMessage.includes('Invalid value:')) {
          console.error('🔍 DEBUG - Invalid parameter value detected');
        } else if (errorMessage.includes('Unknown parameter:')) {
          console.error('🔍 DEBUG - Unknown parameter detected');
        }
        
        throw new Error(`API Error: ${errorMessage}`);
      } else {
        const errorMessage = data.error?.message || 'Error generating image. Please try again.';
        console.error('🔍 DEBUG - Error message:', errorMessage);
        throw new Error(errorMessage);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('🔍 DEBUG - No response received:', error.request);
      throw new Error('No response from OpenAI API. Please check your internet connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('🔍 DEBUG - Request setup error:', error.message);
      throw error;
    }
  }
};

/**
 * Download an image from a URL or data URL
 * @param {string} url - The URL or data URL of the image to download
 * @param {string} filename - The filename to save the image as
 */
export const downloadImage = (url, filename = 'generated-ad.png') => {
  console.log('🔍 DEBUG - Starting image download from URL:', url.substring(0, 50) + '...');
  
  // Check if the URL is a data URL (base64)
  if (url.startsWith('data:image')) {
    console.log('🔍 DEBUG - Detected data URL, processing directly');
    try {
      // For data URLs, we can create the download link directly
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('🔍 DEBUG - Download initiated successfully from data URL');
      return Promise.resolve(true);
    } catch (error) {
      console.error('🔍 DEBUG - Error downloading image from data URL:', error);
      return Promise.reject(new Error('Failed to download image. Please try again.'));
    }
  }
  
  // For regular URLs, use fetch as before
  return fetch(url)
    .then(response => {
      console.log('🔍 DEBUG - Download response status:', response.status);
      console.log('🔍 DEBUG - Download response headers:', response.headers);
      
      if (!response.ok) {
        console.error('🔍 DEBUG - Download response not OK:', response);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return response.blob();
    })
    .then(blob => {
      console.log('🔍 DEBUG - Blob received:', {
        size: blob.size,
        type: blob.type
      });
      
      const blobUrl = URL.createObjectURL(blob);
      console.log('🔍 DEBUG - Blob URL created:', blobUrl);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      
      console.log('🔍 DEBUG - Download initiated successfully');
      return true;
    })
    .catch(error => {
      console.error('🔍 DEBUG - Error downloading image:', error);
      throw new Error('Failed to download image. Please try again.');
    });
};

export default {
  generateImage,
  downloadImage
};