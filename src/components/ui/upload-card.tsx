'use client'

import { useState, useRef } from 'react'
import { Upload } from 'lucide-react'

interface UploadCardProps {
  icon?: React.ReactNode
  title: string
  description: string
  onFileUpload?: (files: FileList) => void
  acceptedTypes?: string[]
  maxFileSize?: number // in MB
  className?: string
}

export function UploadCard({
  icon = <Upload className="h-8 w-8" />,
  title,
  description,
  onFileUpload,
  acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png'],
  maxFileSize = 10,
  className = ''
}: UploadCardProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleFiles(files)
    }
  }

  const handleFiles = (files: FileList) => {
    // Validate files
    const validFiles = Array.from(files).filter(file => {
      const isValidType = acceptedTypes.some(type => 
        file.type === type || 
        (type.includes('*') && file.type.startsWith(type.split('*')[0]))
      )
      const isValidSize = file.size <= maxFileSize * 1024 * 1024
      
      if (!isValidType) {
        alert(`Invalid file type: ${file.name}. Accepted types: ${acceptedTypes.join(', ')}`)
        return false
      }
      
      if (!isValidSize) {
        alert(`File too large: ${file.name}. Maximum size: ${maxFileSize}MB`)
        return false
      }
      
      return true
    })

    if (validFiles.length > 0 && onFileUpload) {
      const validFileList = new DataTransfer()
      validFiles.forEach(file => validFileList.items.add(file))
      onFileUpload(validFileList.files)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      className={`
        w-full max-w-[420px] h-[200px] 
        border-2 border-dashed rounded-xl
        bg-slate-50 
        flex flex-col items-center justify-center 
        cursor-pointer transition-all duration-200
        hover:shadow-md hover:shadow-black/5
        ${isDragOver 
          ? 'border-solid border-indigo-400 bg-indigo-50' 
          : 'border-indigo-200'
        }
        ${className}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="flex flex-col items-center space-y-3 text-center px-4">
        <div className="text-indigo-500">
          {icon}
        </div>
        
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
        
        <div className="text-xs text-gray-500">
          PDF, JPG, PNG ≤{maxFileSize}MB
        </div>
      </div>
    </div>
  )
}