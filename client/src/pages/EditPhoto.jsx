import React, { useRef, useState, useCallback, useEffect } from 'react';
import { FaUpload, FaSlidersH, FaCrop, FaMagic, FaUndo, FaRedo, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import '../assets/styles/edit-photo.css';
import {FaTrash, FaPaintBrush, FaHeadphones, FaInbox, FaHistory, FaTree, FaSnowflake, FaStar, FaWaveSquare, FaAdjust, FaMountain, FaHeart, FaBolt, FaUmbrellaBeach, FaRegMoon, FaFire } from "react-icons/fa";


const STORAGE_KEY = 'robeautify_editor_state';
const SESSION_KEY = 'robeautify_current_image'; // Key for session storage
const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB
const CROP_HANDLE_SIZE = 10;
const CROP_MIN_SIZE = 50;

const EditPhoto = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Încarcă starea salvată din localStorage dacă există
  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  const [isCropping, setIsCropping] = useState(false);
  const [cropStart, setCropStart] = useState(null);
  const [cropRect, setCropRect] = useState(null);
  const [cropResizeHandle, setCropResizeHandle] = useState(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState(savedState?.history || []);
  const [historyIndex, setHistoryIndex] = useState(savedState?.historyIndex || -1);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [image, setImage] = useState(savedState?.image ? (() => {
    const img = new Image();
    img.src = savedState.image;
    return img;
  }) : null);
  const [processedImage, setProcessedImage] = useState(savedState?.processedImage ? (() => {
    const img = new Image();
    img.src = savedState.processedImage;
    return img;
  }) : null);
  const [activeTab, setActiveTab] = useState(null);
  const [filters, setFilters] = useState(savedState?.filters || {
    blackWhite: false,
    noise: false,
    sharpen: false,
    sepia: false,
    vintage: false,
    invert: false,  
    gotham: false,
    lofi: false, 
    pastel: false,
    hudson: false,
    amaro: false,
    xpro: false,
    sierra: false,
    valencia: false,
    moon: false,
    robeautify: false
  });
  const [tools, setTools] = useState(savedState?.tools || {
  crop: false,
  aspectRatio: 'original',
  rotate: 0, 
  cropRect: null
});
  const [edits, setEdits] = useState(savedState?.edits || {
    exposure: 0,
    contrast: 0,
    saturation: 0,
    temperature: 0
  });

  // Funcție helper pentru a adăuga o nouă stare în istoric
const addToHistory = (currentState) => {
  const newHistory = history.slice(0, historyIndex + 1);
  newHistory.push(currentState);
  setHistory(newHistory);
  setHistoryIndex(newHistory.length - 1);
};

  // Salvează starea în localStorage când se modifică
  useEffect(() => {
    if (image && historyIndex === history.length - 1) {
      const stateToSave = {
        // Don't store the full image data in localStorage
        image: null, // We'll remove this
        processedImage: null, // And this
        history: history.map(item => ({
          ...item,
          image: null, // Remove image data from history
          processedImage: null
        })),
        historyIndex,
        filters,
        tools,
        edits
      };
  
      // Check if the data is too large before saving
      const dataString = JSON.stringify(stateToSave);
      if (dataString.length < MAX_STORAGE_SIZE) {
        localStorage.setItem(STORAGE_KEY, dataString);
      } else {
        console.warn('Editor state too large for localStorage - not saving');
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [image, processedImage, history, historyIndex, filters, tools, edits]);
  
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  // Initialize canvas with willReadFrequently
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      // Cleanup function
      return () => {
        // Clear the canvas when component unmounts
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      };
    }
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      loadImage(file);
    } else {
      alert('Please select a valid image file (JPEG, PNG, etc.)');
    }
  };

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Handle drop event
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.match('image.*')) {
        loadImage(file);
      } else {
        alert('Please drop a valid image file (JPEG, PNG, etc.)');
      }
    }
  }, []);

  // Load image and display it
  const loadImage = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Calculate dimensions while maintaining aspect ratio
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;
  
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
  
        // Create a temporary canvas to resize the image
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(img, 0, 0, width, height);
  
        // Set the image data and update the main canvas
        const resizedImg = new Image();
        resizedImg.onload = () => {
          setImage(resizedImg);
          sessionStorage.setItem(SESSION_KEY, tempCanvas.toDataURL('image/jpeg'));
          
          const initialState = {
            image: null,
            filters: { ...filters },
            tools: { ...tools },
            edits: { ...edits }
          };
          
          setHistory([initialState]);
          setHistoryIndex(0);
          
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(resizedImg, 0, 0, width, height);
          }
        };
        resizedImg.src = tempCanvas.toDataURL('image/jpeg');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };


  // Apply all selected effects to the image
  const applyAllEffects = useCallback((img) => {
    if (!img || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Reset canvas to original image
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    // Apply filters if enabled
    if (filters.blackWhite) applyBlackWhiteFilter(ctx, canvas.width, canvas.height);
    if (filters.noise) applyNoiseFilter(ctx, canvas.width, canvas.height);
    if (filters.sharpen) applySharpenFilter(ctx, canvas.width, canvas.height);
    if (filters.sepia) applySepiaFilter(ctx, canvas.width, canvas.height);
    if (filters.vintage) applyVintageFilter(ctx, canvas.width, canvas.height);
    if (filters.invert) applyInvertFilter(ctx, canvas.width, canvas.height);
    if (filters.gotham) applyGothamFilter(ctx, canvas.width, canvas.height);
    if (filters.lofi) applyLofiFilter(ctx, canvas.width, canvas.height);
    if (filters.pastel) applyPastelFilter(ctx, canvas.width, canvas.height);
    if (filters.hudson) applyHudsonFilter(ctx, canvas.width, canvas.height);
    if (filters.amaro) applyAmaroFilter(ctx, canvas.width, canvas.height);
    if (filters.xpro) applyXProFilter(ctx, canvas.width, canvas.height);
    if (filters.sierra) applySierraFilter(ctx, canvas.width, canvas.height);
    if (filters.valencia) applyValenciaFilter(ctx, canvas.width, canvas.height);
    if (filters.moon) applyMoonFilter(ctx, canvas.width, canvas.height);
    if (filters.robeautify) applyRobeautifyFilter(ctx, canvas.width, canvas.height);
    
    // Apply edits
    applyEdits(ctx, canvas.width, canvas.height);
    
    // Update processed image
    const dataUrl = canvas.toDataURL('image/jpeg');
    const processedImg = new Image();
    processedImg.onload = () => {
      setProcessedImage(processedImg);
    };
    processedImg.src = dataUrl;
  }, [filters, tools, edits, image, historyIndex, history]);

  // Aplică efectele când se schimbă starea
  useEffect(() => {
    // Doar aplică efectele dacă avem o imagine și suntem la ultima stare din istorie
    if (image && historyIndex === history.length - 1) {
      applyAllEffects(image);
    }
  }, [filters, tools, edits, image, historyIndex, history]);

  // Update history after effects are applied
  useEffect(() => {
    // If we have a saved processed image, use that
    if (processedImage) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = processedImage.width;
        canvas.height = processedImage.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(processedImage, 0, 0);
      }
      return;
    }
  
    // Otherwise apply effects normally
    if (image && historyIndex === history.length - 1) {
      applyAllEffects(image);
    }
  }, [image, processedImage, historyIndex, history, applyAllEffects]);


  // În useEffect-ul de încărcare a stării salvate:
