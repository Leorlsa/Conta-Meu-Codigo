/* eslint-disable */

import React, { useState } from 'react'
import Header from './ui/Header'
import UploadSection from './ui/UploadSection'
import ResultsSection from './ui/ResultsSection'
import BackgroundAnimation from './ui/BackgroundAnimation'

interface FileDebugInfo {
  name: string
  lines: number | null
  complexity: number | null
  type: 'code'
  debugStatements?: Array<{
    line: number
    content: string
    type: string
  }>
}

const App: React.FC = () => {
  const [results, setResults] = useState<{
    totalLines: number
    totalFiles: number
    totalComments: number
    languageBreakdown: Record<string, number>
    fileDetails: FileDebugInfo[]
    averageFileSize: number
    debugStatementsFound: number
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

  // Adicione este objeto com os padrões de debug por linguagem
  const debugPatterns: Record<string, { pattern: RegExp; type: string }[]> = {
    'JavaScript': [
      { pattern: /console\.(log|debug|info|warn|error|trace)\s*\([^)]*\)/g, type: 'Console' },
      { pattern: /debugger;?/g, type: 'Debugger' }
    ],
    'TypeScript': [
      { pattern: /console\.(log|debug|info|warn|error|trace)\s*\([^)]*\)/g, type: 'Console' },
      { pattern: /debugger;?/g, type: 'Debugger' }
    ],
    'Python': [
      { pattern: /^\s*print\s*\([^)]*\)/g, type: 'Print' },
      { pattern: /logging\.(debug|info|warning|error|critical)\s*\([^)]*\)/g, type: 'Logging' },
      { pattern: /^\s*print\s*["'][^"']*["']/g, type: 'Print String' },
      { pattern: /^\s*print\s*f["'][^"']*["']/g, type: 'Print F-String' }
    ],
    'Java': [
      { pattern: /System\.out\.(println|print)\s*\([^)]*\)/g, type: 'Print' },
      { pattern: /Log\.(d|v|i|w|e)\s*\([^)]*\)/g, type: 'Android Log' },
      { pattern: /Logger\.(debug|info|warning|error)\s*\([^)]*\)/g, type: 'Logger' }
    ],
    'PHP': [
      { pattern: /var_dump\s*\([^)]*\)/g, type: 'Var Dump' },
      { pattern: /print_r\s*\([^)]*\)/g, type: 'Print R' },
      { pattern: /error_log\s*\([^)]*\)/g, type: 'Error Log' },
      { pattern: /^\s*echo\s+[^;]+;/g, type: 'Echo' }
    ],
    'Ruby': [
      { pattern: /^\s*puts\s+.*/g, type: 'Puts' },
      { pattern: /^\s*p\s+.*/g, type: 'P' },
      { pattern: /^\s*pp\s+.*/g, type: 'PP' },
      { pattern: /Rails\.logger\.(debug|info|warn|error)\s*\([^)]*\)/g, type: 'Logger' }
    ],
    'Go': [
      { pattern: /fmt\.Print(ln|f)?\s*\([^)]*\)/g, type: 'Print' },
      { pattern: /log\.(Printf|Println|Print)\s*\([^)]*\)/g, type: 'Log' }
    ],
    'C#': [
      { pattern: /Console\.(WriteLine|Write)\s*\([^)]*\)/g, type: 'Console' },
      { pattern: /Debug\.(WriteLine|Write)\s*\([^)]*\)/g, type: 'Debug' },
      { pattern: /Trace\.(WriteLine|Write)\s*\([^)]*\)/g, type: 'Trace' }
    ]
  }

  // Função auxiliar para verificar se a linha é um print de debug
  const isDebugStatement = (line: string, patterns: { pattern: RegExp; type: string }[]): boolean => {
    // Ignora linhas que são parte de uma string
    if (line.trim().startsWith('"') || line.trim().startsWith("'")) {
      return false;
    }

    // Ignora linhas que são imports/requires
    if (line.includes('import ') || line.includes('require(') || line.includes('from ')) {
      return false;
    }

    // Ignora linhas que são declarações de variáveis
    if (line.includes(' = ') && !line.includes('console.') && !line.includes('print(')) {
      return false;
    }

    // Ignora linhas que são comentários
    if (line.trim().startsWith('//') || line.trim().startsWith('#') || line.trim().startsWith('/*')) {
      return false;
    }

    return patterns.some(({ pattern }) => pattern.test(line));
  }

  const handleAnalysis = (files: FileList, options: AnalysisOptions) => {
    const fileDetails: FileDebugInfo[] = []
    let totalLines = 0
    let totalComments = 0
    let totalFileSize = 0
    let totalDebugStatements = 0
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
        totalComments: 0,
        languageBreakdown: {},
        fileDetails: [],
        averageFileSize: 0,
        debugStatementsFound: 0
      })
      return
    }

    filteredFiles.forEach((file) => {
      const reader = new FileReader()
      const extension = file.name.split('.').pop()?.toLowerCase() || 'unknown'

      reader.onload = (event) => {
        try {
          const content = event.target?.result as string
          const lines = content.split('\n')
          totalFileSize += content.length

          // Detectar declarações de debug
          const debugStatements: Array<{ line: number; content: string; type: string }> = []
          if (options.detectDebugStatements) {
            const language = languageMap[extension] || 'Outros'
            const patterns = debugPatterns[language] || []

            lines.forEach((line, index) => {
              if (options.detectDebugStatements) {
                const language = languageMap[extension] || 'Outros'
                const patterns = debugPatterns[language] || []

                if (isDebugStatement(line, patterns)) {
                  patterns.forEach(({ pattern, type }) => {
                    const matches = line.match(pattern)
                    if (matches) {
                      debugStatements.push({
                        line: index + 1,
                        content: line.trim(),
                        type
                      })
                      totalDebugStatements++
                    }
                  })
                }
              }
            })
          }

          // Contar comentários
          const commentLines = content.split('\n').filter(line => {
            const trimmedLine = line.trim()
            return (
              trimmedLine.startsWith('//') ||
              trimmedLine.startsWith('/*') ||
              trimmedLine.startsWith('#') ||
              trimmedLine.startsWith('--') ||
              trimmedLine.startsWith('<!--')
            )
          }).length
          totalComments += commentLines

          // Ajustar total de linhas se a opção estiver ativada
          const effectiveLines = options.ignoreCommentsInTotal ? lines.length - commentLines : lines.length
          totalLines += effectiveLines

          // Detectar linguagem baseada na extensão do arquivo
          const language = languageMap[extension] || 'Outros'
          if (!languageBreakdown[language]) {
            languageBreakdown[language] = 0
          }
          languageBreakdown[language] += effectiveLines

          fileDetails.push({
            name: file.name,
            lines: effectiveLines,
            complexity: null,
            type: 'code',
            debugStatements: debugStatements.length > 0 ? debugStatements : undefined
          })
        } catch (error) {
          console.error(`Erro ao processar o conteúdo do arquivo: ${file.name}`, error)
          fileDetails.push({ name: file.name, lines: null, complexity: null, type: 'code' })
        }

        processedCount += 1

        if (processedCount === filteredFiles.length) {
          const averageFileSize = totalFileSize / filteredFiles.length
          setResults({
            totalLines,
            totalFiles: filteredFiles.length,
            totalComments,
            languageBreakdown,
            fileDetails,
            averageFileSize,
            debugStatementsFound: totalDebugStatements
          })
        }
      }

      reader.onerror = () => {
        console.error(`Erro ao ler o arquivo: ${file.name}`)
        fileDetails.push({ name: file.name, lines: null, complexity: null, type: 'code' })
        processedCount += 1
        if (processedCount === filteredFiles.length) {
          const averageFileSize = totalFileSize / filteredFiles.length
          setResults({
            totalLines,
            totalFiles: filteredFiles.length,
            totalComments,
            languageBreakdown,
            fileDetails,
            averageFileSize,
            debugStatementsFound: totalDebugStatements
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
