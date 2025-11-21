import * as React from 'react';
import { useState, useRef } from 'react';
import { X, Image as ImageIcon, Wand2, Check } from 'lucide-react';
import { Category, Photo } from '../types';
import { analyzeImage, fileToGenerativePart } from '../services/geminiService';
import { Button } from './Button';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (photo: Photo) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>(Category.ABSTRACT);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create preview
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);

      // Auto-analyze with Gemini
      await handleGeminiAnalysis(selectedFile);
    }
  };

  const handleGeminiAnalysis = async (imageFile: File) => {
    setIsAnalyzing(true);
    try {
      const base64Data = await fileToGenerativePart(imageFile);
      const metadata = await analyzeImage(base64Data, imageFile.type);
      
      setTitle(metadata.title);
      setDescription(metadata.description);
      setCategory(metadata.suggestedCategory);
    } catch (err) {
      console.error("Analysis failed", err);
      // Keep defaults
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !previewUrl) return;

    setIsSaving(true);
    
    // Simulate network delay
    setTimeout(() => {
      const newPhoto: Photo = {
        id: Date.now().toString(),
        url: previewUrl, // In a real app, this would be the S3/Cloudinary URL
        title,
        description,
        category,
        dateAdded: Date.now()
      };

      onUpload(newPhoto);
      resetForm();
      setIsSaving(false);
      onClose();
    }, 800);
  };

  const resetForm = () => {
    setFile(null);
    setPreviewUrl(null);
    setTitle('');
    setDescription('');
    setCategory(Category.ABSTRACT);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Backdrop */}
        <div className="fixed inset-0 bg-slate-900/75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif font-semibold leading-6 text-slate-900" id="modal-title">
                Upload Photograph
              </h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-500 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Image Preview Section */}
              <div className="w-full md:w-1/2 flex flex-col">
                <div 
                  className={`flex-1 min-h-[250px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden relative
                    ${previewUrl ? 'border-slate-300 bg-slate-50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'}
                  `}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                  ) : (
                    <div className="text-center p-6">
                      <div className="mx-auto h-12 w-12 text-slate-400 mb-3">
                        <ImageIcon className="w-full h-full" />
                      </div>
                      <p className="text-sm text-slate-600 font-medium">Click to upload image</p>
                      <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP up to 10MB</p>
                    </div>
                  )}
                  
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-white flex flex-col items-center">
                        <Wand2 className="w-8 h-8 animate-pulse mb-2" />
                        <span className="text-sm font-medium">AI Analyzing...</span>
                      </div>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange} 
                />
              </div>

              {/* Form Section */}
              <form onSubmit={handleSubmit} className="w-full md:w-1/2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border-slate-300 border px-3 py-2 focus:ring-slate-900 focus:border-slate-900 text-sm"
                    placeholder={isAnalyzing ? "Generating title..." : "E.g. Golden Hour Solitude"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full rounded-lg border-slate-300 border px-3 py-2 focus:ring-slate-900 focus:border-slate-900 text-sm"
                  >
                    {Object.values(Category).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    {category === Category.PORTRAITS && "Focus on human subjects and expressions."}
                    {category === Category.LANDSCAPES && "Capturing nature and outdoor environments."}
                    {category === Category.EVENTS && "Weddings, concerts, and gatherings."}
                    {category === Category.ABSTRACT && "Conceptual, shapes, and non-literal imagery."}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea 
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg border-slate-300 border px-3 py-2 focus:ring-slate-900 focus:border-slate-900 text-sm resize-none"
                    placeholder={isAnalyzing ? "Generating description..." : "Tell the story behind this photo..."}
                  />
                </div>

                <div className="pt-4 flex gap-3 justify-end">
                  <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={!file || isAnalyzing} isLoading={isSaving}>
                    {isSaving ? 'Saving...' : 'Add to Gallery'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};