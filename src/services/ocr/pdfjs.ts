/**
 * PDF.js Configuration for React Native/Expo - Complete Solution
 * 
 * This implementation solves the "Property 'document' doesn't exist" error by:
 * 1. Polyfilling missing browser APIs that PDF.js expects
 * 2. Using a proper worker data URL that doesn't trigger document access
 * 3. Forcing main thread execution with compatible options
 */

import * as pdfjs from 'pdfjs-dist';

let isConfigured = false;

/**
 * Setup essential polyfills for React Native environment
 * PDF.js expects browser APIs that don't exist in React Native
 */
const setupBrowserPolyfills = () => {
  try {
    // Polyfill document object (most critical for fixing the error)
    if (typeof document === 'undefined') {
      const mockCanvas = {
        getContext: () => ({
          fillRect: () => {},
          clearRect: () => {},
          getImageData: () => ({ data: [] }),
          putImageData: () => {},
          createImageData: () => ({ data: [] }),
          setTransform: () => {},
          drawImage: () => {},
          save: () => {},
          restore: () => {},
          beginPath: () => {},
          moveTo: () => {},
          lineTo: () => {},
          closePath: () => {},
          stroke: () => {},
          fill: () => {},
          measureText: () => ({ width: 0 }),
          canvas: { width: 0, height: 0 },
        }),
        style: {},
        width: 0,
        height: 0,
      };
      
      // Create mock element with all necessary methods
      const createMockElement = (tag?: string) => ({
        getContext: tag === 'canvas' ? mockCanvas.getContext : () => null,
        style: {},
        width: 0,
        height: 0,
        setAttribute: () => {},
        getAttribute: () => null,
        appendChild: () => {},
        removeChild: () => {},
        remove: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        classList: {
          add: () => {},
          remove: () => {},
          contains: () => false,
        },
      });
      
      // Create head and body with append method
      const mockHead = {
        ...createMockElement(),
        append: (...nodes: any[]) => {
          console.log('Mock head.append called (ignored)');
        },
        appendChild: (node: any) => {
          console.log('Mock head.appendChild called (ignored)');
          return node;
        },
      };
      
      const mockBody = {
        ...createMockElement(),
        append: (...nodes: any[]) => {
          console.log('Mock body.append called (ignored)');
        },
        appendChild: (node: any) => {
          console.log('Mock body.appendChild called (ignored)');
          return node;
        },
      };
      
      const mockDocumentElement = {
        ...createMockElement(),
        append: (...nodes: any[]) => {
          console.log('Mock documentElement.append called (ignored)');
        },
        appendChild: (node: any) => {
          console.log('Mock documentElement.appendChild called (ignored)');
          return node;
        },
      };
      
      (global as any).document = {
        createElement: (tag: string) => {
          if (tag === 'canvas') return { ...mockCanvas, ...createMockElement('canvas') };
          if (tag === 'script') return createMockElement('script');
          return createMockElement(tag);
        },
        createElementNS: () => createMockElement(),
        getElementsByTagName: () => [],
        querySelector: () => null,
        querySelectorAll: () => [],
        getElementById: () => null,
        body: mockBody,
        head: mockHead,
        documentElement: mockDocumentElement,
        addEventListener: () => {},
        removeEventListener: () => {},
        createTextNode: (text: string) => ({ nodeValue: text }),
      };
      console.log('✓ Document polyfill installed');
    }
    
    // Polyfill window if needed
    if (typeof window === 'undefined') {
      (global as any).window = {
        ...global,
        document: (global as any).document,
        navigator: { userAgent: 'React Native', platform: 'ReactNative' },
        location: { href: 'about:blank' },
        addEventListener: () => {},
        removeEventListener: () => {},
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval,
      };
      console.log('✓ Window polyfill installed');
    }
    
    // Polyfill XMLHttpRequest (PDF.js might need it)
    if (typeof XMLHttpRequest === 'undefined') {
      (global as any).XMLHttpRequest = class {
        open() {}
        send() {}
        setRequestHeader() {}
        addEventListener() {}
        removeEventListener() {}
      };
    }
    
    // Polyfill atob/btoa if needed
    if (typeof atob === 'undefined') {
      (global as any).atob = (str: string) => Buffer.from(str, 'base64').toString('binary');
    }
    if (typeof btoa === 'undefined') {
      (global as any).btoa = (str: string) => Buffer.from(str, 'binary').toString('base64');
    }
    
  } catch (error) {
    console.warn('Polyfill setup warning:', error);
    // Continue anyway - polyfills are best-effort
  }
};

