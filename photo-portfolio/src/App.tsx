import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Gallery } from '../components/Gallery';
import { Contact } from '../components/Contact';
import { UploadModal } from '../components/UploadModal';
import { Photo, Category } from '../types';

// Initial seed data
const INITIAL_PHOTOS: Photo[] = [
  {
    id: '1',
    url: 'https://picsum.photos/id/64/800/600',
    title: 'Urban Solitude',
    description: 'A quiet moment in the bustling city center, capturing the interplay of light and shadow.',
    category: Category.PORTRAITS,
    dateAdded: Date.now()
  },
  {
    id: '2',
    url: 'https://picsum.photos/id/28/800/1200',
    title: 'Misty Forest Path',
    description: 'Morning fog rolling through the ancient pines.',
    category: Category.LANDSCAPES,
    dateAdded: Date.now()
  },
  {
    id: '3',
    url: 'https://picsum.photos/id/250/800/600',
    title: 'Geometric Waves',
    description: 'Abstract patterns found in modern architecture.',
    category: Category.ABSTRACT,
    dateAdded: Date.now()
  },
  {
    id: '4',
    url: 'https://picsum.photos/id/453/800/800',
    title: 'The Concert',
    description: 'Electric energy from the crowd during the summer festival.',
    category: Category.EVENTS,
    dateAdded: Date.now()
  },
  {
    id: '5',
    url: 'https://picsum.photos/id/338/800/1000',
    title: 'Fading Ember',
    description: 'Close up abstract textures of autumn leaves.',
    category: Category.ABSTRACT,
    dateAdded: Date.now()
  },
  {
    id: '6',
    url: 'https://picsum.photos/id/177/800/600',
    title: 'The Traveler',
    description: 'A candid shot during a backpacking trip across Europe.',
    category: Category.PORTRAITS,
    dateAdded: Date.now()
  }
];

const App: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // In a real scenario with Python backend, we would fetch photos here
  useEffect(() => {
    console.log("Initializing portfolio app...");
    // fetch('/api/photos').then(...)
  }, []);

  const handleUpload = (newPhoto: Photo) => {
    setPhotos(prev => [newPhoto, ...prev]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
        <Navbar onUploadClick={() => setIsUploadModalOpen(true)} />

        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={
              <>
                <div className="text-center mb-12 max-w-2xl mx-auto">
                  <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-slate-900">
                    Visual Stories
                  </h1>
                  <p className="text-slate-600 text-lg">
                    A curated collection of moments frozen in time. Explore portraits, landscapes, 
                    and abstract compositions captured through my lens.
                  </p>
                </div>
                <Gallery photos={photos} />
              </>
            } />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-slate-200 py-8 mt-12">
          <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Lumina Photography Portfolio.</p>
            <p className="mt-2">Built with React, Tailwind, and Gemini AI.</p>
          </div>
        </footer>

        <UploadModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)} 
          onUpload={handleUpload} 
        />
      </div>
    </Router>
  );
};

export default App;