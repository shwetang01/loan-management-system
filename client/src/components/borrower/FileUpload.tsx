'use client';

import React, { useState } from 'react';
import { UploadCloud, CheckCircle } from 'lucide-react';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
        {file ? (
          <div className="text-center space-y-2">
            <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
            <p className="font-semibold text-sm text-slate-700">{file.name}</p>
            <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <UploadCloud className="h-10 w-10 text-slate-400 mx-auto" />
            <p className="font-semibold text-sm text-slate-700">Click to upload document</p>
            <p className="text-xs text-slate-400">PDF, JPG, or PNG up to 5MB</p>
          </div>
        )}
      </label>
    </div>
  );
}