useEffect(() => {
  const loadSavedState = async () => {
    const savedImage = sessionStorage.getItem(SESSION_KEY);
    if (savedImage) {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
        }
      };
      img.src = savedImage;
    }

    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (savedState) {
      setFilters(savedState.filters || {});
      setEdits(savedState.edits || {});
      
      // Restaurăm corect starea tools, inclusiv cropRect
      const restoredTools = {
        crop: savedState.tools?.crop || false,
        aspectRatio: savedState.tools?.aspectRatio || 'original',
        rotate: savedState.tools?.rotate || 0,
        cropRect: savedState.tools?.cropRect || null
      };
      setTools(restoredTools);
      
      // Restaurăm cropRect doar dacă există
      if (restoredTools.crop && restoredTools.cropRect) {
        setCropRect(restoredTools.cropRect);
      }

      setHistory(savedState.history || []);
      setHistoryIndex(savedState.historyIndex || 0);
    }
  };

  loadSavedState();
}, []);


  // Apply black and white filter
  const applyBlackWhiteFilter = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;     // R
      data[i + 1] = avg; // G
      data[i + 2] = avg; // B
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  // Apply noise filter
  const applyNoiseFilter = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 50 - 25;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  // Apply sharpen filter
  const applySharpenFilter = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.putImageData(imageData, 0, 0);
    
    ctx.filter = 'contrast(1.2)';
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.filter = 'none';
  };

  // Apply sepia filter
const applySepiaFilter = (ctx, width, height) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
    data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
    data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
  }
  
  ctx.putImageData(imageData, 0, 0);
};

// Apply vintage filter
const applyVintageFilter = (ctx, width, height) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] *= 0.9;     // Reduce red
    data[i + 1] *= 0.8; // Reduce green more
    data[i + 2] *= 0.5; // Reduce blue the most
    data[i + 1] += 20;  // Add slight green tint
  }
  
  ctx.putImageData(imageData, 0, 0);
};

// Apply invert filter
const applyInvertFilter = (ctx, width, height) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];     // Red
    data[i + 1] = 255 - data[i + 1]; // Green
    data[i + 2] = 255 - data[i + 2]; // Blue
  }
  
  ctx.putImageData(imageData, 0, 0);
};

// Apply Gotham filter (dark, high-contrast with muted blues)
const applyGothamFilter = (ctx, width, height) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Contrast extrem
    const contrastFactor = 1.4;
    data[i] = 128 + (data[i] - 128) * contrastFactor;     // Red
    data[i + 1] = 128 + (data[i + 1] - 128) * contrastFactor; // Green
    data[i + 2] = 128 + (data[i + 2] - 128) * contrastFactor; // Blue

    // Tonuri întunecate (redu verde, accentuează albastru închis)
    data[i] *= 0.9;
    data[i + 1] *= 0.85;
    data[i + 2] = Math.min(220, data[i + 2] * 1.1); // Albastru profund dar nu prea strident

    // Umbre adânci
    if (data[i] + data[i + 1] + data[i + 2] < 300) {
      data[i] *= 0.8;
      data[i + 1] *= 0.8;
      data[i + 2] *= 0.9;
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

// Apply Lofi filter (low-contrast, muted earthy tones)
const applyLofiFilter = (ctx, width, height) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Reduce contrast
    const r = data[i], g = data[i + 1], b = data[i + 2];
    data[i] = r * 0.8 + 40;     // Warm red reduction
    data[i + 1] = g * 0.85 + 30; // Green reduction
    data[i + 2] = b * 0.7 + 20;  // Heavy blue reduction
    
    // Add slight grain
    const grain = Math.random() * 10 - 5;
    data[i] += grain;
    data[i + 1] += grain;
    data[i + 2] += grain;
  }

  ctx.putImageData(imageData, 0, 0);
};

// Apply Pastel filter (soft desaturated colors)
const applyPastelFilter = (ctx, width, height) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Desaturate
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg * 0.7 + data[i] * 0.3;     // Soft red
    data[i + 1] = avg * 0.7 + data[i + 1] * 0.3; // Soft green
    data[i + 2] = avg * 0.7 + data[i + 2] * 0.3; // Soft blue
    
    // Brighten
    data[i] = Math.min(255, data[i] * 1.1);
    data[i + 1] = Math.min(255, data[i + 1] * 1.1);
    data[i + 2] = Math.min(255, data[i + 2] * 1.1);
  }

  ctx.putImageData(imageData, 0, 0);
};

// Apply Hudson filter (cool tones with soft contrast)
const applyHudsonFilter = (ctx, width, height) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] *= 0.9;     // Reduce red
    data[i + 1] *= 0.95; 
    data[i + 2] = Math.min(255, data[i + 2] * 1.1); // Boost blue
    
    // Soft contrast
    const factor = (259 * (128 + 20)) / (255 * (259 - 20));
    data[i] = factor * (data[i] - 128) + 128;
    data[i + 1] = factor * (data[i + 1] - 128) + 128;
    data[i + 2] = factor * (data[i + 2] - 128) + 128;
  }

  ctx.putImageData(imageData, 0, 0);
};

// Apply Amaro filter (bright with pink tint)
const applyAmaroFilter = (ctx, width, height) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Brightness
    data[i] = Math.min(255, data[i] * 1.15);
    data[i + 1] = Math.min(255, data[i + 1] * 1.1);
    data[i + 2] = Math.min(255, data[i + 2] * 0.95);
    
    // Pink tint
    data[i] = Math.min(255, data[i] * 1.05);
    data[i + 2] = Math.min(255, data[i + 2] * 1.05);
  }

  ctx.putImageData(imageData, 0, 0);
};

// Apply X-Pro filter (cross-processing effect)
const applyXProFilter = (ctx, width, height) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Boost saturation
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg + 1.5 * (data[i] - avg);
    data[i + 1] = avg + 1.3 * (data[i + 1] - avg);
    data[i + 2] = avg + 1.1 * (data[i + 2] - avg);
    
    // Vignette
    const x = (i / 4) % width;
    const y = Math.floor((i / 4) / width);
    const vignette = 1 - Math.sqrt(Math.pow(x - width/2, 2) + Math.pow(y - height/2, 2)) / (width * 0.7);
    data[i] *= vignette;
    data[i + 1] *= vignette;
    data[i + 2] *= vignette;
  }

  ctx.putImageData(imageData, 0, 0);
};

