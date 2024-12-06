/* eslint-disable */

import React from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

interface ResultsSectionProps {
  results: {
    totalLines: number
    totalFiles: number
    languageBreakdown: Record<string, number>
    fileDetails: Array<{ name: string; lines: number | null; complexity: number | null; type: 'code' }>
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
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(103, 232, 249)',
        },
      },
      title: {
        display: true,
        text: 'Detalhes por Arquivo',
        color: 'rgb(103, 232, 249)',
      },
    },
    scales: {
      x: {
        ticks: { color: 'rgb(103, 232, 249)' },
        grid: { color: 'rgba(103, 232, 249, 0.1)' },
      },
      y: {
        ticks: { color: 'rgb(103, 232, 249)' },
        grid: { color: 'rgba(103, 232, 249, 0.1)' },
      },
    },
  }

  return (
    <section className="bg-black bg-opacity/50 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-cyan-800">
      <h2 className="text-2xl font-semibold mb-6 text-cyan-400">Resultados da Análise</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-cyan-900 bg-opacity/30 p-4 rounded-lg border border-cyan-700">
          <h3 className="text-xl font-semibold mb-4 text-cyan-300">Estatísticas Gerais</h3>
          <p className="text-cyan-400">
            Total de linhas: <span className="font-bold text-cyan-300">{results.totalLines}</span>
          </p>
          <p className="text-cyan-400">
            Total de arquivos: <span className="font-bold text-cyan-300">{results.totalFiles}</span>
          </p>
        </div>
        <div className="bg-cyan-900 bg-opacity/30 p-4 rounded-lg border border-cyan-700">
          <h3 className="text-xl font-semibold mb-4 text-cyan-300">Distribuição por Linguagem</h3>
          {validLanguages.length > 0 ? (
            <Pie data={languageData} options={chartOptions} />
          ) : (
            <p className="text-cyan-400">Nenhuma linguagem com linhas de código encontrada.</p>
          )}
        </div>
        <div className="md:col-span-2 bg-cyan-900 bg-opacity/30 p-4 rounded-lg border border-cyan-700">
          <h3 className="text-xl font-semibold mb-4 text-cyan-300">Detalhes por Arquivo</h3>
          {validFileDetails.length > 0 ? (
            <Bar data={fileData} options={chartOptions} />
          ) : (
            <p className="text-cyan-400">Nenhum arquivo com linhas de código encontrado.</p>
          )}
        </div>
      </div>
      <button
        onClick={() => {
          // Implementar lógica para download dos resultados
          console.log('Download dos resultados')
        }}
        className="mt-8 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-6 rounded-full transition-all hover:from-cyan-600 hover:to-blue-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity/50 shadow-lg hover:shadow-cyan-500/50"
      >
        Baixar Resultados (JSON/PNG)
      </button>
    </section>
  )
}

export default ResultsSection
