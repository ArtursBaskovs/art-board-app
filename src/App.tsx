import { ToolsProvider } from './components/ToolsContext'
import Board from './components/Board'
import SideBar from './components/SideBar'
import { useState } from 'react'



function App() {

  return (
    <>
      <div className='board-app'>
        <ToolsProvider>
          <SideBar></SideBar>
          <Board></Board>
        </ToolsProvider>

      </div>

    </>
  )
}

export default App