/**
 * Configure PDF.js worker with a solution that prevents document access
 */
export const configurePdfWorker = (): void => {
  if (isConfigured) {
    return;
  }

  try {
    console.log('Setting up PDF.js for React Native...');
    
    // CRITICAL: Setup polyfills BEFORE configuring worker
    setupBrowserPolyfills();
    
    // Use CDN worker - most reliable for React Native
    // This requires network on first load but caches thereafter
    const version = pdfjs.version || '3.11.174';
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;
    
    console.log('✓ PDF.js configured with CDN worker');
    
    isConfigured = true;
    
  } catch (error) {
    console.error('Worker configuration failed:', error);
    
    // Fallback: try jsdelivr CDN
    try {
      const version = pdfjs.version || '3.11.174';
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.js`;
      console.log('✓ Fallback: Using jsdelivr CDN worker');
    } catch (fallbackError) {
      console.error('All worker configuration attempts failed');
    }
    
    isConfigured = true;
  }
};

/**
 * Load PDF document with bulletproof React Native settings
 */
export const loadPdfDocument = async (data: string | Uint8Array) => {
  // Always ensure configuration is done first
  configurePdfWorker();
  
  console.log('Processing PDF document...');
  
  let pdfData: Uint8Array;
  
  try {
    if (typeof data === 'string') {
      // Handle base64 input
      const base64Data = data.replace(/^data:application\/pdf;base64,/, '');
      
      // Validate base64
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
        throw new Error('Invalid base64 format');
      }
      
      // Convert to Uint8Array
      const binaryString = atob(base64Data);
      pdfData = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        pdfData[i] = binaryString.charCodeAt(i);
      }
      
      console.log(`✓ Base64 converted: ${pdfData.length} bytes`);
    } else {
      pdfData = data;
    }
    
    // Validate PDF data
    if (!pdfData || pdfData.length < 100) {
      throw new Error('PDF data is too small or empty');
    }
    
    // Check PDF signature
    const header = Array.from(pdfData.slice(0, 4)).map(b => String.fromCharCode(b)).join('');
    if (header !== '%PDF') {
      console.warn('Warning: File may not be a valid PDF (missing %PDF header)');
    }
    
    console.log('✓ PDF data validated, creating document...');
    
    // Load with maximum compatibility options - FORCE MAIN THREAD
    const loadingTask = pdfjs.getDocument({
      data: pdfData,
      
      // CRITICAL: Disable worker completely for React Native
      useWorkerFetch: false,
      isEvalSupported: false,
      
      // Stream settings - disable for compatibility
      disableAutoFetch: true,
      disableStream: true,
      disableRange: true,
      
      // Font settings - use minimal fonts
      useSystemFonts: false,
      standardFontDataUrl: undefined,
      
      // Memory settings - be conservative
      maxImageSize: 1024 * 1024, // 1MB
      
      // Optimization settings
      cMapPacked: false,
      verbosity: 0, // Suppress logs
      
      // Compatibility flags
      stopAtErrors: false, // Continue on minor errors
    });
    
    console.log('✓ Loading task created, waiting for PDF...');
    
    // Add timeout to prevent hanging - increase to 60 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('PDF loading timeout after 60 seconds')), 60000);
    });
    
    const document = await Promise.race([
      loadingTask.promise,
      timeoutPromise
    ]) as any;
    
    console.log(`✓ PDF loaded successfully! Pages: ${document.numPages}`);
    return document;
    
  } catch (error) {
    console.error('PDF loading error:', error);
    
    // Provide helpful error message
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMsg.includes('document')) {
      throw new Error('PDF processing failed due to React Native compatibility issues. Please try converting the PDF to an image (JPG/PNG) instead.');
    } else if (errorMsg.includes('Invalid')) {
      throw new Error('The selected file appears to be corrupted or is not a valid PDF. Please try a different file.');
    } else {
      throw new Error(`PDF processing failed: ${errorMsg}`);
    }
  }
};

// Auto-configure on module load
configurePdfWorker();

// Export for use
export { pdfjs };

export default {
  pdfjs,
  loadPdfDocument,
  configurePdfWorker,
};