// Apply Sierra filter (warm sunset tones)
const applySierraFilter = (ctx, width, height) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Boost warm tones (red and orange)
    data[i] = Math.min(255, data[i] * 1.2);     // Increase red
    data[i+1] = Math.min(255, data[i+1] * 0.9); // Slightly reduce green
    data[i+2] = Math.min(255, data[i+2] * 0.8); // Reduce blue more
    
    // Add slight vignette effect
    const x = (i / 4) % width;
    const y = Math.floor((i / 4) / width);
    const centerX = width / 2;
    const centerY = height / 2;
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const vignette = 1 - (distance / (width * 0.6)) * 0.3;
    
    data[i] *= vignette;
    data[i+1] *= vignette;
    data[i+2] *= vignette;
  }

  ctx.putImageData(imageData, 0, 0);
};

// Apply Valencia filter (partial desaturation with yellow highlights)
const applyValenciaFilter = (ctx, width, height) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Partial desaturation
    const avg = (data[i] + data[i+1] + data[i+2]) / 3;
    data[i] = avg * 0.3 + data[i] * 0.7;     // Keep some red
    data[i+1] = avg * 0.3 + data[i+1] * 0.7; // Keep some green
    data[i+2] = avg * 0.4 + data[i+2] * 0.6; // Desaturate blue more
    
    // Add warm yellow tint
    data[i] = Math.min(255, data[i] * 1.1);   // Boost red
    data[i+1] = Math.min(255, data[i+1] * 1.05); // Slightly boost green
    data[i+2] = Math.min(255, data[i+2] * 0.9);  // Reduce blue
    
    // Brighten highlights
    const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
    if (brightness > 150) {
      data[i] = Math.min(255, data[i] * 1.1);
      data[i+1] = Math.min(255, data[i+1] * 1.1);
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

// Apply Moon filter (blue-white lunar effect)
const applyMoonFilter = (ctx, width, height) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Convert to grayscale first
    const avg = (data[i] + data[i+1] + data[i+2]) / 3;
    
    // Apply blue-white tint (cool tones)
    data[i] = Math.min(255, avg * 0.9);      // Reduce red
    data[i+1] = Math.min(255, avg * 0.95);   // Slightly reduce green
    data[i+2] = Math.min(255, avg * 1.1);    // Boost blue
    
    // Increase contrast
    const factor = (259 * (128 + 30)) / (255 * (259 - 30));
    data[i] = factor * (data[i] - 128) + 128;
    data[i+1] = factor * (data[i+1] - 128) + 128;
    data[i+2] = factor * (data[i+2] - 128) + 128;
  }

  ctx.putImageData(imageData, 0, 0);
};

// Apply Robeautify filter (light pink with hearts & sparkles)
const applyRobeautifyFilter = (ctx, width, height) => {
  // Create a working canvas with willReadFrequently
  const workingCanvas = document.createElement('canvas');
  workingCanvas.width = width;
  workingCanvas.height = height;
  const workingCtx = workingCanvas.getContext('2d', { willReadFrequently: true });
  workingCtx.drawImage(ctx.canvas, 0, 0);

  const imageData = workingCtx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // 1. Apply soft light pink tint (lower exposure)
  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
    
    // Soft pink tint (reduced exposure by limiting brightness boost)
    data[i] = Math.min(230, data[i] * 1.08);     // Slight red
    data[i+1] = Math.min(220, data[i+1] * 0.85); // Reduce green
    data[i+2] = Math.min(230, data[i+2] * 1.05); // Slight blue

    // Lighten shadows gently (softer than before)
    if (brightness < 100) {
      const lift = (100 - brightness) / 100 * 15;
      data[i] += lift * 0.8;
      data[i+1] += lift * 0.6;
      data[i+2] += lift * 0.7;
    }
  }
  workingCtx.putImageData(imageData, 0, 0);

  // 2. Draw hearts & sparkles on a new layer
  const decorCanvas = document.createElement('canvas');
  decorCanvas.width = width;
  decorCanvas.height = height;
  const decorCtx = decorCanvas.getContext('2d');
  
  // Settings
  const decorDensity = 0.002; // Fewer elements for subtlety
  const sizes = [1.2, 1.5, 1.8]; // Varied sizes
  
  for (let x = 0; x < width; x += 2) {
    for (let y = 0; y < height; y += 2) {
      if (Math.random() < decorDensity) {
        const pixel = workingCtx.getImageData(x, y, 1, 1).data;
        const brightness = (pixel[0] + pixel[1] + pixel[2]) / 3;
        
        if (brightness > 170) { // Only in bright areas
          decorCtx.save();
          decorCtx.translate(x, y);
          
          // Alternate between hearts and sparkles
          if (Math.random() > 0.3) { // 30% hearts
            const size = sizes[Math.floor(Math.random() * sizes.length)];
            decorCtx.fillStyle = `rgba(255, 220, 230, ${0.5 + Math.random() * 0.3})`;
            drawHeart(decorCtx, 0, 0, size);
          } else { // 70% sparkles
            const size = sizes[Math.floor(Math.random() * sizes.length)];
            decorCtx.fillStyle = `rgba(255, 255, 255, ${0.6 + Math.random() * 0.3})`;
            drawSparkle(decorCtx, 0, 0, size);
          }
          
          decorCtx.restore();
        }
      }
    }
  }

  // 3. Merge everything back
  ctx.globalCompositeOperation = 'lighter';
  ctx.drawImage(decorCanvas, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  
  // 4. Final soft pink overlay (very subtle)
  ctx.fillStyle = 'rgba(248, 110, 170, 0.2)';
  ctx.fillRect(0, 0, width, height);

  // Helper functions
  function drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y + size/4);
    ctx.bezierCurveTo(x, y, x - size/2, y, x - size/2, y + size/4);
    ctx.bezierCurveTo(x - size/2, y + size/2, x, y + size, x, y + size);
    ctx.bezierCurveTo(x, y + size, x + size/2, y + size/2, x + size/2, y + size/4);
    ctx.bezierCurveTo(x + size/2, y, x, y, x, y + size/4);
    ctx.fill();
  }

  function drawSparkle(ctx, x, y, size) {
    const spikes = 5 + Math.floor(Math.random() * 3);
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? size : size * 0.4;
      const angle = (i * Math.PI) / spikes;
      ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
    }
    ctx.closePath();
    ctx.fill();
  }
};

  // Apply all edit adjustments
