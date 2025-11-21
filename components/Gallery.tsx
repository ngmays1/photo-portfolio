import React, { useState, useMemo } from 'react';
import { Category, Photo } from '../types';
import { X } from 'lucide-react';

interface GalleryProps {
  photos: Photo[];
}

export const Gallery: React.FC<GalleryProps> = ({ photos }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const categories = ['All', ...Object.values(Category)];

  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'All') return photos;
    return photos.filter(p => p.category === activeCategory);
  }, [photos, activeCategory]);

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 
              ${activeCategory === cat 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-lg">No photos in this category yet.</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {filteredPhotos.map((photo) => (
            <div 
              key={photo.id} 
              className="break-inside-avoid group relative overflow-hidden rounded-xl cursor-pointer bg-slate-100"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img 
                src={photo.url} 
                alt={photo.title} 
                className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">{photo.category}</span>
                <h3 className="text-white font-serif text-xl">{photo.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
          <button 
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="max-w-7xl w-full max-h-screen flex flex-col md:flex-row gap-8 items-center justify-center">
            <div className="relative flex-1 flex items-center justify-center">
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.title} 
                className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>
            
            <div className="w-full md:w-80 text-white bg-slate-900/50 p-6 rounded-xl backdrop-blur-md">
              <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-medium uppercase tracking-wider mb-4">
                {selectedPhoto.category}
              </span>
              <h2 className="text-3xl font-serif mb-4 leading-tight">{selectedPhoto.title}</h2>
              <p className="text-slate-300 leading-relaxed mb-6">{selectedPhoto.description}</p>
              <div className="text-xs text-slate-500 pt-4 border-t border-white/10">
                Uploaded on {new Date(selectedPhoto.dateAdded).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};