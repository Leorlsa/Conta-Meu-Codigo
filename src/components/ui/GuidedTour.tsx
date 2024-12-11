/* eslint-disable */

import React, { useState } from 'react'
import Joyride, { CallBackProps, EVENTS, STATUS, Step, Styles } from 'react-joyride'

const GuidedTour: React.FC = () => {
  const [runTour, setRunTour] = useState(true)

  const customStyles = {
    options: {
      backgroundColor: '#0e2a47',
      primaryColor: '#06b6d4',
      textColor: '#67e8f9',
      arrowColor: '#0e2a47',
      overlayColor: 'rgba(0, 0, 0, 0.5)'
    }
  }

  const steps: Step[] = [
    {
      target: 'h1',
      content: 'Bem-vindo ao Conta Meu Código! Uma ferramenta para analisar estatísticas do seu código.',
      placement: 'bottom',
      disableBeacon: true,
      styles: customStyles
    },
    {
      target: '.upload-section',
      content: 'Arraste e solte seus arquivos ou clique para selecionar uma pasta para análise.',
      placement: 'top',
      styles: customStyles
    },
    {
      target: '.options-section',
      content: 'Personalize sua análise com estas opções. Você pode ignorar comentários, detectar logs de debug e mais.',
      placement: 'bottom',
      styles: customStyles
    },
    {
      target: '.analyze-button',
      content: 'Depois de selecionar seus arquivos, clique aqui para iniciar a análise do código.',
      placement: 'top',
      styles: customStyles
    }
  ]

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data
    if (type === EVENTS.TOUR_END || status === STATUS.SKIPPED) {
      setRunTour(false)
      localStorage.setItem('tourCompleted', 'true')
    }
  }

  if (localStorage.getItem('tourCompleted')) {
    return null
  }

  const joyrideStyles: Partial<Styles> = {
    options: {
      zIndex: 10000,
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    tooltip: {
      backgroundColor: '#0e2a47',
      borderRadius: '8px',
      padding: '16px',
      fontSize: '14px'
    },
    buttonNext: {
      backgroundColor: '#06b6d4',
      padding: '8px 16px',
      fontSize: '14px',
      borderRadius: '9999px'
    },
    buttonBack: {
      color: '#67e8f9',
      marginRight: 10,
      fontSize: '14px'
    },
    buttonSkip: {
      color: '#67e8f9',
      fontSize: '14px'
    },
    buttonClose: {
      color: '#67e8f9',
      fontSize: '14px'
    }
  }

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showSkipButton
      showProgress
      hideCloseButton={false}
      callback={handleJoyrideCallback}
      spotlightPadding={4}
      disableOverlayClose
      locale={{
        back: 'Anterior',
        close: 'Fechar',
        last: 'Finalizar',
        skip: 'Pular tour'
      }}
      styles={joyrideStyles}

    />
  )
}

export default GuidedTour
