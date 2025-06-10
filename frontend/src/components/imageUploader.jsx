import { useState, useEffect } from 'react'
import axios from 'axios'

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const ImageUploader = ({ onUpload }) => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [mode, setMode] = useState('file') // 'file' or 'url'
  const [imageUrl, setImageUrl] = useState('')

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

  const onFileChange = (e) => {
    setError('')
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile)
      setImageUrl('') // Clear URL when file is selected
    } else {
      setError('Please select a valid image file')
    }
  }

  const onUrlChange = (e) => {
    setError('')
    setImageUrl(e.target.value)
    setFile(null) // Clear file when URL is entered
  }

  const uploadFile = async () => {
    if (mode === 'file' && !file) return
    if (mode === 'url' && !imageUrl) return

    setUploading(true)
    setError('')

    try {
      if (mode === 'file') {
        const formData = new FormData()
        formData.append('images', file)

        const res = await axios.post(`${baseUrl}/api/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        onUpload && onUpload(res.data.images[0])
      } else {
        // For URL mode, just pass the URL directly to onUpload
        onUpload && onUpload(imageUrl)
      }

      // Clear form after successful upload
      setFile(null)
      setImageUrl('')
      setPreview('')
    } catch (err) {
      setError('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setImageUrl('')
    setPreview('')
    setError('')
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setFile(null)
    setImageUrl('')
    setPreview('')
    setError('')
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Mode Selector */}
      <div className="mb-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => switchMode('file')}
            type='button'
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === 'file'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload File
          </button>
          <button
            onClick={() => switchMode('url')}
            type='button'
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === 'url'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Image URL
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        {/* Column 1 - Input */}
        <div className="flex-shrink-0">
          {mode === 'file' ? (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Choose File
              </label>
            </>
          ) : (
            <input
              type="url"
              placeholder="Enter image URL..."
              value={imageUrl}
              onChange={onUrlChange}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200 min-w-[200px]"
            />
          )}
        </div>

        {/* Divider */}
        <div className="mx-4 h-12 border-l border-gray-200"></div>

        {/* Column 2 - File/URL Info */}
        <div className="flex-1">
          {(mode === 'file' && file) || (mode === 'url' && imageUrl) ? (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-700 truncate max-w-xs">
                  {mode === 'file' ? file.name : imageUrl}
                </span>
              </div>
              <button
                onClick={removeFile}
                className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                type="button"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="p-3 text-sm text-gray-500 bg-gray-50 rounded-md border border-dashed">
              {mode === 'file' ? 'No file selected' : 'No URL entered'}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mx-4 h-12 border-l border-gray-200"></div>

        {/* Column 3 - Submit Button */}
        <div className="flex-shrink-0">
          <button
            disabled={
              (mode === 'file' && !file) || 
              (mode === 'url' && !imageUrl) || 
              uploading
            }
            onClick={uploadFile}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-md shadow-sm transition-colors duration-200 flex items-center"
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Submit
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Image Preview */}
      {preview && (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">Preview</h3>
          </div>
          <div className="p-4">
            <div className="relative inline-block">
              <img 
                src={preview} 
                alt="Preview" 
                className="max-w-full h-auto max-h-96 rounded-md shadow-sm border border-gray-200"
                onError={() => setError('Failed to load image preview')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploader