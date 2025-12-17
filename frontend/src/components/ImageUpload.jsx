import React, { useState, useRef } from 'react';
import './ImageUpload.css';

const ImageUpload = ({
  onUploadSuccess,
  currentImageUrl = null,
  uploadType = 'logo',
  label = 'Upload Image'
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPG, PNG, and WEBP images are allowed.');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size too large. Maximum size is 5MB.');
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      // Create form data
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Determine endpoint based on upload type
      const endpoint = uploadType === 'logo'
        ? `${process.env.REACT_APP_API_URL}/api/upload/logo`
        : `${process.env.REACT_APP_API_URL}/api/upload/product-image`;

      // Upload with progress tracking
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setUploading(false);
          setUploadProgress(100);

          // Call success callback with uploaded image URL
          if (onUploadSuccess && response.data && response.data.url) {
            onUploadSuccess(response.data.url);
          }

          // Reset file input
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } else {
          const errorResponse = JSON.parse(xhr.responseText);
          throw new Error(errorResponse.message || 'Upload failed');
        }
      });

      xhr.addEventListener('error', () => {
        throw new Error('Network error occurred during upload');
      });

      xhr.open('POST', endpoint);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image. Please try again.');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(currentImageUrl);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload-container">
      <label className="image-upload-label">{label}</label>

      {/* Image Preview */}
      {previewUrl && (
        <div className="image-preview">
          <img src={previewUrl} alt="Preview" />
        </div>
      )}

      {/* File Input */}
      <div className="file-input-wrapper">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          disabled={uploading}
          className="file-input"
        />
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span className="progress-text">{uploadProgress}%</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="upload-error">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      {selectedFile && !uploading && (
        <div className="upload-actions">
          <button
            onClick={handleUpload}
            className="btn-upload"
            disabled={uploading}
          >
            Upload Image
          </button>
          <button
            onClick={handleCancel}
            className="btn-cancel"
            disabled={uploading}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Helper Text */}
      <p className="upload-helper-text">
        Accepted formats: JPG, PNG, WEBP. Max size: 5MB
      </p>
    </div>
  );
};

export default ImageUpload;
