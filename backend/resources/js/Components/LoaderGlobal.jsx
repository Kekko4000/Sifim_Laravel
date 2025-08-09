// resources/js/Components/LoaderPortal.jsx
import React from 'react'
import ReactDOM from 'react-dom'

export default function LoaderGlobal({ targetId }) {
  const container = document.getElementById(targetId)
  
  if (!container) return null
  return ReactDOM.createPortal(
    <div className='layout-spinner'>
        <div className="spinner"></div>
    </div>,
    container
  )
}
