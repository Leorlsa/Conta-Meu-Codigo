/* eslint-disable */

import React, { useState, useEffect, useRef } from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { motion } from 'framer-motion'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

interface ResultsSectionProps {
  results: {
    totalLines: number
    totalFiles: number
    totalComments: number
    languageBreakdown: Record<string, number>
    fileDetails: Array<{
      name: string
      lines: number | null
      type: 'code'
      debugStatements?: Array<{
        line: number
        content: string
        type: string
      }>
    }>
    averageFileSize: number
    debugStatementsFound: number
  }
}

const languageColors: Record<string, string> = {
  JavaScript: 'rgba(255, 223, 0, 0.8)',
  TypeScript: 'rgba(0, 122, 204, 0.8)',
  Python: 'rgba(53, 114, 165, 0.8)',
  Java: 'rgba(176, 114, 25, 0.8)',
  'C++': 'rgba(0, 0, 255, 0.8)',
  'C#': 'rgba(0, 122, 204, 0.8)',
  Ruby: 'rgba(204, 0, 0, 0.8)',
  PHP: 'rgba(79, 93, 149, 0.8)',
  HTML: 'rgba(227, 76, 38, 0.8)',
  CSS: 'rgba(86, 61, 124, 0.8)',
  Swift: 'rgba(255, 45, 85, 0.8)',
  Kotlin: 'rgba(255, 87, 34, 0.8)',
  Go: 'rgba(0, 173, 216, 0.8)',
  Rust: 'rgba(222, 165, 132, 0.8)',
  'Shell Script': 'rgba(0, 128, 0, 0.8)',
  Bash: 'rgba(0, 128, 0, 0.8)',
  Lua: 'rgba(0, 0, 255, 0.8)',
  Perl: 'rgba(0, 0, 255, 0.8)',
  R: 'rgba(25, 25, 112, 0.8)',
  Scala: 'rgba(204, 0, 0, 0.8)',
  Groovy: 'rgba(0, 128, 0, 0.8)',
  Dart: 'rgba(0, 122, 204, 0.8)',
  XML: 'rgba(255, 165, 0, 0.8)',
  JSON: 'rgba(255, 165, 0, 0.8)',
  YAML: 'rgba(255, 165, 0, 0.8)',
  Markdown: 'rgba(0, 0, 0, 0.8)',
  'Plain Text': 'rgba(128, 128, 128, 0.8)',
  SQL: 'rgba(0, 128, 0, 0.8)',
  C: 'rgba(0, 0, 255, 0.8)',
  'C Header': 'rgba(0, 0, 255, 0.8)',
  Assembly: 'rgba(128, 128, 128, 0.8)',
  'Visual Basic': 'rgba(0, 122, 204, 0.8)',
  'JavaScript (React)': 'rgba(255, 223, 0, 0.8)',
  'TypeScript (React)': 'rgba(0, 122, 204, 0.8)',
  'INI Configuration': 'rgba(128, 128, 128, 0.8)',
  'TOML Configuration': 'rgba(128, 128, 128, 0.8)',
  'Configuration File': 'rgba(128, 128, 128, 0.8)',
  Dockerfile: 'rgba(0, 0, 255, 0.8)',
  Makefile: 'rgba(0, 0, 255, 0.8)',
  Gradle: 'rgba(0, 0, 255, 0.8)',
  'Batch File': 'rgba(0, 0, 255, 0.8)',
  PowerShell: 'rgba(0, 0, 255, 0.8)',
  'Sass (SCSS)': 'rgba(86, 61, 124, 0.8)',
  LESS: 'rgba(86, 61, 124, 0.8)',
  Sass: 'rgba(86, 61, 124, 0.8)',
  'Vue.js': 'rgba(65, 184, 131, 0.8)',
  Svelte: 'rgba(255, 69, 0, 0.8)',
  Elm: 'rgba(96, 181, 204, 0.8)',
  Erlang: 'rgba(204, 0, 0, 0.8)',
  Elixir: 'rgba(102, 51, 153, 0.8)',
  'Elixir Script': 'rgba(102, 51, 153, 0.8)',
  Clojure: 'rgba(0, 128, 0, 0.8)',
  ClojureScript: 'rgba(0, 128, 0, 0.8)',
  Handlebars: 'rgba(255, 165, 0, 0.8)',
  Pug: 'rgba(255, 165, 0, 0.8)',
  Jade: 'rgba(255, 165, 0, 0.8)',
  CSV: 'rgba(128, 128, 128, 0.8)',
  TSV: 'rgba(128, 128, 128, 0.8)',
  'Log File': 'rgba(128, 128, 128, 0.8)',
  LaTeX: 'rgba(0, 0, 0, 0.8)',
  BibTeX: 'rgba(0, 0, 0, 0.8)',
  Nim: 'rgba(255, 165, 0, 0.8)',
  Ada: 'rgba(255, 165, 0, 0.8)',
  Pascal: 'rgba(255, 165, 0, 0.8)',
  OCaml: 'rgba(255, 165, 0, 0.8)',
  'Standard ML': 'rgba(255, 165, 0, 0.8)',
  'Fortran 90': 'rgba(255, 165, 0, 0.8)',
  'Fortran 95': 'rgba(255, 165, 0, 0.8)',
  Prolog: 'rgba(255, 165, 0, 0.8)',
  Racket: 'rgba(255, 165, 0, 0.8)',
  AWK: 'rgba(255, 165, 0, 0.8)',
  Gnuplot: 'rgba(255, 165, 0, 0.8)',
  VHDL: 'rgba(255, 165, 0, 0.8)',
  Verilog: 'rgba(255, 165, 0, 0.8)',
  QML: 'rgba(255, 165, 0, 0.8)',
  Haxe: 'rgba(255, 165, 0, 0.8)',
  Zig: 'rgba(255, 165, 0, 0.8)',
  MATLAB: 'rgba(255, 165, 0, 0.8)',
  'MATLAB Data': 'rgba(255, 165, 0, 0.8)',
  Fortran: 'rgba(255, 165, 0, 0.8)',
  D: 'rgba(255, 165, 0, 0.8)',
  Tcl: 'rgba(255, 165, 0, 0.8)',
  Solidity: 'rgba(255, 165, 0, 0.8)',
  WebAssembly: 'rgba(255, 165, 0, 0.8)',
  'C++ Module': 'rgba(255, 165, 0, 0.8)',
  Outros: 'rgba(128, 128, 128, 0.8)',
}

