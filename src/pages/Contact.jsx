import React from 'react';

const Contact = () => {
    return (
        <section className="text-gray-600 body-font relative mt-6 md:mt-12">
            <div className="container px-4 sm:px-5 py-6 md:py-10 mx-auto flex flex-col md:flex-row gap-6 md:gap-8">
                {/* Map Section */}
                <div className="w-full lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden p-0 md:p-4 h-64 sm:h-80 md:h-96 flex items-end justify-start relative">
                    <iframe
                        width="100%"
                        height="100%"
                        title="map"
                        frameBorder="0"
                        marginHeight="0"
                        marginWidth="0"
                        scrolling="no"
                        src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3397.855312236504!2d74.25379367561516!3d31.61042417417289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzHCsDM2JzM3LjUiTiA3NMKwMTUnMjIuOSJF!5e0!3m2!1sen!2s!4v1730976740176!5m2!1sen!2s"
                        className="absolute inset-0"
                    ></iframe>
                </div>
                
                {/* Contact Form Section */}
                <div className="w-full lg:w-1/3 md:w-1/2 bg-white flex flex-col md:py-6 mt-4 md:mt-0 px-4 sm:px-6 md:px-8 rounded-lg shadow-sm py-4">
                    <h2 className="text-gray-900 text-xl md:text-2xl mb-1 font-medium title-font">Contact Us</h2>
                    <p className="leading-relaxed mb-4 mt-2 text-sm md:text-base text-gray-600">Contact Us Now</p>
                    
                    <div className="relative mb-3 md:mb-4">
                        <label htmlFor="name" className="leading-7 text-xs md:text-sm text-gray-600">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 text-sm md:text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        />
                    </div>
                    
                    <div className="relative mb-3 md:mb-4">
                        <label htmlFor="email" className="leading-7 text-xs md:text-sm text-gray-600">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 text-sm md:text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        />
                    </div>
                    
                    <div className="relative mb-4">
                        <label htmlFor="message" className="leading-7 text-xs md:text-sm text-gray-600">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 h-28 md:h-32 text-sm md:text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                        ></textarea>
                    </div>
                    
                    <button className="text-white bg-yellow-500 border-0 py-2 px-6 focus:outline-none hover:bg-yellow-600 rounded text-sm md:text-base font-medium transition-colors duration-300">Submit</button>
                    
                    <div className="mt-6 text-xs md:text-sm text-gray-600">
                        <p className="mb-1"><strong>Email:</strong> contact@relaxchair.com</p>
                        <p className="mb-1"><strong>Phone:</strong> +92 317 5991373</p>
                        <p><strong>Address:</strong> Lahore, Pakistan</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
