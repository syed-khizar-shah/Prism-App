import { useState, useEffect, useRef } from 'react'
import axiosInstance from '../../api/axios'

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const ImageUploader = ({ onUpload }) => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [mode, setMode] = useState('file')
  const [imageUrl, setImageUrl] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const fileInputRef = useRef(null)


  useEffect(() => {
    if (mode === 'file') {
      if (!file) {
        setPreview('')
        return
      }
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    } else if (mode === 'url' && imageUrl) {
      setPreview(imageUrl)
    } else {
      setPreview('')
    }
  }, [file, imageUrl, mode])

  const onFileChange = (selectedFile) => {
    setError('')
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile)
      setImageUrl('')
    } else {
      setError('Please select a valid image file (JPG, PNG, GIF, etc.)')
    }
  }



  const handleSelectedFile = (selected) => {
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, GIF, etc.)");
      return;
    }

    if (selected.size > MAX_SIZE_BYTES) {
      setError(`File size must be under ${MAX_SIZE_MB}MB`);
      return;
    }

    setError("");
    onFileChange(selected);
  };

  const handleFileInput = (e) => {
    handleSelectedFile(e.target.files?.[0]);
  };



  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    handleSelectedFile(e.dataTransfer.files?.[0]);
  };


  const onUrlChange = (e) => {
    setError('')
    setImageUrl(e.target.value)
    setFile(null)
  }

  const uploadFile = async () => {
    console.log(file, imageUrl)
    if (mode === 'file' && !file) return
    if (mode === 'url' && !imageUrl) return

    setUploading(true)
    setError('')

    try {
      if (mode === 'file') {
        // Simulate API call - replace with your actual endpoint
        const formData = new FormData()
        formData.append('images', file)

        // Simulated upload delay
        const res = await axiosInstance.post('/api/upload', formData)
        console.log({ res });

        onUpload && onUpload(res.data.images[0])
      } else {
        // For URL mode, just pass the URL
        onUpload && onUpload(imageUrl)
      }

      // Reset form
      setFile(null)
      setImageUrl('')
      setPreview('')
      setError('')
    } catch (err) {
      console.log({ err })
      setError('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setImageUrl("")
    setPreview("")
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""   // 🔥 Proper reset
    }
  }


  const switchMode = (newMode) => {
    setMode(newMode)
    setFile(null)
    setImageUrl('')
    setPreview('')
    setError('')
  }

  const isReady = (mode === 'file' && file) || (mode === 'url' && imageUrl)

  return (
    <div className="w-full mx-auto bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header with Mode Selector */}
      <div className="border-b border-gray-200 p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Upload Image</h3>
        <div className="flex rounded-md overflow-hidden border border-gray-200 max-w-md">
          <button
            onClick={() => switchMode('file')}
            type="button"
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${mode === 'file'
              ? 'text-white bg-gray-900'
              : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
          >
            📁 Upload File
          </button>
          <button
            onClick={() => switchMode('url')}
            type="button"
            className={`flex-1 py-2 px-4 text-sm font-medium border-l border-gray-300 transition-colors ${mode === 'url'
              ? 'text-white bg-gray-900'
              : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
          >
            🔗 From URL
          </button>
        </div>
      </div>

      {/* Main Content - Side by Side Layout */}
      <div className="flex">
        {/* Left Side - Upload Controls */}
        <div className="flex-1 p-6 border-r border-gray-200">
          {mode === 'file' ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragOver
                ? 'border-gray-500 bg-gray-50'
                : file
                  ? 'border-gray-400 bg-gray-50'
                  : 'border-gray-300 hover:border-gray-400'
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                key={file ? file.name : "empty"}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />


              {file ? (
                <div className="space-y-3">
                  <div className="text-gray-600">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  <div className="flex justify-center space-x-3">
                    <label
                      htmlFor="file-upload"
                      className="text-gray-700 hover:text-gray-900 text-sm font-medium cursor-pointer"
                    >
                      Choose Different File
                    </label>
                    <button
                      onClick={removeFile}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-gray-400">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <label
                      htmlFor="file-upload"
                      className="text-gray-800 hover:text-gray-900 font-medium cursor-pointer"
                    >
                      Click to choose a file
                    </label>
                    <p className="text-gray-500">or drag and drop an image here</p>
                  </div>
                  <p className="text-xs text-gray-400">PNG, JPG, WEBP up to {MAX_SIZE_MB}MB</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={onUrlChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter a direct link to an image file
                </p>
              </div>

              {imageUrl && (
                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-300 rounded-md">
                  <div className="flex items-center">
                    <div className="text-gray-600 mr-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-800 truncate max-w-md">
                      {imageUrl}
                    </span>
                  </div>
                  <button
                    onClick={removeFile}
                    className="text-gray-500 hover:text-gray-700"
                    type="button"
                    aria-label="Remove URL"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <div className="text-red-600 mr-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="mt-6">
            <button
              disabled={!isReady || uploading}
              onClick={uploadFile}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${!isReady || uploading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
                }`}
            >
              {uploading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </div>
              ) : (
                `Upload ${mode === 'file' ? 'File' : 'from URL'}`
              )}
            </button>
          </div>
        </div>

        {/* Right Side - Preview */}
        <div className="flex-1 bg-gray-50">
          {preview ? (
            <div className="h-full">
              <div className="px-6 py-4 border-b border-gray-200 bg-white">
                <h4 className="text-sm font-medium text-gray-900">Preview</h4>
              </div>
              <div className="p-6 flex items-center justify-center" style={{ minHeight: '400px' }}>
                <div className="bg-white border border-gray-200 rounded-md p-4 max-w-full">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-full h-auto max-h-96 mx-auto rounded"
                    onError={() => setError('Failed to load image preview. Please check the URL or try a different image.')}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-6" style={{ minHeight: '400px' }}>
              <div className="text-center text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium">Preview will appear here</p>
                <p className="text-sm">Select an image to see the preview</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageUploader