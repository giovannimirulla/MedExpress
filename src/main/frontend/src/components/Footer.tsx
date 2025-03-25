import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-primary relative text-white'>
      <div className='max-w-screen-xl mx-auto p-10 flex flex-col items-center justify-between gap-5 sm:flex-row sm:items-end'>
        <div className='bg-blue-0 flex flex-col items-center gap-2 sm:items-start'>
          <a
            href='#'
            className='bg-orange-100 p-1.5 rounded-full group'
          >
           
          </a>
          <p className='text-xs text-center'>
            Designed by{' '}
            <a
              href='https://github.com/giovannimirulla'
              target='_blank'
              className='text-orange-500 font-semibold transition-colors hover:text-orange-600'
            >
              @giovannimirulla
            </a>
          </p>
          <p className='text-white-500 text-xs text-center'>
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
