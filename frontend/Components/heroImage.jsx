"use client"

import Image from "next/image"
import { forwardRef } from "react"

const HeroImage = forwardRef(function HeroImage(props,ref) {
    const clipPath =
        "M -2256 -13 L 2359 -9 C 2485 21 2552 88 2551 207 L 2448 4600 C 2448 4700 2383 4833 2143 4810 L -4965 4786 C -5093 4791 -5111 4685 -5111 4606 L -4765 2450 C -4753 2387 -4734 2325 -4621 2318 L -3158 2174 C -3070 2168 -3001 2117 -2982 2036 L -2499 103 C -2472 34 -2402 -22 -2266 -13"

    return (
        <div
        ref={ref}
        className={`px-4 lg:px-0`}>
            <Image
                src="/farmImage.webp"
                alt="Farmers working in a green field at sunrise"
                width={900}
                height={620}
                className="h-[16rem] w-full rounded-[1.5rem] object-cover lg:hidden"
                priority
            />
            <div className={`hidden lg:block lg:w-[50rem] -translate-x-50 scale-y-108 lg:mt-10 `}>
                <svg 
                className={`w-full h-auto `}
                xmlns="http://www.w3.org/2000/svg" viewBox="-5111.1 -14.0526 7662 4827">
                    <defs>
                        <clipPath id="hero-image-clip">
                            <path d={clipPath} />
                        </clipPath>
                    </defs>

                    <image
                        href="/farmImage.webp"
                        x="-5111.1"
                        y="-14.0526"
                        width="7662"
                        height="4827"
                        preserveAspectRatio="xMidYMid slice"
                        clipPath="url(#hero-image-clip)"
                    />

                    <path
                        d={clipPath}
                        fill="none"
                        stroke="#000000"
                        strokeWidth="0.1"
                    />
                </svg>
            </div>
        </div>
    )
});

export default HeroImage;