const applyEdits = (ctx, width, height) => {
  const adjustments = [];
  
  if (edits.exposure !== 0) {
    adjustments.push(`brightness(${1 + edits.exposure / 100})`);
  }
  if (edits.contrast !== 0) {
    adjustments.push(`contrast(${1 + edits.contrast / 100})`);
  }
  
  if (adjustments.length > 0) {
    ctx.filter = adjustments.join(' ');
    ctx.drawImage(canvasRef.current, 0, 0, width, height, 0, 0, width, height);
    ctx.filter = 'none';
  }

  // Apply saturation and temperature
  if (edits.saturation !== 0 || edits.temperature !== 0) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      // Apply saturation
      if (edits.saturation !== 0) {
        const gray = 0.2989 * data[i] + 0.5870 * data[i+1] + 0.1140 * data[i+2];
        data[i] = gray + (data[i] - gray) * (1 + edits.saturation / 100);
        data[i+1] = gray + (data[i+1] - gray) * (1 + edits.saturation / 100);
        data[i+2] = gray + (data[i+2] - gray) * (1 + edits.saturation / 100);
      }
      
      // Apply temperature
      if (edits.temperature !== 0) {
        if (edits.temperature > 0) {
          // Warm (add red, reduce blue)
          data[i] += edits.temperature * 2.55;
          data[i+2] -= edits.temperature * 2.55;
        } else {
          // Cool (add blue, reduce red)
          data[i] += edits.temperature * 2.55;
          data[i+2] -= edits.temperature * 2.55;
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }
};

// Crop functionality
const handleMouseDown = (e) => {
  if (!tools.crop || !canvasRef.current) return;
  
  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // If we have a crop rectangle, check if we clicked on a handle
  const currentCrop = cropRect || {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height
  };
  
  const handle = getNearHandle(x, y, currentCrop);
  if (handle) {
    setCropResizeHandle(handle);
    setIsCropping(true);
    return;
  }
  
  // Otherwise start moving the entire crop rectangle
  if (isPointInRect(x, y, currentCrop)) {
    setCropStart({ x, y, startRect: { ...currentCrop } });
    setIsCropping(true);
  }
};

const handleMouseMove = (e) => {
  if (!tools.crop || !isCropping || !canvasRef.current || !image) return;
  
  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  if (cropResizeHandle) {
    // Resizing existing crop
    setCropRect(prev => resizeCropRect(
      prev || { x: 0, y: 0, width: image.width, height: image.height },
      cropResizeHandle, 
      x, 
      y, 
      tools.aspectRatio
    ));
  } else if (cropStart) {
    // Moving the entire crop rectangle
    const dx = x - cropStart.x;
    const dy = y - cropStart.y;
    
    setCropRect({
      x: cropStart.startRect.x + dx,
      y: cropStart.startRect.y + dy,
      width: cropStart.startRect.width,
      height: cropStart.startRect.height
    });
  }
};


const handleMouseUp = () => {
  setIsCropping(false);
  setCropResizeHandle(null);
};

const isPointInRect = (x, y, rect) => {
  return x >= rect.x && x <= rect.x + rect.width &&
         y >= rect.y && y <= rect.y + rect.height;
};

const getNearHandle = (x, y, rect) => {
  const handles = getHandles(rect);
  for (const handle of handles) {
    if (Math.sqrt(Math.pow(x - handle.x, 2) + Math.pow(y - handle.y, 2)) < 10) {
      return handle.type;
    }
  }
  return null;
};

const getHandles = (rect) => {
  if (!rect) return [];
  return [
    { type: 'nw', x: rect.x, y: rect.y },
    { type: 'ne', x: rect.x + rect.width, y: rect.y },
    { type: 'sw', x: rect.x, y: rect.y + rect.height },
    { type: 'se', x: rect.x + rect.width, y: rect.y + rect.height },
    { type: 'n', x: rect.x + rect.width/2, y: rect.y },
    { type: 's', x: rect.x + rect.width/2, y: rect.y + rect.height },
    { type: 'w', x: rect.x, y: rect.y + rect.height/2 },
    { type: 'e', x: rect.x + rect.width, y: rect.y + rect.height/2 }
  ];
};

const resizeCropRect = (rect, handle, mouseX, mouseY, aspectRatio) => {
  // Constrain mouse coordinates to image bounds
  mouseX = Math.max(0, Math.min(image.width, mouseX));
  mouseY = Math.max(0, Math.min(image.height, mouseY));

  let newRect = {...rect};
  const ratio = aspectRatio === 'custom' ? null : getAspectRatio(aspectRatio, image);

  // Calculate new rectangle based on handle
  switch (handle) {
    case 'nw':
      newRect.width = rect.width + rect.x - mouseX;
      newRect.height = rect.height + rect.y - mouseY;
      newRect.x = mouseX;
      newRect.y = mouseY;
      break;
    case 'ne':
      newRect.width = mouseX - rect.x;
      newRect.height = rect.height + rect.y - mouseY;
      newRect.y = mouseY;
      break;
    case 'sw':
      newRect.width = rect.width + rect.x - mouseX;
      newRect.height = mouseY - rect.y;
      newRect.x = mouseX;
      break;
    case 'se':
      newRect.width = mouseX - rect.x;
      newRect.height = mouseY - rect.y;
      break;
    case 'n':
      newRect.height = rect.height + rect.y - mouseY;
      newRect.y = mouseY;
      break;
    case 's':
      newRect.height = mouseY - rect.y;
      break;
    case 'w':
      newRect.width = rect.width + rect.x - mouseX;
      newRect.x = mouseX;
      break;
    case 'e':
      newRect.width = mouseX - rect.x;
      break;
  }

  // Enforce aspect ratio if needed
  if (ratio) {
    if (['nw','ne','sw','se','n','s'].includes(handle)) {
      newRect.width = newRect.height * ratio;
      if (handle.includes('e')) {
        newRect.x = rect.x + rect.width - newRect.width;
      }
    } else {
      newRect.height = newRect.width / ratio;
      if (handle.includes('s')) {
        newRect.y = rect.y + rect.height - newRect.height;
      }
    }
  }

  // Ensure minimum size
  if (newRect.width < CROP_MIN_SIZE) {
    newRect.width = CROP_MIN_SIZE;
    if (handle.includes('e')) {
      newRect.x = rect.x + rect.width - CROP_MIN_SIZE;
    } else if (handle.includes('w')) {
      newRect.x = mouseX;
    }
  }
  if (newRect.height < CROP_MIN_SIZE) {
    newRect.height = CROP_MIN_SIZE;
    if (handle.includes('s')) {
      newRect.y = rect.y + rect.height - CROP_MIN_SIZE;
    } else if (handle.includes('n')) {
      newRect.y = mouseY;
    }
  }

  // Constrain to image bounds
  if (newRect.x < 0) {
    newRect.width += newRect.x;
    newRect.x = 0;
  }
  if (newRect.y < 0) {
    newRect.height += newRect.y;
    newRect.y = 0;
  }
  if (newRect.x + newRect.width > image.width) {
    newRect.width = image.width - newRect.x;
  }
  if (newRect.y + newRect.height > image.height) {
    newRect.height = image.height - newRect.y;
  }

  // Final aspect ratio check
  if (ratio) {
    const actualRatio = newRect.width / newRect.height;
    if (Math.abs(actualRatio - ratio) > 0.01) {
      if (actualRatio > ratio) {
        newRect.width = newRect.height * ratio;
      } else {
        newRect.height = newRect.width / ratio;
      }
    }
  }

  return newRect;
};


const getHoverHandle = (x, y) => {
  if (!tools.crop || !cropRect) return null;
  
  const handles = getHandles(cropRect);
  const handleSize = 10; // Increased handle detection area
  
  for (const handle of handles) {
    if (Math.sqrt(Math.pow(x - handle.x, 2) + Math.pow(y - handle.y, 2)) < handleSize) {
      return handle.type;
    }
  }
  
  // If inside crop rect but not on a handle
  if (x >= cropRect.x && x <= cropRect.x + cropRect.width &&
      y >= cropRect.y && y <= cropRect.y + cropRect.height) {
    return 'move';
  }
  
  return null;
};

const getAspectRatio = (ratio, canvas) => {
  switch (ratio) {
    case 'original':
      return canvas ? canvas.width / canvas.height : 1;
    case '1:1':
      return 1;
    case '3:4':
      return 3/4;
    case '4:3':
      return 4/3;
    case '9:16':
      return 9/16;
    case '16:9':
      return 16/9;
    default:
      return null; // For custom
  }
};

const rotateImage = async (direction) => {
  if (!image) return;

  const angle = direction === 'left' ? -90 : 90;
  const newRotation = (tools.rotate + angle + 360) % 360;

  // Creăm canvas temporar
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');

  // Setăm dimensiunile corecte
  if (angle % 180 !== 0) {
    tempCanvas.width = image.height;
    tempCanvas.height = image.width;
  } else {
    tempCanvas.width = image.width;
    tempCanvas.height = image.height;
  }

  // Rotim imaginea
  tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
  tempCtx.rotate((angle * Math.PI) / 180);
  tempCtx.drawImage(image, -image.width / 2, -image.height / 2);

  // Actualizăm starea
  const rotatedImg = new Image();
  rotatedImg.onload = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Actualizăm canvas-ul principal
    canvas.width = rotatedImg.width;
    canvas.height = rotatedImg.height;
    ctx.drawImage(rotatedImg, 0, 0);

    // Actualizăm starea
    setImage(rotatedImg);
    setTools(prev => ({ ...prev, rotate: newRotation }));
    
    // Salvăm starea curentă în istoric
    addToHistory({
      image: canvas.toDataURL('image/jpeg'),
      filters: { ...filters },
      tools: { ...tools, rotate: newRotation },
      edits: { ...edits }
    });
  };
  rotatedImg.src = tempCanvas.toDataURL('image/jpeg');
};

