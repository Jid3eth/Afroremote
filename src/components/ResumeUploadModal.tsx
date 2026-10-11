import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Sparkles, CheckCircle2, RefreshCw, AlertCircle, Edit3 } from 'lucide-react';
import { CandidateProfile } from '../types/index.js';

interface ResumeUploadModalProps {
  onClose: () => void;
  onUploadSuccess: (profile: CandidateProfile) => void;
  onOpenEditor: () => void;
}

export const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  onClose,
  onUploadSuccess,
  onOpenEditor,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customText, setCustomText] = useState('');
  const [useTextInput, setUseTextInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMessage(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setErrorMessage(null);
    }
  };

  const handleProcessUpload = async () => {
    if (!file && (!customText || customText.trim().length === 0)) {
      setErrorMessage('Please select a resume file (.pdf, .docx, .txt) or paste your resume text');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      let payload: any = {};

      if (file) {
        const isPdf = file.name.endsWith('.pdf') || file.type.includes('pdf');
        const reader = new FileReader();

        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.includes(',') ? result.split(',')[1] : result;
            resolve(base64);
          };
          reader.onerror = reject;
        });

        reader.readAsDataURL(file);
        const base64Data = await base64Promise;

        payload = {
          base64Data,
          mimeType: file.type || (isPdf ? 'application/pdf' : 'text/plain'),
          filename: file.name,
        };
      } else {
        payload = {
          text: customText,
          filename: 'Pasted_Resume.txt',
        };
      }

      const res = await fetch('/api/resume/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to parse resume');
      }

      onUploadSuccess(data.profile);
      onClose();
    } catch (err: any) {
      console.error('Upload error:', err);
      setErrorMessage(err.message || 'Error parsing resume with Gemini AI');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 text-white space-y-4 max-h-[95vh] overflow-y-auto">
        <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Upload Your Resume</h2>
              <p className="text-[11px] text-zinc-400">Gemini parses skills, ATS score & vector embeddings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggle between file or text */}
        <div className="flex items-center justify-between text-xs bg-black p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setUseTextInput(false)}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
              !useTextInput ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Document File (.PDF / .DOCX)
          </button>
          <button
            onClick={() => setUseTextInput(true)}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
              useTextInput ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Paste Plain Text
          </button>
        </div>

        {!useTextInput ? (
          /* File Drag & Drop */
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-zinc-700 hover:border-emerald-500/70 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition bg-black/40 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-zinc-800 group-hover:bg-emerald-950/80 group-hover:text-emerald-400 border border-zinc-700 flex items-center justify-center text-zinc-400 transition mb-2.5 sm:mb-3">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            {file ? (
              <div>
                <p className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{file.name}</span>
                </p>
                <p className="text-[11px] text-zinc-400 mt-1">{(file.size / 1024).toFixed(1)} KB • Click to change</p>
              </div>
            ) : (
              <div>
                <p className="text-xs sm:text-sm font-semibold text-zinc-200">
                  Drop your resume here or <span className="text-emerald-400 underline">browse files</span>
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">Supports PDF, DOCX, and TXT files</p>
              </div>
            )}
          </div>
        ) : (
          /* Plain Text Area */
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-400">Paste Resume Text / Summary</label>
            <textarea
              rows={6}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Paste your resume content, experience, and projects here..."
              className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 leading-relaxed focus:outline-none focus:border-emerald-500 font-mono resize-none"
            />
          </div>
        )}

        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 2-Minute Resume Builder Alternative */}
        <div className="p-3.5 rounded-2xl bg-black/60 border border-zinc-800 flex items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-bold text-white text-xs flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Don't have a resume?</span>
            </div>
            <p className="text-[11px] text-zinc-400">Build one in 2 minutes quick and update anytime</p>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenEditor();
            }}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 font-bold text-xs shrink-0 transition"
          >
            Build Resume
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 pt-2 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleProcessUpload}
            disabled={isUploading || (!file && !customText.trim())}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-black text-xs font-bold shadow-lg shadow-emerald-500/20 transition disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Parsing with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Parse & Match Jobs</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
