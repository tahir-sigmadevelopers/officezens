import React from 'react'

const About = () => {
    return (
        <>
            <div id="about" className="relative bg-white overflow-hidden mt-12">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-20 xl:pb-32">
                        <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
                            fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                            <polygon points="50,0 100,0 50,100 0,100"></polygon>
                        </svg>

                        <div className="pt-1"></div>

                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-6 lg:mt-2 lg:px-8 xl:mt-20">
                            <div className="sm:text-center lg:text-left">
                                <h2 className="my-6 text-2xl tracking-tight font-extrabold text-gray-900 sm:text-3xl md:text-4xl">
                                    About Us
                                </h2>

                                <p className='pr-12'>
                                    At Office Zens, we've been committed to providing reliable products that meet the highest standards of excellence. we understand that a well-designed office is the foundation of productivity, collaboration, and success. That's why we specialize in providing reliable, high-quality office furniture solutions that elevate your workspace. With years of experience in the industry, we offer a wide range of durable, functional, and stylish furniture designed to meet the diverse needs of businesses, from startups to large corporations. Our commitment to excellence ensures that every piece is built to last, delivering both comfort and performance. Whether you're outfitting a home office or transforming a corporate headquarters, we are dedicated to providing powerful solutions that help you create a workspace that works as hard as you do. Trust Office Zens to provide the furniture that supports your success.
                                </p>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <img
                        className="h-56 w-full object-cover object-top sm:h-72 md:h-96 lg:w-full lg:h-full"
                        src="/img7.jpg" alt="about" />
                </div>
            </div>
        </>

    )
}

export default About