import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './GalleryHero.css';

const GalleryHero = () => {
  const { folderName } = useParams(); // Get the current gallery folder from URL
  const [heroImage, setHeroImage] = useState('');
  const [heroText, setHeroText] = useState('Loading...');

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const response = await fetch('http://localhost:5003/images');
        const data = await response.json();

        console.log('API Response:', data);

        // Find the folder that matches the current gallery
        const selectedFolder = data.find((folder) => folder.folder === folderName);

        if (selectedFolder) {
          // Look for 'head.png' as the hero image
          const headImage = selectedFolder.images.find((img) =>
            img.key.includes('head.png') || img.key.includes('head.jpg') || img.key.includes('head.JPG')
          );

          let imageToUse = headImage ? headImage.url : selectedFolder.images[0]?.url || '';
          imageToUse = encodeURI(imageToUse); // Encode the URL to handle spaces and special characters

          console.log('Encoded Hero Image URL:', imageToUse);

          setHeroImage(imageToUse); // Set the hero image
          setHeroText(folderName); // Use folder name as hero text
        } else {
          setHeroText('Gallery Not Found');
        }
      } catch (error) {
        console.error('Error fetching hero image:', error);
        setHeroText('Error Loading Image');
      }
    };

    fetchHeroImage();
  }, [folderName]); // Refetch when folderName changes

  return (
    <div
      className="gallery-hero"
      style={{
        backgroundImage: heroImage ? `url(${heroImage})` : 'none',
      }}
    >
      <h1 className="gallery-hero-text">{heroText}</h1>
    </div>
  );
};

export default GalleryHero;