const applyCrop = () => {
  if (!image || !cropRect || !canvasRef.current) return;

  const canvas = canvasRef.current;
  const { x, y, width, height } = cropRect;

  // Creăm canvas temporar
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);

  // Actualizăm starea
  const croppedImg = new Image();
  croppedImg.onload = () => {
    setImage(croppedImg);
    setCropRect(null);
    
    // Actualizăm canvas-ul principal
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(croppedImg, 0, 0);

    // Salvăm în localStorage și sessionStorage
    const dataUrl = canvas.toDataURL('image/jpeg');
    sessionStorage.setItem(SESSION_KEY, dataUrl);

    // Adăugăm în istoric
    addToHistory({
      image: dataUrl,
      filters: { ...filters },
      tools: { 
        ...tools, 
        crop: false,
        cropRect: null,
        rotate: 0 
      },
      edits: { ...edits }
    });
  };
  croppedImg.src = tempCanvas.toDataURL('image/jpeg');
};

  // Handle filter toggle - now applies immediately
  const toggleFilter = (filterName) => {
  const newFilters = { ...filters, [filterName]: !filters[filterName] };
  setFilters(newFilters);
  
  // Adăugăm în istoric după ce aplicăm modificarea
  addToHistory({
    image: canvasRef.current.toDataURL('image/jpeg'),
    filters: newFilters,
    tools: { ...tools },
    edits: { ...edits }
  });
};

  // Handle edit change
  const handleEditChange = (editName, value) => {
  const newEdits = { ...edits, [editName]: parseInt(value) };
  setEdits(newEdits);
  
  // Adăugăm în istoric
  addToHistory({
    image: canvasRef.current.toDataURL('image/jpeg'),
    filters: { ...filters },
    tools: { ...tools },
    edits: newEdits
  });
};

  const drawCropOverlay = (ctx, rect) => {
    // Darken outside area
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.fill('evenodd');
  
    // Draw crop border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    ctx.setLineDash([]);
  
    // Draw handles
    const handles = [
      { type: 'nw', x: rect.x, y: rect.y },
      { type: 'ne', x: rect.x + rect.width, y: rect.y },
      { type: 'sw', x: rect.x, y: rect.y + rect.height },
      { type: 'se', x: rect.x + rect.width, y: rect.y + rect.height },
      { type: 'n', x: rect.x + rect.width/2, y: rect.y },
      { type: 's', x: rect.x + rect.width/2, y: rect.y + rect.height },
      { type: 'w', x: rect.x, y: rect.y + rect.height/2 },
      { type: 'e', x: rect.x + rect.width, y: rect.y + rect.height/2 }
    ];
  
    ctx.fillStyle = '#ff69b4';
    handles.forEach(handle => {
      ctx.beginPath();
      ctx.arc(handle.x, handle.y, CROP_HANDLE_SIZE, 0, Math.PI * 2);
      ctx.fill();
    });
  };
  
  const redrawCanvasWithCrop = (cropRect) => {
    if (!image || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    applyAllEffects(image);
    
    if (tools.crop && cropRect) {
      drawCropOverlay(ctx, cropRect);
    }
  };

  // Handle tool change
  const handleToolChange = (toolName, value) => {
  const newTools = { ...tools, [toolName]: value };

  if (toolName === 'crop' && value && image) {
    // Calculăm dimensiunile inițiale în funcție de aspect ratio
    let width, height;
    const ratio = getAspectRatio(tools.aspectRatio, image);
    
    if (ratio) {
      // Calculăm dimensiunile în funcție de aspect ratio
      if (image.width / image.height > ratio) {
        height = image.height * 0.8;
        width = height * ratio;
      } else {
        width = image.width * 0.8;
        height = width / ratio;
      }
    } else {
      // Custom ratio - pătrat
      width = height = Math.min(image.width, image.height) * 0.8;
    }

    newTools.cropRect = {
      x: (image.width - width) / 2,
      y: (image.height - height) / 2,
      width,
      height
    };
    setCropRect(newTools.cropRect);
  } else if (toolName === 'aspectRatio' && tools.crop && image) {
    // Actualizăm crop rectangle când schimbăm aspect ratio
    const ratio = getAspectRatio(value, image);
    if (ratio && cropRect) {
      const centerX = cropRect.x + cropRect.width / 2;
      const centerY = cropRect.y + cropRect.height / 2;
      
      let newWidth, newHeight;
      if (cropRect.width / cropRect.height > ratio) {
        newHeight = cropRect.height;
        newWidth = newHeight * ratio;
      } else {
        newWidth = cropRect.width;
        newHeight = newWidth / ratio;
      }

      setCropRect({
        x: centerX - newWidth / 2,
        y: centerY - newHeight / 2,
        width: newWidth,
        height: newHeight
      });
    }
  }

  setTools(newTools);
};

  // Reset all edits
  const resetEdits = () => {
  if (!image || !canvasRef.current) return;

  // Reîncărcăm imaginea originală din sessionStorage
  const savedImage = sessionStorage.getItem(SESSION_KEY);
  if (!savedImage) return;

  const originalImg = new Image();
  originalImg.onload = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Resetăm canvas-ul
    canvas.width = originalImg.width;
    canvas.height = originalImg.height;
    ctx.drawImage(originalImg, 0, 0);

    // Definim starea resetată
    const resetState = {
      image: canvas.toDataURL('image/jpeg'),
      filters: {
        blackWhite: false,
        noise: false,
        sharpen: false,
        sepia: false,
        vintage: false,
        invert: false,
        gotham: false,
        lofi: false,
        pastel: false,
        hudson: false,
        amaro: false,
        xpro: false,
        sierra: false,
        valencia: false,
        moon: false,
        robeautify: false
      },
      edits: {
        exposure: 0,
        contrast: 0,
        saturation: 0,
        temperature: 0
      },
      tools: {
        crop: false,
        aspectRatio: 'original',
        rotate: 0,
        cropRect: null
      }
    };

    // Actualizăm toate stările
    setImage(originalImg);
    setProcessedImage(originalImg);
    setFilters(resetState.filters);
    setEdits(resetState.edits);
    setTools(resetState.tools);
    setIsCropping(false);
    setCropStart(null);
    setCropRect(null);
    setCropResizeHandle(null);

    // Resetăm istoricul
    setHistory([resetState]);
    setHistoryIndex(0);
  };
  originalImg.src = savedImage;
};

  const handleExit = () => {
    setShowExitConfirm(true);
  };
  
  const confirmExit = () => {
    setShowExitConfirm(false);
    setTimeout(() => {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      setImage(null);
      setProcessedImage(null);
      setHistory([]);
      setHistoryIndex(-1);
      // Resetăm și starea crop-ului
      setTools(prev => ({
        ...prev,
        crop: false,
        aspectRatio: 'original',
        rotate: 0,
        cropRect: null
      }));
      setCropRect(null);
      setIsCropping(false);
      setCropStart(null);
      setCropResizeHandle(null);
      navigate('/edit-photo');
    }, 200);
  };
  
  const cancelExit = () => {
    setShowExitConfirm(false);
  };
  
  // Curăță starea la demontarea componentei
  useEffect(() => {
    return () => {
      // Nu mai ștergem datele la unmount, doar când navigăm explicit în afara edit-photo
      if (!window.location.pathname.includes('/edit-photo')) {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(SESSION_KEY);
      }
    };
  }, []);

  
