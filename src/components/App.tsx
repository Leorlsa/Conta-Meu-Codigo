/* eslint-disable */

import React, { useState } from 'react'
import Header from './ui/Header'
import UploadSection from './ui/UploadSection'
import ResultsSection from './ui/ResultsSection'
import BackgroundAnimation from './ui/BackgroundAnimation'

const App: React.FC = () => {
  const [results, setResults] = useState<{
    totalLines: number
    totalFiles: number
    languageBreakdown: Record<string, number>
    fileDetails: {
      name: string
      lines: number | null
      complexity: number | null
      type: 'code' | 'binary'
    }[]
  } | null>(null)

  const languageMap: Record<string, string> = {
    js: 'JavaScript',
    ts: 'TypeScript',
    py: 'Python',
    java: 'Java',
    cpp: 'C++',
    cs: 'C#',
    rb: 'Ruby',
    php: 'PHP',
    html: 'HTML',
    css: 'CSS',
    swift: 'Swift',
    kt: 'Kotlin',
    go: 'Go',
    rs: 'Rust',
    sh: 'Shell Script',
    bash: 'Bash',
    lua: 'Lua',
    pl: 'Perl',
    r: 'R',
    scala: 'Scala',
    groovy: 'Groovy',
    dart: 'Dart',
    xml: 'XML',
    json: 'JSON',
    yml: 'YAML',
    yaml: 'YAML',
    md: 'Markdown',
    txt: 'Plain Text',
    sql: 'SQL',
    c: 'C',
    h: 'C Header',
    asm: 'Assembly',
    vb: 'Visual Basic',
    jsx: 'JavaScript (React)',
    tsx: 'TypeScript (React)',
    ini: 'INI Configuration',
    toml: 'TOML Configuration',
    conf: 'Configuration File',
    dockerfile: 'Dockerfile',
    makefile: 'Makefile',
    gradle: 'Gradle',
    bat: 'Batch File',
    ps1: 'PowerShell',
    pyc: 'Python Compiled',
    pyo: 'Python Optimized',
    coffee: 'CoffeeScript',
    scss: 'Sass (SCSS)',
    less: 'LESS',
    sass: 'Sass',
    vue: 'Vue.js',
    svelte: 'Svelte',
    elm: 'Elm',
    erlang: 'Erlang',
    ex: 'Elixir',
    exs: 'Elixir Script',
    clj: 'Clojure',
    cljs: 'ClojureScript',
    hbs: 'Handlebars',
    pug: 'Pug',
    jade: 'Jade',
    csv: 'CSV',
    tsv: 'TSV',
    log: 'Log File',
    tex: 'LaTeX',
    bib: 'BibTeX',
    nim: 'Nim',
    ada: 'Ada',
    pas: 'Pascal',
    ml: 'OCaml',
    sml: 'Standard ML',
    f90: 'Fortran 90',
    f95: 'Fortran 95',
    pro: 'Prolog',
    rkt: 'Racket',
    awk: 'AWK',
    gnuplot: 'Gnuplot',
    vhdl: 'VHDL',
    verilog: 'Verilog',
    qml: 'QML',
    haxe: 'Haxe',
    zig: 'Zig',
    m: 'MATLAB',
    mat: 'MATLAB Data',
    for: 'Fortran',
    d: 'D',
    tcl: 'Tcl',
    sol: 'Solidity',
    wasm: 'WebAssembly',
    cppm: 'C++ Module',
  }

  // Lista de extensões permitidas (whitelist) - apenas arquivos de código
  const allowedExtensions: string[] = [
    'js', 'ts', 'py', 'java', 'cpp', 'cs', 'rb', 'php', 'html', 'css',
    'swift', 'kt', 'go', 'rs', 'sh', 'bash', 'lua', 'pl', 'r', 'scala',
    'groovy', 'dart', 'yml', 'md', 'txt', 'sql',
    'c', 'h', 'asm', 'vb', 'jsx', 'tsx', 'ini', 'toml', 'conf', 'dockerfile',
    'makefile', 'gradle', 'bat', 'ps1', 'pyo', 'coffee', 'scss',
    'less', 'sass', 'vue', 'svelte', 'elm', 'erlang', 'ex', 'exs',
    'clj', 'cljs', 'hbs', 'pug', 'jade', 'csv', 'tsv', 'log', 'tex',
    'bib', 'nim', 'ada', 'pas', 'ml', 'sml', 'f90', 'f95', 'pro',
    'rkt', 'awk', 'gnuplot', 'vhdl', 'verilog', 'qml', 'haxe', 'zig',
    'm', 'mat', 'for', 'd', 'tcl', 'sol', 'wasm', 'cppm',
  ]

  // Lista de diretórios a serem ignorados
  const excludedDirectories: string[] = [
    'node_modules',
    '__pycache__',
    'dist',
    'build',
    '.git',
    '.cache',
    'coverage',
    'vendor',
    'lib',
    'venv'
  ]

  const isAllowedFile = (filePath: string) => {
    const extension = filePath.split('.').pop()?.toLowerCase()
    if (!extension || !allowedExtensions.includes(extension)) {
      return false
    }

    // Verifica se o arquivo está em algum diretório excluído
    return !excludedDirectories.some(dir => {
      const dirPattern = new RegExp(`(^|/)${dir}(/|$)`, 'i')
      return dirPattern.test(filePath)
    })
  }

  const handleAnalysis = (files: FileList) => {
    const fileDetails: { name: string; lines: number | null; complexity: number | null; type: 'code' }[] = []
    let totalLines = 0
    const languageBreakdown: Record<string, number> = {}
    let processedCount = 0

    // Filtra os arquivos que são permitidos
    const filteredFiles = Array.from(files).filter((file) => {
      const filePath = file.webkitRelativePath || file.name;
      return isAllowedFile(filePath);
    })

    if (filteredFiles.length === 0) {
      setResults({
        totalLines: 0,
        totalFiles: 0,
        languageBreakdown: {},
        fileDetails: [],
      })
      return
    }

    filteredFiles.forEach((file) => {
      const reader = new FileReader()
      const extension = file.name.split('.').pop()?.toLowerCase() || 'unknown'

      // Processa apenas arquivos de código
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string
          const lines = content.split('\n').length
          totalLines += lines

          // Detectar linguagem baseada na extensão do arquivo
          const language = languageMap[extension] || 'Outros'
          if (!languageBreakdown[language]) {
            languageBreakdown[language] = 0
          }
          languageBreakdown[language] += lines

          // Calcular complexidade de forma simplificada
          const complexity = Math.floor(lines / 10) // Exemplo de cálculo de complexidade
          fileDetails.push({ name: file.name, lines, complexity, type: 'code' })
        } catch (error) {
          console.error(`Erro ao processar o conteúdo do arquivo: ${file.name}`, error)
          fileDetails.push({ name: file.name, lines: null, complexity: null, type: 'code' })
        }

        processedCount += 1

        // Atualizar resultados quando todos os arquivos forem processados
        if (processedCount === filteredFiles.length) {
          setResults({
            totalLines,
            totalFiles: filteredFiles.length,
            languageBreakdown,
            fileDetails,
          })
        }
      }

      // Tratamento de erros na leitura do arquivo
      reader.onerror = () => {
        console.error(`Erro ao ler o arquivo: ${file.name}`)
        fileDetails.push({ name: file.name, lines: null, complexity: null, type: 'code' })
        processedCount += 1
        if (processedCount === filteredFiles.length) {
          setResults({
            totalLines,
            totalFiles: filteredFiles.length,
            languageBreakdown,
            fileDetails,
          })
        }
      }

      reader.readAsText(file)
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-cyan-400">
      <BackgroundAnimation />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <UploadSection onAnalyze={handleAnalysis} />
          {results && <ResultsSection results={results} />}
        </main>
      </div>
    </div>
  )
}

export default App
