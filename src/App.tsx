import { ToolsProvider } from './components/ToolsContext'
import Board from './components/Board'
import SideBar from './components/SideBar'
import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'




function App() {

  //const router = createBrowserRouter([]);
  return (
    <>
    <BrowserRouter basename="/art-board-app">
      <div className='board-app'>
        <ToolsProvider>
          <SideBar />
          <Board />
        </ToolsProvider>
      </div>
    </BrowserRouter>
    </>
  )
}

export default App
