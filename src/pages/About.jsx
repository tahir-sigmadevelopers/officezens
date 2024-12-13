import React from 'react';

const About = () => {
    return (
        <>
            <div className="w-full bg-white mt-12">
                {/* Main Content Section */}
                <div className="w-full flex flex-col lg:flex-row">
                    {/* Left Section - Text Content */}
                    <div className="w-full lg:w-1/2  p-8 flex flex-col justify-center">
                        <h2 className="text-4xl md:pl-8  font-extrabold text-gray-900 mb-4">
                            About Us
                        </h2>
                        <p className="text-lg leading-7 text-gray-800  p-6   rounded-lg">
                            At Office Zens, we've been committed to providing reliable products that meet the highest standards of excellence. We understand that a well-designed office is the foundation of productivity, collaboration, and success. 
                            <br /><br />
                            That's why we specialize in providing reliable, high-quality office furniture solutions that elevate your workspace. With years of experience in the industry, we offer a wide range of durable, functional, and stylish furniture designed to meet the diverse needs of businesses, from startups to large corporations. 
                            <br /><br />
                            Our commitment to excellence ensures that every piece is built to last, delivering both comfort and performance. Whether you're outfitting a home office or transforming a corporate headquarters, we are dedicated to providing powerful solutions that help you create a workspace that works as hard as you do. Trust Office Zens to provide the furniture that supports your success.
                        </p>
                    </div>

                    {/* Right Section - Image */}
                    <div className="w-full lg:w-1/2">
                        <img
                            className="w-full h-full object-cover"
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