useEffect(() => {
  const handlePaste = async (e) => {
    // Verificăm dacă avem deja o imagine încărcată
    if (image) return;

    // Obținem elementele din clipboard
    const items = e.clipboardData.items;
    
    // Căutăm o imagine în clipboard
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            // Folosim funcția existentă loadImage pentru a procesa imaginea
            const fakeEvent = {
              target: {
                files: [blob]
              }
            };
            handleFileChange(fakeEvent);
          };
          img.src = event.target.result;
        };
        
        reader.readAsDataURL(blob);
        break;
      }
    }
  };

  // Adăugăm event listener
  window.addEventListener('paste', handlePaste);

  // Cleanup
  return () => {
    window.removeEventListener('paste', handlePaste);
  };
}, [image]); // Dependență pe image pentru a preveni paste când avem deja o imagine

//to draw the crop overlay
useEffect(() => {
  if (!canvasRef.current || !image) return;
  
  redrawCanvasWithCrop(cropRect);
}, [image, tools.crop, cropRect, applyAllEffects]);

  // Undo function
  const undo = () => {
  if (historyIndex <= 0) return;
  
  const prevIndex = historyIndex - 1;
  const prevState = history[prevIndex];
  
  // Actualizăm toate stările într-un singur batch
  setFilters(prevState.filters);
  setTools(prevState.tools);
  setEdits(prevState.edits);
  setHistoryIndex(prevIndex);
  
  // Restaurăm imaginea sincron
  const canvas = canvasRef.current;
  if (canvas && prevState.image) {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      setImage(img); // Actualizăm starea imaginii
      setProcessedImage(img); // Asigurăm sincronizarea
    };
    img.src = prevState.image;
  }
};
  
  // Redo function
  const redo = () => {
  if (historyIndex >= history.length - 1) return;
  
  const nextIndex = historyIndex + 1;
  const nextState = history[nextIndex];
  
  // Actualizăm toate stările într-un singur batch
  setFilters(nextState.filters);
  setTools(nextState.tools);
  setEdits(nextState.edits);
  setHistoryIndex(nextIndex);
  
  // Restaurăm imaginea sincron
  const canvas = canvasRef.current;
  if (canvas && nextState.image) {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      setImage(img); // Actualizăm starea imaginii
      setProcessedImage(img); // Asigurăm sincronizarea
    };
    img.src = nextState.image;
  }
};

