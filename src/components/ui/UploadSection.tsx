/* eslint-disable */

import React, { useState, useRef } from 'react'
import { Tooltip } from 'react-tooltip'

interface AnalysisOptions {
  ignoreCommentsInTotal: boolean
  showAverageFileSize: boolean
  detectDebugStatements: boolean
}

interface UploadSectionProps {
  onAnalyze: (files: FileList, options: AnalysisOptions) => void
}

// Adicione esta interface para estender os tipos do input HTML
interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  webkitdirectory?: string;
  directory?: string;
}

// Crie um componente de input personalizado
const FileInput = React.forwardRef<HTMLInputElement, CustomInputProps>((props, ref) => (
  <input {...props} ref={ref} />
));

const UploadSection: React.FC<UploadSectionProps> = ({ onAnalyze }) => {
  const [files, setFiles] = useState<FileList | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [options, setOptions] = useState<AnalysisOptions>({
    ignoreCommentsInTotal: false,
    showAverageFileSize: false,
    detectDebugStatements: false,
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

  const handleAnalyze = async () => {
    if (!files || files.length === 0) {
      setError('Por favor, selecione pelo menos um arquivo para análise.')
      return
    }

    setIsAnalyzing(true)
    setError(null)
    try {
      await onAnalyze(files, options)
    } catch (err) {
      setError('Ocorreu um erro durante a análise. Por favor, tente novamente.')
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <section className="backdrop-blur-lg bg-black bg-opacity-50 rounded-lg p-6 mb-8 shadow-lg border border-cyan-800">
      <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Contador de Linhas de Código</h2>
      <p className="text-lg text-cyan-300 mb-4">Descubra quantas linhas de código seu projeto tem em segundos.</p>
      <div
        className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center cursor-pointer transition-all
          ${isAnalyzing ? 'border-cyan-400 bg-cyan-900/20' : 'border-cyan-700 hover:border-cyan-500 hover:bg-cyan-900/20'}`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !isAnalyzing && fileInputRef.current?.click()}
      >
        {isAnalyzing ? (
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            <p className="text-cyan-300">Analisando arquivos...</p>
          </div>
        ) : (
          <>
            <p className="mb-2 text-cyan-300">Arraste e solte seus arquivos ou clique para selecionar</p>
            <p className="text-sm text-cyan-500">
              {files ? `${files.length} arquivo(s) selecionado(s)` : 'Suporta múltiplos arquivos e pastas'}
            </p>
          </>
        )}
        <FileInput
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          webkitdirectory=""
          directory=""
          className="hidden"
          disabled={isAnalyzing}
        />
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400">
          {error}
        </div>
      )}
      <div className="mb-4 space-y-4">
        {Object.entries(options).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleOptionChange(key as keyof AnalysisOptions)}
                  className="sr-only peer"
                  disabled={isAnalyzing}
                />
                <div className="w-11 h-6 bg-cyan-900/50 rounded-full peer
                  peer-checked:after:translate-x-full peer-checked:after:border-white
                  after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                  after:bg-cyan-300 after:rounded-full after:h-5 after:w-5
                  after:transition-all peer-checked:bg-gradient-to-r from-cyan-500 to-blue-500
                  peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
                  after:shadow-lg hover:after:scale-95">
                </div>
              </label>
              <span className="text-cyan-300 select-none">
                {key === 'ignoreCommentsInTotal' && 'Ignorar comentários no total de linhas'}
                {key === 'showAverageFileSize' && 'Mostrar tamanho médio dos arquivos'}
                {key === 'detectDebugStatements' && 'Detectar logs/prints esquecidos'}
              </span>
              <button
                data-tooltip-id={`tooltip-${key}`}
                className="text-cyan-500 hover:text-cyan-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </button>
              <Tooltip id={`tooltip-${key}`} place="right">
                {key === 'ignoreCommentsInTotal' &&
                  'Exclui linhas de comentários da contagem total de linhas de código'}
                {key === 'showAverageFileSize' &&
                  'Calcula e exibe o tamanho médio dos arquivos analisados'}
                {key === 'detectDebugStatements' &&
                  'Identifica declarações de debug como console.log, print, etc.'}
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleAnalyze}
        disabled={!files || files.length === 0 || isAnalyzing}
        className={`
          bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-6
          rounded-full transition-all transform focus:outline-none focus:ring-2
          focus:ring-cyan-500 focus:ring-opacity-50 shadow-lg
          ${(!files || files.length === 0 || isAnalyzing)
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:from-cyan-600 hover:to-blue-600 hover:scale-105 hover:shadow-cyan-500/50'
          }
        `}
      >
        {isAnalyzing ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Analisando...</span>
          </div>
        ) : (
          'Contar Linhas de Código'
        )}
      </button>
    </section>
  )
}

export default UploadSection
