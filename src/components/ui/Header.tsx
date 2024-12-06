import React from 'react'

const Header: React.FC = () => {
  return (
    <header className="bg-black bg-opacity-50 border-b border-cyan-800 backdrop-blur-md py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
          CodeStats
        </h1>
        <p className="mt-2 text-xl text-cyan-300">
          Explore seu código com métricas impressionantes
        </p>
      </div>
    </header>
  )
}

export default Header
