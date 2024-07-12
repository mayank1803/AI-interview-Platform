import Header from 'app/dashboard/_components/Header'
import React from 'react'
const QuestionsLayout=({children}) =>{
  return (
    <div>
    <Header />
    <div className='mx-5 md:mx-20 lg:mx-36'>
        {children}
        </div>
    </div>
  )
}

export default QuestionsLayout