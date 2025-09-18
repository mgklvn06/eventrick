import React from "react";

const Footer = () => {
    return (
        <footer className="bg-black text-white py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start">
                    <div className="mb-6 md:mb-0">
                        <h2 className="text-2xl font-bold">Eventify</h2>
                        <p className="text-lg text-purple-900 font-extrabold">
                            Bringing people together<br /> through unforgettable events.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <h2 className="text-xl text-center">Connect:</h2>
                        <div className="flex flex-col items-center mt-4 text-purple-900 font-extrabold">
                            <a href="#" className="text-lg mx-2 hover:underline">
                                Tiktok
                            </a>
                            <a href="#" className="text-lg mx-2 hover:underline">
                                Twitter
                            </a>
                            <a href="#" className="text-lg mx-2 hover:underline">
                                Instagram
                            </a>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <p className="text-xl text-center mb-4">
                            Contact us:<br />
                            <a href="mailto:info@eventify.com" className="text-purple-900 font-extrabold hover:underline">
                                info@eventify.com
                            </a>
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <h2 className="text-xl">Newsletter</h2>
                        <p className="text-purple-900 font-extrabold">Subscribe to our newsletter<br /> for updates on future events:</p>
                        <div className="flex flex-col md:flex-row items-center mt-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="w-full md:w-64 p-2 border border-purple-900 rounded mb-2 md:mb-0"
                            />
                            <button type="submit" className="bg-purple-900 hover:bg-purple-950 text-white px-4 py-2 rounded">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-6 pt-4">
                    <p className="text-sm text-center">
                        Privacy Policy | Terms of Service
                    </p>
                </div>
                <p className="text-center mt-2">
                    &copy; {new Date().getFullYear()} Eventify. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
