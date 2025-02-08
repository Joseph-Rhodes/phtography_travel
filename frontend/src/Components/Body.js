import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Body.css";

const Body = () => {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    // Fetch folder data from the server
    fetch("http://localhost:5003/images")
      .then((response) => response.json())
      .then((data) => setFolders(data))
      .catch((error) => console.error("Error fetching folders:", error));
  }, []);

  return (
    <div className="body-container">
      {folders.map((folder, index) => {
        // Find the 'head.png' image in the folder
        const headImage = folder.images.find((image) =>
          image.key.includes("head.png") || image.key.includes("head.jpg") || image.key.includes("head.JPG")
        );

        return (
          <div
            key={folder.folder}
            className={`folder-section ${
              index % 2 === 0 ? "text-left" : "text-right"
            }`}
          >
            <img
              src={headImage ? headImage.url : folder.images[0]?.url} // Use 'head.png' if found, fallback to the first image
              alt={folder.folder}
              className="folder-image"
            />
            <div className="folder-text">
              <h2>{folder.folder}</h2>
              <Link to={`/gallery/${folder.folder}`} className="folder-link">
                →
              </Link>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Body;
