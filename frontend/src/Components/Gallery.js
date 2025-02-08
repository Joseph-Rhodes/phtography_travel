import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GalleryHero from "./GalleryHero";
import Masonry from "react-masonry-css";
import "./Gallery.css";

const Gallery = () => {
  const { folderName } = useParams(); // Get the folder name from the URL
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("https://jr5-travel.onrender.com/images");
        const data = await response.json();

        // Find the folder matching the current folderName
        const folder = data.find((folder) => folder.folder === folderName);

        if (folder) {
          // Extract URLs for images in the folder
          setImages(
            folder.images
              .map((image) => image.url)
              .filter((url) => url.endsWith(".jpg") || url.endsWith(".png"))
          );
        } else {
          setImages([]); // No images found for the folder
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching images:", error);
        setLoading(false);
      }
    };

    fetchImages();
  }, [folderName]);

  const openOverlay = (index) => {
    setCurrentIndex(index);
    setIsOverlayOpen(true);
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
  };

  const handleNext = (event) => {
    event.stopPropagation(); // Prevent overlay from closing
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (event) => {
    event.stopPropagation(); // Prevent overlay from closing
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const breakpointColumns = {
    default: 3,
    1100: 2,
    700: 1,
  };

  if (loading) {
    return <div>Loading images...</div>;
  }

  if (images.length === 0) {
    return <div>No images found for the folder "{folderName}"</div>;
  }

  return (
    <div className="gallery-page">
      <GalleryHero /> {/* Hero section remains untouched */}
      <div className="gallery-container">
        <Masonry
          breakpointCols={breakpointColumns}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {images.map((url, index) => (
            <div key={index} className="masonry-item">
              <div className="image-container">
                <img
                  src={url}
                  alt={`Gallery ${index}`}
                  className="gallery-image"
                  onClick={() => openOverlay(index)} // Open overlay on click
                />
              </div>
            </div>
          ))}
        </Masonry>
      </div>

      {isOverlayOpen && (
        <div className="overlay" onClick={closeOverlay}>
          <div className="overlay-content">
            <button
              className="gallery-nav-button overlay-prev"
              onClick={handlePrev}
            >
              {"←"}
            </button>
            <img
              className="overlay-image"
              src={images[currentIndex]}
              alt={`Gallery ${currentIndex}`}
            />
            <button
              className="gallery-nav-button overlay-next"
              onClick={handleNext}
            >
              {"→"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
