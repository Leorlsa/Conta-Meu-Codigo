/* eslint-disable */

import React, { useState, useRef } from 'react'

interface AnalysisOptions {
  ignoreComments: boolean
  showMostUsedWords: boolean
  showComplexity: boolean
}

interface UploadSectionProps {
  onAnalyze: (files: FileList, options: AnalysisOptions) => void
}

const UploadSection: React.FC<UploadSectionProps> = ({ onAnalyze }) => {
  const [files, setFiles] = useState<FileList | null>(null)
  const [options, setOptions] = useState<AnalysisOptions>({
    ignoreComments: false,
    showMostUsedWords: false,
    showComplexity: false,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      setFiles(e.dataTransfer.files)
    }
  }

  const handleOptionChange = (option: keyof AnalysisOptions) => {
    setOptions((prev) => ({ ...prev, [option]: !prev[option] }))
  }

  const handleAnalyze = () => {
    if (files) {
      onAnalyze(files, options)
    }
  }

  return (
    <section className="backdrop-blur-lg bg-black bg-opacity-50 rounded-lg p-6 mb-8 shadow-lg border border-cyan-800">
      <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Contador de Linhas de Código</h2>
      <p className="text-lg text-cyan-300 mb-4">Descubra quantas linhas de código seu projeto tem em segundos.</p>
      <div
        className="border-2 border-dashed border-cyan-700 rounded-lg p-8 mb-4 text-center cursor-pointer transition-all hover:border-cyan-500 hover:bg-cyan-900 hover:bg-opacity-20"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
      >
        <p className="mb-2 text-cyan-300">Arraste e solte seus arquivos ou clique para selecionar</p>
        <p className="text-sm text-cyan-500">
          {files ? `${files.length} arquivo(s) selecionado(s)` : 'Suporta múltiplos arquivos e pastas'}
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          webkitdirectory=""
          directory=""
          className="hidden"
        />
      </div>
      <div className="mb-4 space-y-2">
        {Object.entries(options).map(([key, value]) => (
          <label key={key} className="flex items-center text-cyan-300">
            <input
              type="checkbox"
              checked={value}
              onChange={() => handleOptionChange(key as keyof AnalysisOptions)}
              className="mr-2 form-checkbox text-cyan-500 rounded focus:ring-cyan-500 focus:ring-offset-black"
            />
            {key === 'ignoreComments' && 'Ignorar comentários'}
            {key === 'showMostUsedWords' && 'Exibir palavras mais usadas'}
            {key === 'showComplexity' && 'Mostrar complexidade de código'}
          </label>
        ))}
      </div>
      <button
        onClick={handleAnalyze}
        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-6 rounded-full transition-all hover:from-cyan-600 hover:to-blue-600 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 shadow-lg hover:shadow-cyan-500/50"
        disabled={!files}
      >
        Contar Linhas de Código
      </button>
    </section>
  )
}

export default UploadSection