useEffect(() => {
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      undo();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault();
      redo();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [history, historyIndex]); // Adăugăm dependințele necesare

//Debugging history updates
useEffect(() => {
  console.log('History updated:', {
    history,
    historyIndex,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  });
}, [history, historyIndex]);

// Debugging state changes
useEffect(() => {
  console.log('Current state:', {
    image: image ? `${image.width}x${image.height}` : null,
    tools,
    cropRect,
    historyIndex,
    historyLength: history.length
  });
}, [image, tools, cropRect, historyIndex, history]);

  // Save edited image
  const saveImage = async () => {
    if (!processedImage || !canvasRef.current) return;
    
    const fileName = prompt('Enter a name for your image:', 'edited-photo');
    if (!fileName) return; // User cancelled
    
    try {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/jpeg');
      
      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      // Create form data to send to server
      const formData = new FormData();
      formData.append('photo', blob, `${fileName}.jpg`);
      formData.append('userId', currentUser?.id || 'anonymous');
      formData.append('metadata', JSON.stringify({
        filters,
        tools,
        edits,
        createdAt: new Date().toISOString()
      }));
  
      // Save to backend
      const saveResponse = await fetch('http://localhost:5000/api/save-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      const result = await saveResponse.json();
      
      if (!saveResponse.ok) {
        throw new Error(result.error || 'Failed to save photo');
      }
      
      alert('Photo saved successfully to your gallery!');
    } catch (error) {
      console.error('Error saving photo:', error);
      alert('Failed to save photo: ' + error.message);
    }
  };

  return (
    <EditContainer>
      <EditorWrapper>
      <CanvasContainer 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          $dragActive={dragActive}
          $hasImage={!!image}
        >
          {isProcessing && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              zIndex: 10
            }}>
              Processing image, please wait...
            </div>
          )}

          {!image ? (
            <UploadArea>
              <UploadPrompt>
                <FaUpload size={48} />
                <p>Drag & drop an image here, or</p>
                <UploadButton onClick={() => fileInputRef.current.click()}>
                  Browse Files
                </UploadButton>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <p>or paste an image</p>
              </UploadPrompt>
            </UploadArea>
          ) : (
            <CanvasWrapper>
  <canvas 
  ref={canvasRef} 
  onMouseDown={handleMouseDown}
  onMouseMove={(e) => {
    const rect = e.target.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
    setMouseY(e.clientY - rect.top);
    handleMouseMove(e); // Call your existing mouse move handler
  }}
  onMouseUp={handleMouseUp}
  onMouseLeave={() => {
    handleMouseUp();
    setMouseX(0);
    setMouseY(0);
  }}
  style={{ 
    maxWidth: '100%',
    maxHeight: '80vh',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    cursor: tools.crop ? 
      (isCropping ? 'grabbing' : 
        (getHoverHandle(mouseX, mouseY) ? `${getHoverHandle(mouseX, mouseY)}-resize` : 'move')
      ) : 'default'
  }}
/>
</CanvasWrapper>
          )}
        </CanvasContainer>
        {image && (
        <>
        <Toolbar>
  <LeftGroup>
            <ToolButton 
              $active={activeTab === 'filters'} 
              onClick={() => setActiveTab(activeTab === 'filters' ? null : 'filters')}
            >
              <FaMagic /> Filters
            </ToolButton>
            <ToolButton 
              $active={activeTab === 'tools'} 
              onClick={() => setActiveTab(activeTab === 'tools' ? null : 'tools')}
            >
              <FaCrop /> Tools
            </ToolButton>
            <ToolButton 
              $active={activeTab === 'edit'} 
              onClick={() => setActiveTab(activeTab === 'edit' ? null : 'edit')}
            >
              <FaSlidersH /> Edit
            </ToolButton>
            </LeftGroup>

<CenterGroup>
<ToolButton 
  onClick={undo} 
  disabled={historyIndex <= 0}
  title="Undo (Ctrl+Z)"
>
  <FaUndo /> Undo
</ToolButton>

<ToolButton 
  onClick={redo} 
  disabled={historyIndex >= history.length - 1}
  title="Redo (Ctrl+Y)"
>
  <FaRedo /> Redo
</ToolButton>
  </CenterGroup>

  <RightGroup>
    <ToolButton onClick={resetEdits}>
      <FaTrash /> Reset All
    </ToolButton>
    <SaveButton onClick={saveImage} disabled={!processedImage || isProcessing}>
      {isProcessing ? 'Processing...' : 'Save'}
    </SaveButton>
    <ToolButton onClick={handleExit}>
      <FaTimes /> Exit
    </ToolButton>
  </RightGroup>
</Toolbar>
        
        {activeTab && (
          <SubMenu>
            {activeTab === 'filters' && (
  <FilterOptions>
    <FilterOption 
      $active={filters.blackWhite} 
      onClick={() => toggleFilter('blackWhite')}
    >
      <FaAdjust /> B&W
    </FilterOption>
    <FilterOption 
      $active={filters.noise} 
      onClick={() => toggleFilter('noise')}
    >
      <FaWaveSquare /> Noise
    </FilterOption>
    <FilterOption 
      $active={filters.sharpen} 
      onClick={() => toggleFilter('sharpen')}
    >
      <FaStar /> Sharpen
    </FilterOption>
    <FilterOption 
      $active={filters.sepia} 
      onClick={() => toggleFilter('sepia')}
    >
      <FaTree /> Sepia
    </FilterOption>
    <FilterOption 
      $active={filters.vintage} 
      onClick={() => toggleFilter('vintage')}
    >
      <FaHistory /> Vintage
    </FilterOption>
    <FilterOption 
      $active={filters.invert} 
      onClick={() => toggleFilter('invert')}
    >
      <FaInbox /> Invert
    </FilterOption>
    <FilterOption 
      $active={filters.gotham} 
      onClick={() => toggleFilter('gotham')}
    >
      <FaSnowflake /> Gotham
    </FilterOption>
    <FilterOption 
      $active={filters.lofi} 
      onClick={() => toggleFilter('lofi')}
    >
      <FaHeadphones /> Lofi
    </FilterOption>
    <FilterOption 
      $active={filters.pastel} 
      onClick={() => toggleFilter('pastel')}
    >
      <FaPaintBrush/> Pastel
    </FilterOption>
    <FilterOption $active={filters.hudson} onClick={() => toggleFilter('hudson')}>
  <FaMountain /> Hudson
</FilterOption>
<FilterOption $active={filters.amaro} onClick={() => toggleFilter('amaro')}>
  <FaFire /> Amaro
</FilterOption>
<FilterOption $active={filters.xpro} onClick={() => toggleFilter('xpro')}>
  <FaBolt /> X-Pro 
</FilterOption>
<FilterOption $active={filters.sierra} onClick={() => toggleFilter('sierra')}>
  <FaUmbrellaBeach /> Sierra
</FilterOption>
<FilterOption $active={filters.valencia} onClick={() => toggleFilter('valencia')}>
  <FaPaintBrush /> Valencia
</FilterOption>
<FilterOption $active={filters.moon} onClick={() => toggleFilter('moon')}>
  <FaRegMoon /> Moon
</FilterOption>
<FilterOption $active={filters.robeautify} onClick={() => toggleFilter('robeautify')}>
<FaHeart /> Robeautify
</FilterOption>
    
  </FilterOptions>
)}
            
            {activeTab === 'tools' && (
  <ToolOptions>
    <ToolOption>
      <RotateButtons>
        <RotateButton onClick={() => rotateImage('left')}>
          <FaUndo /> Rotate Left
        </RotateButton>
        <RotateButton onClick={() => rotateImage('right')}>
          <FaRedo /> Rotate Right
        </RotateButton>
      </RotateButtons>
    </ToolOption>
    <ToolOption>
      <label>
        <input
          type="checkbox"
          checked={tools.crop}
          onChange={(e) => handleToolChange('crop', e.target.checked)}
        />
        Enable Crop
      </label>
    </ToolOption>
    
    {tools.crop && (
      <>
        <ToolOption>
          <label>Aspect Ratio:</label>
          <select 
            value={tools.aspectRatio} 
            onChange={(e) => handleToolChange('aspectRatio', e.target.value)}
          >
            <option value="custom">Custom</option>
            <option value="original">Original</option>
            <option value="1:1">1:1 (Square)</option>
            <option value="3:4">3:4</option>
            <option value="4:3">4:3</option>
            <option value="9:16">9:16</option>
            <option value="16:9">16:9</option>
          </select>
        </ToolOption>
        
        {cropRect && (
          <ToolOption>
            <ApplyButton onClick={applyCrop}>
              Apply Crop
            </ApplyButton>
          </ToolOption>
        )}
      </>
    )}
  </ToolOptions>
)}
            
            {activeTab === 'edit' && (
  <EditOptions>
    <EditSlider>
  <label>Exposure:</label>
  <span>{edits.exposure}</span>
  <input 
    type="range" 
    min="-100" 
    max="100" 
    value={edits.exposure} 
    onChange={(e) => handleEditChange('exposure', e.target.value)}
    step="1"
  />
</EditSlider>
    <EditSlider>
      <label>Contrast:</label>
      <span>{edits.contrast}</span>
      <input 
        type="range" 
        min="-100" 
        max="100" 
        value={edits.contrast} 
        onChange={(e) => handleEditChange('contrast', e.target.value)}
        step="1"
      />
    </EditSlider>
    <EditSlider>
      <label>Saturation: </label>
      <span>{edits.saturation}</span>
      <input 
        type="range" 
        min="-100" 
        max="100" 
        value={edits.saturation} 
        onChange={(e) => handleEditChange('saturation', e.target.value)}
        step="1"
      />
    </EditSlider>
    <EditSlider>
      <label>Temperature: </label>
      <span>{edits.temperature}</span>
      <input 
        type="range" 
        min="-100" 
        max="100" 
        value={edits.temperature} 
        onChange={(e) => handleEditChange('temperature', e.target.value)}
        step="1"
      />
    </EditSlider>
  </EditOptions>
)}
          </SubMenu>
          )}
        </>
        )}
      </EditorWrapper>

      {showExitConfirm && (
  <ModalOverlay onClick={cancelExit}>
    <Modal onClick={(e) => e.stopPropagation()}>
      <h3>Are you sure you want to exit?</h3>
      <p>Your current project will be lost unless you've saved it.</p>
      <ModalButtons>
        <button onClick={cancelExit}>Cancel</button>
        <button onClick={confirmExit}>Exit</button>
      </ModalButtons>
    </Modal>
  </ModalOverlay>
)}
    </EditContainer>
  );
};

