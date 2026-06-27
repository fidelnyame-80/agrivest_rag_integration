import { forwardRef } from 'react'
import Image from 'next/image';

const RevealedSection = forwardRef(function RevealedSection(props, ref) {
    return (
        <div
            ref={ref}
            className='absolute inset-0  opacity-0
    scale-0 grid lg:grid-cols-2 mt-10'
        >
            <div className='flex justify-center   '>
                <div className='relative bg-[#35530E] w-[25rem] h-[25rem] rounded-full' />
                <Image
                    src='/farmerImage.webp'
                    alt='farmer-carrying-fruits'
                    width={500}
                    height={500}
                    className='w-[25rem] h-[25rem] object-cover transform translate-x-31 absolute inset-0 '
                />
            </div>
            <div className=' inset-0 justify center'>
                <h1
                    className='lg:text-5xl font-[600] text-[] '
                >
                    Most <span className='border rounded-[35px] px-3 py-1 text-[#35530E]  '>young people</span> never own farmland
                </h1>
                <p className='lg:mr-10 lg:text-3xl mt-5 bg-[#D8F999] px-5 py-2 rounded-xl'>
                    Land ownership has always been the barrier to entering agriculture.
                    We&apos;re removing that barrier, making agricultural investment accessible to anyone, anywhere.
                </p>

                <p className='lg:text-2xl bg-[#E7E5E4] py-4 px-4 lg:mt-5 mr-10 rounded-lg   '>
                    The next generation doesn&apos;t need to inherit farmland to participate in its value.
                </p>
            </div>

            

        </div>
    )
});

export default RevealedSection;
