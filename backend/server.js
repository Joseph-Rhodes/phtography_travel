require("dotenv").config();
const express = require("express");
const AWS = require("aws-sdk");
const cors = require("cors");

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Validate required environment variables
const requiredEnvVars = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_REGION", "AWS_BUCKET_NAME", "PORT"];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Error: ${key} is not defined in .env file.`);
    process.exit(1);
  }
});

// AWS S3 configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3(); // Initialize S3 instance

// GET /images route to list images from S3
app.get("/images", async (req, res) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME, // Bucket name from .env
    };

    // Fetch all objects from the bucket
    const data = await s3.listObjectsV2(params).promise();

    // Group objects by folder and track latest modification date
    const folderMap = {};
    data.Contents.forEach((item) => {
      const folder = item.Key.split("/")[0]; // Extract folder name
      if (!folderMap[folder]) {
        folderMap[folder] = {
          folder,
          lastModified: item.LastModified,
          images: [],
        };
      }

      folderMap[folder].images.push({
        key: item.Key,
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
        lastModified: item.LastModified,
      });

      // Update folder's lastModified to the most recent date
      if (folderMap[folder].lastModified < item.LastModified) {
        folderMap[folder].lastModified = item.LastModified;
      }
    });

    // Convert folderMap to an array and sort by lastModified (desc)
    const sortedFolders = Object.values(folderMap).sort(
      (a, b) => new Date(b.lastModified) - new Date(a.lastModified)
    );

    res.json(sortedFolders); // Send the sorted folder list with images and lastModified
  } catch (error) {
    console.error("Error fetching images from S3:", error.message);
    res.status(500).json({ error: "Error fetching images from S3" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