// Styled components
const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
  position: relative;
`;

const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  min-height: calc(100vh - 160px);
  box-sizing: border-box;
`;

const Toolbar = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  padding: 10px 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const LeftGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-self: start;
`;

const CenterGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-self: center;
`;

const RightGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-self: end;
  align-items: center;
`;

const ToolbarGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  /* Grupul Undo/Redo - centrat */
  &:nth-child(2) {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  /* Grupul Reset/Save - aliniat la dreapta (lângă Exit) */
  &:last-child {
    margin-left: auto;
    margin-right: 20px; /* Spațiu între Save și Exit */
  }
`;

const ToolButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: ${props => props.$active ? '#ff69b4' : 'white'};
  color: ${props => props.$active ? 'white' : '#333'};
  border: 1px solid ${props => props.$active ? '#ff69b4' : '#ddd'};
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.disabled ? 'white' : props.$active ? '#ff4081' : '#f5f5f5'};
    border-color: ${props => props.disabled ? '#ddd' : props.$active ? '#ff4081' : '#ccc'};
  }
`;

const SaveButton = styled.button`
  padding: 8px 24px;
  background-color: #ff69b4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #ff4081;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SubMenu = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const FilterOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  width: 100%;
  
  svg {
    width: 16px;
    text-align: center;
  }
`;

const FilterOption = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px; /* Spațiu între iconiță și text */
  padding: 8px 16px;
  background-color: ${props => props.$active ? '#ff9a9e' : 'white'};
  color: ${props => props.$active ? 'white' : '#333'};
   border: 1px solid ${props => props.$active ? '#ff9a9e' : '#ddd'};
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
  
  /* Stiluri pentru iconițe */
  svg {
    font-size: 14px;
    color: ${props => props.$active ? 'white' : '#555'};
    transition: color 0.2s;
  }

  &:hover {
     background-color: ${props => props.$active ? '#ff7b81' : '#f5f5f5'};
    border-color: ${props => props.$active ? '#ff7b81' : '#ccc'};
    
    svg {
      color: ${props => props.$active ? 'white' : '#ff69b4'};
    }
  }
`;

const CropOverlayInstructions = styled.div`
  grid-column: 1 / -1;
  font-size: 0.9em;
  color: #666;
  margin-top: -10px;
  margin-bottom: 10px;
  
  p {
    margin: 5px 0;
  }
`;

const RotateSliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const RotateButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  width: 100%;
`;

const RotateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #ff69b4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #ff4081;
  }
`;

const ResetButton = styled.button`
  flex: 1;
  padding: 6px 10px;
  background-color: #ddd;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #ccc;
  }
`;

const ApplyButton = styled.button`
  padding: 8px 16px;
  background-color: #ff69b4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
  
  &:hover {
    background-color: #ff4081;
  }
`;

const ToolOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
`;

const ToolOption = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  label {
    min-width: 100px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  select, input[type="range"] {
    flex: 1;
    accent-color: #ff9a9e;
  }
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #ff9a9e;
    margin-right: 8px;
  }
  
  button {
    background-color: #ff9a9e;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background-color: #ff7b81;
    }
  }
`;

const EditOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
`;

const EditSlider = styled.div`
  display: grid;
  grid-template-columns: 120px 50px 1fr;
  align-items: center;
  gap: 15px;
  
  label {
    text-align: right;
    grid-column: 1;
  }
  
  span {
    grid-column: 2;
    text-align: center;
    min-width: 30px;
    display: inline-block;
  }
  
  input[type="range"] {
    grid-column: 3;
    width: 100%;
    accent-color: #ff9a9e;
  }
`;

const CanvasContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.$dragActive ? '#e9f5ff' : props.$hasImage ? 'transparent' : '#f5f5f5'};
  border: ${props => props.$dragActive ? '2px dashed #4a90e2' : '1px dashed #ddd'};
  border-radius: 8px;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
  max-height: calc(100vh - 300px);
  width: 100%;
`;

const UploadArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
`;

const UploadPrompt = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  color: #666;
  
  p {
    margin: 0;
  }
`;

const UploadButton = styled.button`
  padding: 10px 20px;
  background-color: #ff69b4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #ff4081;
  }
`;

const CanvasWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 100%;
  height: 100%;
  overflow: auto;
  
  canvas {
    max-width: 100%;
    max-height: 80vh;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    object-fit: contain;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  
  button {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    
    &:last-child {
      background-color: #ff69b4;
      color: white;
      border: none;
    }
  }
`;


export default EditPhoto;