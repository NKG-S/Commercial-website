import { useState, useCallback, useEffect } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

// ImageUpload Component
export default function ImageUpload({ onFilesChange }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const MAX_FILES = 5;

  // Effect to call the parent callback whenever the selectedFiles state changes
  useEffect(() => {
    if (onFilesChange) {
      onFilesChange(selectedFiles);
    }
  }, [selectedFiles, onFilesChange]);

  // Function to process newly selected or dropped files
  const handleNewFiles = useCallback((newFiles) => {
    if (!newFiles || newFiles.length === 0) return;

    const filesArray = Array.from(newFiles);
    const imageFiles = filesArray.filter(file => file.type.startsWith('image/'));
    
    setSelectedFiles(prevFiles => {
      const allFiles = [...prevFiles, ...imageFiles];
      const validFiles = allFiles.slice(0, MAX_FILES);

      if (allFiles.length > MAX_FILES) {
        console.warn(`File limit exceeded. Only the first ${MAX_FILES} files were kept.`);
      }

      return validFiles;
    });
  }, [MAX_FILES]);

  // Handler for file input change
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      handleNewFiles(event.target.files);
    }
    event.target.value = '';
  };

  // Handler for dropping files onto the dropzone
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleNewFiles(event.dataTransfer.files);
    }
  };

  // Prevent default behavior to allow dropping
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Function to remove a file from the list
  const removeFile = useCallback((indexToRemove) => {
    setSelectedFiles(prevFiles => 
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  }, []);

  // Determine if the upload area should be disabled
  const isLimitReached = selectedFiles.length >= MAX_FILES;

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
      <h3 className="text-base font-semibold text-gray-700 mb-3">
        Product Images ({selectedFiles.length}/{MAX_FILES})
      </h3>

      {/* File Dropzone Area */}
      <div className="flex items-center justify-center w-full">
        <label 
          htmlFor="dropzone-file" 
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-all duration-300 
            ${isLimitReached 
              ? 'bg-gray-100 border-gray-400 cursor-not-allowed text-gray-500' 
              : 'bg-indigo-50 border-indigo-300 cursor-pointer hover:bg-indigo-100 text-indigo-600'
            }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-2 pb-3">
            <UploadCloud className="w-6 h-6 mb-1" />
            {isLimitReached ? (
              <p className="text-sm font-medium">Maximum limit reached.</p>
            ) : (
              <p className="text-sm font-medium">
                Click to select or Drag & Drop images
              </p>
            )}
            <p className="text-xs mt-1 text-gray-500">
              (Max {MAX_FILES} files)
            </p>
          </div>
          
          {/* Hidden File Input */}
          <input 
            id="dropzone-file" 
            type="file" 
            className="hidden"
            onChange={handleFileChange}
            multiple 
            accept="image/*" 
            disabled={isLimitReached}
          />
        </label>
      </div>
      
      {/* Selected Files Display */}
      {selectedFiles.length > 0 && (
        <ul className="mt-4 space-y-2 max-h-36 overflow-y-auto pr-2">
          {selectedFiles.map((file, index) => (
            <li 
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-md shadow-sm"
            >
              <div className="flex items-center min-w-0 flex-1">
                <FileText className="w-4 h-4 mr-2 text-indigo-500 flex-shrink-0" />
                <span className="text-xs font-medium text-gray-800 truncate" title={file.name}>
                  {file.name}
                </span>
                <span className="ml-2 text-[10px] text-gray-500 flex-shrink-0">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 rounded-full hover:bg-red-100 text-red-500 transition-colors duration-150 flex-shrink-0 ml-4"
                aria-label={`Remove file ${file.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedFiles.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-indigo-500 font-medium">
            Files selected and ready for submission.
          </p>
        </div>
      )}
    </div>
  );
}