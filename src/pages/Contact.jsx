import React from 'react';

const Contact = () => {
    return (
        <>
            <section className="text-gray-600 body-font relative">
                <div className="absolute inset-0 bg-gray-300">
                    <iframe
                        width="100%"
                        height="100%"
                        title="map"
                        scrolling="no"
                        src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3397.855312236504!2d74.25379367561516!3d31.61042417417289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzHCsDM2JzM3LjUiTiA3NMKwMTUnMjIuOSJF!5e0!3m2!1sen!2s!4v1730976740176!5m2!1sen!2s"
                        style={{ filter: "grayscale(1) contrast(1.2) opacity(0.4)" }}
                    ></iframe>

                </div>
                <div className="container px-5 py-24 mx-auto flex">
                    <div className="lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
                        <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Contact Us</h2>
                        <p className="leading-relaxed mb-5 text-gray-600">Let us know your query.</p>
                        <div className="relative mb-4">
                            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            />
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="message" className="leading-7 text-sm text-gray-600">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                            ></textarea>
                        </div>
                        <button className="text-white bg-yellow-500 border-0 py-2 px-6 focus:outline-none hover:bg-yellow-400 rounded text-lg">Submit</button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Contact;
