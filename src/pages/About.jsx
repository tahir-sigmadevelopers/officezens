import React from 'react';

const About = () => {
    return (
        <>
            <div className="w-full bg-white mt-6 py-12 md:mt-12">
                {/* Main Content Section */}
                <div className="w-full flex flex-col lg:flex-row">
                    {/* Left Section - Text Content */}
                    <div className="w-full lg:w-1/2 p-4 md:p-8 flex flex-col justify-center">
                        <h2 className="text-2xl md:text-4xl font-bold md:font-extrabold text-gray-900 mb-4 text-center lg:text-left lg:md:pl-8">
                            About Us
                        </h2>
                        <p className="text-base md:text-lg leading-6 md:leading-7 text-gray-800 p-2 md:p-6 rounded-lg">
                            At Relax Chair, we've been committed to providing reliable products that meet the highest standards of excellence. We understand that a well-designed office is the foundation of productivity, collaboration, and success. 
                            <br /><br className="hidden md:block" />
                            That's why we specialize in providing reliable, high-quality office furniture solutions that elevate your workspace. With years of experience in the industry, we offer a wide range of durable, functional, and stylish furniture designed to meet the diverse needs of businesses, from startups to large corporations. 
                            <br /><br className="hidden md:block" />
                            Our commitment to excellence ensures that every piece is built to last, delivering both comfort and performance. Whether you're outfitting a home office or transforming a corporate headquarters, we are dedicated to providing powerful solutions that help you create a workspace that works as hard as you do. Trust Office Zens to provide the furniture that supports your success.
                        </p>
                    </div>

                    {/* Right Section - Image */}
                    <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
                        <img
                            className="w-full h-64 md:h-auto object-cover"
                            src="/img7.jpg"
                            alt="About Us"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;
