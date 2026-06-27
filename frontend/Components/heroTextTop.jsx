"use client"
import { forwardRef } from 'react' //forwardRef here is so that ref can get to the child components because react blocks ref


const HeroTextTop = forwardRef(function HeroTextTop(props,ref) {
  return (
    <div
    ref={ref}
    className="px-4 lg:mt- lg:ml-20 lg:transform lg:translate-x-7 lg:px-0">
      <div className={`relative rounded-[2rem] bg-[#D3FB76] p-6 lg:mt-5 lg:bg-transparent lg:p-0`}>
        <svg className="hidden lg:block" xmlns="http://www.w3.org/2000/svg" viewBox="-0.1 -0.1 681.8 442.8">
          <path d="M 31 0 L 672 0 C 681 2 685 10 678 23 L 625 232 C 623 240 614 246 609 244 L 454 260 C 445 260 439 267 437 276 L 402 432 C 397 441 391 444 377 442 L 13 361 C 2 360 0 354 0 345 L 1 23 C 6 9 14 0 29 0" stroke="#000000" strokeWidth="0.1" fill="#D3FB76
"/>
        </svg>

        <div className='relative flex flex-col lg:absolute lg:inset-0 lg:justify center lg:mx-8'>
          <h1 className='mt-0 max-w-none py-0 text-[2.15rem] font-[600] leading-[0.94] tracking-[-0.065em] lg:mt-3 lg:py-5 lg:text-6xl'>
            <span className='whitespace-nowrap'>
              Become <span className='rounded-[2rem] bg-white px-3 py-0.5 lg:px-4 lg:py-0'>a farmer</span>
            </span>{" "}
            without <span className=' ]'>Land</span>. 
          </h1>
          <p className='mt-5 max-w-[16rem] text-[0.95rem] leading-[1.38] text-[black]/70 transform lg:mt-0 lg:max-w-none lg:text-xl lg:px-5'>
            Invest in agricultural projects <br/> and earn returns without owning <br/> land or managing a farm.
          </p>

          <button className='self-start px-3 font-bold text-sm rounded-md py-2 my-4 bg-white cursor-none hover:scale-105 transition-transform ease-in duration-300 lg:text:sm lg:my-2 lg:mx-3'>
            Get Started
          </button>
        </div>
      </div>
    </div>

  )
}
)

export default HeroTextTop;
