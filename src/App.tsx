import Board from './components/Board'
import SideBar from './components/SideBar'
import { useState } from 'react'



function App() {

  return (
    <>
      <div className='board-app'>
        <SideBar></SideBar>
        <Board></Board>
      </div>

    </>
  )
}

export default App