// Adicione estas configurações de animação
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
}

const cardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 30
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

const scrollStyle: React.CSSProperties = {
  scrollBehavior: 'smooth',
  overflowY: 'auto',
  height: '100vh',
  padding: '2rem'
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ results }) => {
  console.log('Dados recebidos pelo ResultsSection:', results)

  // Filtra apenas as linguagens com linhas de código
  const validLanguages = Object.entries(results.languageBreakdown).filter(
    ([, lines]) => lines > 0
  )

  const languageData = {
    labels: validLanguages.map(([language]) => language),
    datasets: [
      {
        data: validLanguages.map(([, lines]) => lines),
        backgroundColor: validLanguages.map(
          ([language]) => languageColors[language] || 'rgba(128, 128, 128, 0.8)'
        ),
      },
    ],
  }

  // Filtra apenas os arquivos com linhas de código válidas
  const validFileDetails = results.fileDetails.filter((file) => file.lines !== null && file.lines > 0)

  const fileData = {
    labels: validFileDetails.map((file) => file.name),
    datasets: [
      {
        label: 'Linhas de Código',
        data: validFileDetails.map((file) => file.lines as number),
        backgroundColor: 'rgba(0, 255, 255, 0.8)',
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(103, 232, 249)',
          padding: 20,
          font: {
            size: 12
          }
        },
      },
      title: {
        display: true,
        text: 'Detalhes por Arquivo',
        color: 'rgb(103, 232, 249)',
        font: {
          size: 16,
          weight: 'bold' as const
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgb(103, 232, 249)',
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(103, 232, 249, 0.1)',
          drawBorder: false
        }
      },
      y: {
        ticks: {
          color: 'rgb(103, 232, 249)',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(103, 232, 249, 0.1)',
          drawBorder: false
        }
      },
    },
  }

  const [showFunctionCode, setShowFunctionCode] = useState<{ [key: string]: boolean }>({});

  const toggleFunctionCode = (fileName: string) => {
    setShowFunctionCode(prev => ({ ...prev, [fileName]: !prev[fileName] }));
  };

  // Refs para cada seção
  const statsRef = useRef<HTMLDivElement>(null)
  const chartsRef = useRef<HTMLDivElement>(null)
  const debugRef = useRef<HTMLDivElement>(null)

  // Refs para os gráficos
  const pieChartRef = useRef<ChartJS<"pie">>(null);
  const barChartRef = useRef<ChartJS<"bar">>(null);

  const handleDownload = (type: 'json' | 'png') => {
    if (type === 'json') {
      // Preparar dados para JSON
      const jsonData = {
        totalLines: results.totalLines,
        totalFiles: results.totalFiles,
        totalComments: results.totalComments,
        languageBreakdown: results.languageBreakdown,
        fileDetails: results.fileDetails,
        averageFileSize: results.averageFileSize,
        debugStatementsFound: results.debugStatementsFound,
        exportDate: new Date().toISOString()
      };

      // Criar e baixar arquivo JSON
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `code-analysis-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (type === 'png') {
      // Baixar gráficos como PNG
      const downloadChart = (chartRef: React.RefObject<ChartJS>, filename: string) => {
        if (chartRef.current) {
          const url = chartRef.current.toBase64Image('image/png', 1.0);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      };

      // Baixar ambos os gráficos
      downloadChart(pieChartRef, `language-distribution-${new Date().toISOString().split('T')[0]}.png`);
      downloadChart(barChartRef, `file-details-${new Date().toISOString().split('T')[0]}.png`);
    }
  };

  useEffect(() => {
    const sections = [
      { ref: statsRef, delay: 400 },
      { ref: chartsRef, delay: 800 },
      { ref: debugRef, delay: 1200 }
    ]

    sections.forEach(({ ref, delay }) => {
      if (ref.current) {
        setTimeout(() => {
          ref.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }, delay)
      }
    })
  }, [])

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-black bg-opacity/50 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-cyan-800"
      style={scrollStyle}
    >
      <motion.h2 variants={itemVariants} className="text-2xl font-semibold mb-6 text-cyan-400">
        Resultados da Análise
      </motion.h2>

      {/* Estatísticas Gerais */}
      <motion.div
        ref={statsRef}
        variants={itemVariants}
        className={`grid grid-cols-1 md:grid-cols-2 ${results.averageFileSize ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 mb-8`}
      >
        <motion.div
          variants={cardVariants}
          className="bg-cyan-900 bg-opacity/30 p-4 rounded-lg border border-cyan-700"
          data-tooltip-id="tooltip-total-lines"
        >
          <h4 className="text-lg font-semibold mb-2 text-cyan-300">Total de Linhas</h4>
          <p className="text-2xl font-bold text-cyan-400">{results.totalLines}</p>
          <ReactTooltip id="tooltip-total-lines">
            Número total de linhas de código encontradas em todos os arquivos analisados
          </ReactTooltip>
        </motion.div>

        <motion.div
          variants={cardVariants}
          className="bg-cyan-900 bg-opacity/30 p-4 rounded-lg border border-cyan-700"
          data-tooltip-id="tooltip-total-files"
        >
          <h4 className="text-lg font-semibold mb-2 text-cyan-300">Total de Arquivos</h4>
          <p className="text-2xl font-bold text-cyan-400">{results.totalFiles}</p>
          <ReactTooltip id="tooltip-total-files">
            Quantidade total de arquivos analisados no projeto
          </ReactTooltip>
        </motion.div>

        <motion.div
          variants={cardVariants}
          className="bg-cyan-900 bg-opacity/30 p-4 rounded-lg border border-cyan-700"
          data-tooltip-id="tooltip-total-comments"
        >
          <h4 className="text-lg font-semibold mb-2 text-cyan-300">Total de Comentários</h4>
          <p className="text-2xl font-bold text-cyan-400">{results.totalComments}</p>
          <ReactTooltip id="tooltip-total-comments">
            Número total de linhas de comentários encontradas no código
          </ReactTooltip>
        </motion.div>

        {results.averageFileSize > 0 && (
          <motion.div
            variants={cardVariants}
            className="bg-cyan-900 bg-opacity/30 p-4 rounded-lg border border-cyan-700"
            data-tooltip-id="tooltip-avg-size"
          >
            <h4 className="text-lg font-semibold mb-2 text-cyan-300">Tamanho Médio</h4>
            <p className="text-2xl font-bold text-cyan-400">{(results.averageFileSize / 1024).toFixed(2)} KB</p>
            <ReactTooltip id="tooltip-avg-size">
              Tamanho médio dos arquivos analisados em kilobytes
            </ReactTooltip>
          </motion.div>
        )}
      </motion.div>

      {/* Gráficos */}
      <motion.div
        ref={chartsRef}
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
      >
        <motion.div
          variants={itemVariants}
          className="bg-cyan-900 bg-opacity/30 p-4 rounded-lg border border-cyan-700"
        >
          <h3 className="text-xl font-semibold mb-4 text-cyan-300">Distribuição por Linguagem</h3>
          <div className="h-[300px]">
            {validLanguages.length > 0 ? (
              <Pie data={languageData} options={chartOptions} ref={pieChartRef} />
            ) : (
              <p className="text-cyan-400">Nenhuma linguagem com linhas de código encontrada.</p>
            )}
          </div>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="bg-cyan-900 bg-opacity/30 p-4 rounded-lg border border-cyan-700"
        >
          <h3 className="text-xl font-semibold mb-4 text-cyan-300">Detalhes por Arquivo</h3>
          <div className="h-[400px]">
            {validFileDetails.length > 0 ? (
              <Bar
                data={fileData}
                options={{
                  ...chartOptions,
                  indexAxis: validFileDetails.length > 10 ? 'y' : 'x',
                  scales: {
                    ...chartOptions.scales,
                    x: {
                      ...chartOptions.scales.x,
                      ticks: {
                        ...chartOptions.scales.x.ticks,
                        maxRotation: validFileDetails.length > 10 ? 0 : 45,
                      }
                    }
                  }
                }}
                ref={barChartRef}
              />
            ) : (
              <p className="text-cyan-400">Nenhum arquivo com linhas de código encontrado.</p>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Debug Statements */}
      {results.debugStatementsFound > 0 && (
        <motion.div
          ref={debugRef}
          variants={itemVariants}
          className="bg-cyan-900 bg-opacity/30 p-4 rounded-lg border border-cyan-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-cyan-300">
              Logs/Prints Encontrados
            </h3>
            <span className="bg-cyan-700 text-cyan-100 px-3 py-1 rounded-full text-sm">
              {results.debugStatementsFound} encontrados
            </span>
          </div>

          <div className="space-y-4">
            {results.fileDetails
              .filter(file => file.debugStatements && file.debugStatements.length > 0)
              .map((file, index) => (
                <div key={index} className="border-t border-cyan-700 pt-4 first:border-t-0 first:pt-0">
                  <h4 className="text-cyan-400 font-semibold flex items-center gap-2">
                    <span>{file.name}</span>
                    <span className="text-sm bg-cyan-800 px-2 py-0.5 rounded">
                      {file.debugStatements?.length} logs
                    </span>
                  </h4>
                  <ul className="mt-2 space-y-2">
                    {file.debugStatements?.map((debug, idx) => (
                      <li key={idx} className="text-cyan-300 flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-cyan-500">Linha {debug.line}</span>
                          <span className="text-cyan-400 bg-cyan-800 px-2 rounded">{debug.type}</span>
                        </div>
                        <code className="text-cyan-200 bg-cyan-900/50 px-3 py-1.5 rounded block overflow-x-auto">
                          {debug.content}
                        </code>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Botão de Download */}
      <motion.div
        variants={itemVariants}
        className="mt-8 flex justify-end gap-4"
      >
        <button
          onClick={() => handleDownload('json')}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-6 rounded-full transition-all hover:from-cyan-600 hover:to-blue-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 shadow-lg hover:shadow-cyan-500/50 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          JSON
        </button>
        <button
          onClick={() => handleDownload('png')}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-6 rounded-full transition-all hover:from-cyan-600 hover:to-blue-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 shadow-lg hover:shadow-cyan-500/50 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          Gráficos PNG
        </button>
      </motion.div>
    </motion.section>
  )
}

export default ResultsSection

