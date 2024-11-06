import React from 'react'
import Sidebar from './Sidebar'
import Hompage from './Hompage'


const Dashboard = () => {

  return (
    <>
     <div className="flex">

      <Sidebar />

      <Hompage />
     </div>
    </>
  )
}

export default Dashboard