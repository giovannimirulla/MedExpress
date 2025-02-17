
import Container from './Container';
import Link from 'next/link';

const Heading = () => {

  return (
    <header>
      <nav id="nav" className="absolute h-24 flex items-center group z-10 w-full border-b border-black/5 dark:border-white/5 lg:border-transparent">
        <Container>
          <div className="relative flex flex-wrap items-center justify-between ">
            <div className="relative z-20 flex w-full justify-between md:px-0 lg:w-fit">
            <Link href="/" aria-label="logo" className="flex items-center space-x-2  no-underline">
                <div aria-hidden="true" className="flex space-x-1">
                  {/* <div className="size-4 rounded-full bg-body"></div> */}
                  <div className="h-6 w-2 bg-primary"></div>
                </div>
                <span className="text-2xl font-bold text-body">MedExpress</span>
              </Link>

              <div className="relative flex max-h-10 items-center lg:hidden">
                <button aria-label="humburger" id="hamburger" className="relative -mr-6 p-6 active:scale-95 duration-300">
                  <div aria-hidden="true" id="line" className="m-auto h-0.5 w-5 rounded bg-gray-950 transition duration-300 dark:bg-white origin-top group-data-[state=active]:rotate-45 group-data-[state=active]:translate-y-1.5"></div>
                  <div aria-hidden="true" id="line2" className="m-auto mt-2 h-0.5 w-5 rounded bg-gray-950 transition duration-300 dark:bg-white origin-bottom group-data-[state=active]:-rotate-45 group-data-[state=active]:-translate-y-1"></div>
                </button>
              </div>
            </div>
            <div id="navLayer" aria-hidden="true" className="fixed inset-0 z-10 h-screen w-screen origin-bottom scale-y-0 bg-white/70 backdrop-blur-2xl transition duration-500 group-data-[state=active]:origin-top group-data-[state=active]:scale-y-100 dark:bg-gray-950/70 lg:hidden"></div>
            <div id="navlinks" className="invisible absolute top-full left-0 z-20 w-full origin-top-right translate-y-1 scale-90 flex-col flex-wrap justify-end gap-6 rounded-3xl border border-gray-100 bg-white p-8 opacity-0 shadow-2xl shadow-gray-600/10 transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none lg:visible lg:relative lg:flex lg:w-fit lg:translate-y-0 lg:scale-100 lg:flex-row lg:items-center lg:gap-0 lg:border-none lg:bg-transparent lg:p-0 lg:opacity-100 lg:shadow-none lg:dark:bg-transparent group-data-[state=active]:visible group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 lg:group-data-[state=active]:translate-y-0">

              <div className='flex items-center mr-[20px]'>

              </div>
            </div>
          </div>
        </Container>
      </nav>
    </header>

  )
}

export default Heading;