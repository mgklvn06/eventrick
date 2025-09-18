import React, { useEffect, useState } from "react";
import slide1 from "../assets/event.jpg";
import slide2 from "../assets/event2.jpg";
import slide3 from "../assets/event1.jpg";
import image1 from "../assets/party1.jpg";
import image2 from "../assets/party2.jpg";
import image3 from "../assets/party3.jpg";
import image4 from "../assets/hero-image.jpg";
import "font-awesome/css/font-awesome.min.css";
const slides = [
  {
    img: slide1,
    title: "Annual soul Festival",
    subtitle: "Join us for vibes, live music and great relaxation.",
    ctaText: "Learn More",
    ctaLink: "/events/coffee-fest",
  },
  {
    img: slide2,
    title: "Fun and chills",
    subtitle: "A thrilling experience for you and your friends.",
    ctaText: "Get Tickets",
    ctaLink: "/events/snow-run",
  },
  {
    img: slide3,
    title: "Mountain Retreat",
    subtitle: "Relax, recharge and network with friends.",
    ctaText: "Book Now",
    ctaLink: "/events/mountain-retreat",
  },
];

const Event = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <section className=" min-h-screen">
     
    <div
  className="relative w-full h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
  style={{
    backgroundImage: `url(${image4})`,
  }}
>


  <div className="absolute inset-0 bg-black/60" />
  <div className="relative text-center px-4">
    <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100/70 backdrop-blur-sm border border-purple-300 mb-6 animate-pulse">
      <span className="text-sm font-medium text-purple-900">
        ✨ Trusted by 10,000+ event organizers
      </span>
    </div>
    <h1 className="text-6xl md:text-7xl font-extrabold text-white drop-shadow-[2px_2px_4px_rgba(128,0,128,0.7)] leading-tight">
      Elevate <br />
      <span className="block">
        Your <span className="text-purple-400">Event</span>
      </span>
      <span className="block">Experience</span>
    </h1>

    <p className="font-bold text-2xl text-gray-300 mt-6 max-w-2xl mx-auto">
      Discover, create, and manage events seamlessly with our platform.
    </p>

    <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
      <a
        href="/events"
        className="inline-block bg-purple-900 hover:bg-purple-950 text-white px-6 py-3 rounded-md text-lg font-medium transition"
      >
        Explore Events
      </a>
      <a
        href="/signup"
        className="inline-block border border-purple-900 text-purple-400 hover:bg-purple-400 hover:text-white px-6 py-3 rounded-md text-lg font-medium transition"
      >
        Sign up for free
      </a>
    </div>
  </div>
</div>


<div className="grid grid-cols-3 gap-8 pt-8 border-t border-purple-900 mt-20">
              <div className="text-center lg:text-center">
                <div className="flex items-center justify-center lg:justify-center space-x-2 text-purple-900">
                    <i class="fa fa-calendar-check-o fa-3x" aria-hidden="true"></i>
                  <span className="text-5xl font-bold">50K+</span>
                </div>
                <p className="text-lg text-purple-900">Events Created</p>
              </div>
              <div className="text-center lg:text-center">
                <div className="flex items-center justify-center lg:justify-center space-x-2 text-purple-900">
                    <i class="fa fa-user-o fa-3x" aria-hidden="true"></i>
                  <span className="text-5xl font-bold">2M+</span>
                </div>
                <p className="text-lg text-purple-900">Tickets Sold</p>
              </div>
              <div className="text-center lg:text-center">
                <div className="flex items-center justify-center lg:justify-center space-x-2 text-purple-900">
                    <i class="fa fa-line-chart fa-3x" aria-hidden="true"></i>
                  <span className="text-5xl font-bold">98%</span>
                </div>
                <p className="text-lg text-purple-900">Customer Satisfaction</p>
              </div>
            </div>

            <hr className="border-t border-purple-900"/>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-40">
      <div className="inline-flex items-center px-2 py-2 ml-96 rounded-full bg-purple-100/70 backdrop-blur-sm border border-purple-300 mb-6 animate-pulse">
      <span className="text-sm font-medium text-purple-900">
        ✨ Awesome Events, Just for You
      </span>
    </div>
      <h1 className="text-5xl font-extrabold text-white drop-shadow-[2px_2px_4px_rgba(128,0,128,0.7)] leading-tight">Great Events Await</h1>
      <p className="text-2xl font-bold text-gray-400">Get to enjoy wonderful events here</p>

      <div className="relative w-full h-96 overflow-hidden object-contain mt-2 rounded-3xl">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`transition-opacity duration-700 absolute inset-0 flex items-center ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
          aria-hidden={i === index ? "false" : "true"}
        >
          <img src={slide.img} alt={slide.title} className="w-full h-screen object-cover" />

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-2xl ml-8 md:ml-16 bg-gradient-to-r from-black/60 via-black/30 to-transparent p-6 rounded-md">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow">{slide.title}</h2>
              <p className="text-sm md:text-lg text-gray-200 mb-4">{slide.subtitle}</p>
              {slide.ctaText && (
                <a
                  href={slide.ctaLink}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm md:text-base"
                >
                  {slide.ctaText}
                </a>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-blue-600" : "bg-gray-300"
            }`}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
    </div>

<div className="mt-40">
  <div className="py-20 max-w-6xl mx-auto px-4 text-center">
    <h1 className="text-5xl text-white drop-shadow-[2px_2px_4px_rgba(128,0,128,0.7)] leading-tight font-extrabold">
      Perfect for Any Events
    </h1>
    <p className="text-2xl text-gray-400 mb-12 font-bold">
      Find the best events tailored just for you.
    </p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      <div className="flex flex-col items-center bg-gray-900 text-white rounded-2xl p-10">
        <i className="fa fa-volume-up text-5xl mb-4 fa-2x" aria-hidden="true"></i>
        <h2 className="text-xl font-extrabold">Concerts</h2>
      </div>

      <div className="flex flex-col items-center bg-gray-900 text-white rounded-2xl p-6">
        <i className="fa fa-users text-5xl mb-4 fa-2x" aria-hidden="true"></i>
        <h2 className="text-xl font-extrabold">Weddings</h2>
      </div>

      <div className="flex flex-col items-center bg-gray-900 text-white rounded-2xl p-6">
        <i className="fa fa-calendar text-5xl mb-4 fa-2x" aria-hidden="true"></i>
        <h2 className="text-xl font-extrabold">Corporate Events</h2>
      </div>

      <div className="flex flex-col items-center bg-gray-900 text-white rounded-2xl p-6">
        <i className="fa fa-music text-5xl mb-4 fa-2x" aria-hidden="true"></i>
        <h2 className="text-xl font-extrabold">Festivals</h2>
      </div>
    </div>
    <button className="mt-20 bg-purple-900 hover:bg-purple-950 text-white p-4 font-bold rounded-lg text-lg">Browse events now</button>
  </div>
</div>



      <div className="relative min-h-screen">
      <div className="sticky top-20 mt-40 py-8 px-4 max-w-7xl mx-auto text-center text-5xl font-serif">
        <h1 className="text-gray-400 font-extrabold leading-tight">
          Find <i className="font-mono">amaaaaazing</i> <span className="text-purple-900">events</span> and create your <br />
          <b className="font-extrabold">perfect <span className="text-purple-900">events</span></b> all in one place effortlessly
        </h1>
      </div>

      <div className="relative max-w-6xl mx-auto space-y-20 py-20 z-30">
        <div className="flex justify-end">
          <div className="rounded-3xl overflow-hidden max-w-lg shadow-lg">
            <img
              className="w-full h-80 object-cover"
              src={image1}
              alt="Party scene with people dancing and colorful lights"
            />
          </div>
        </div>

        <div className="flex justify-start">
          <div className="rounded-3xl overflow-hidden max-w-lg shadow-lg">
            <img
              className="w-full h-80 object-cover"
              src={image2}
              alt="Crowd enjoying a lively party with DJ and vibrant atmosphere"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <div className="rounded-3xl overflow-hidden max-w-lg shadow-lg">
            <img
              className="w-full h-80 object-cover"
              src={image3}
              alt="People celebrating at an outdoor event with festive decorations"
            />
          </div>
        </div>

        <div className="h-96" />
      </div>
    </div>

       <div className="py-12">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
    <div className="text-center mb-8">
      <div className="inline-flex items-center px-2 py-2 rounded-full bg-purple-100/70 backdrop-blur-sm border border-purple-300 mb-6 animate-pulse">
      <span className="text-sm font-medium text-purple-900">
        ✨ Powerful Features
      </span>
    </div>
      <h2 className="text-4xl md:text-5xl text-white drop-shadow-[2px_2px_4px_rgba(128,0,128,0.7)] leading-tight font-extrabold">
        Powerful Features for Every User
      </h2>
      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mt-2">
        Whether you're an admin, employee, or user, Eventrick has everything you need
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="text-center p-5 rounded-xl bg-gray-900 hover:shadow-lg transition-all duration-300">
        <div className="w-14 h-14 bg-purple-900 rounded-3xl flex items-center justify-center mb-3">
          <i className="fa fa-user-o fa-lg text-white" aria-hidden="true"></i>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">User Management</h3>
        <p className="text-gray-400 text-sm">
          Complete control with reporting, user management, and event oversight.
        </p>
      </div>

      <div className="text-center p-5 rounded-xl bg-gray-900 hover:shadow-lg transition-all duration-300">
        <div className="w-14 h-14 bg-purple-900 rounded-3xl flex items-center justify-center mb-3">
          <i className="fa fa-calendar-check-o fa-lg text-white" aria-hidden="true"></i>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Event Management</h3>
        <p className="text-gray-400 text-sm">
          Employees can create, edit, and manage events with real-time analytics.
        </p>
      </div>

      <div className="text-center p-5 rounded-xl bg-gray-900 hover:shadow-lg transition-all duration-300">
        <div className="w-14 h-14 bg-purple-900 rounded-3xl flex items-center justify-center mb-3">
          <i className="fa fa-user-circle fa-lg text-white" aria-hidden="true"></i>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">User Experience</h3>
        <p className="text-gray-400 text-sm">
          Seamless event discovery, secure ticketing, and personal ticket management.
        </p>
      </div>

      <div className="text-center p-5 rounded-xl bg-gray-900 hover:shadow-lg transition-all duration-300">
        <div className="w-14 h-14 bg-purple-900 rounded-3xl flex items-center justify-center mb-3">
          <i className="fa fa-bar-chart fa-lg text-white" aria-hidden="true"></i>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Analytics & Reporting</h3>
        <p className="text-gray-400 text-sm">
          Comprehensive reporting on sales, attendance, revenue, and conversions.
        </p>
      </div>

      <div className="text-center p-5 rounded-xl bg-gray-900 hover:shadow-lg transition-all duration-300">
        <div className="w-14 h-14 bg-purple-900 rounded-3xl flex items-center justify-center mb-3">
          <i className="fa fa-shield fa-lg text-white" aria-hidden="true"></i>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Security First</h3>
        <p className="text-gray-400 text-sm">
          HTTPS, encrypted data, RBAC, audit logs, and OWASP compliance.
        </p>
      </div>

      <div className="text-center p-5 rounded-xl bg-gray-900 hover:shadow-lg transition-all duration-300">
        <div className="w-14 h-14 bg-purple-900 rounded-3xl flex items-center justify-center mb-3">
          <i className="fa fa-credit-card fa-lg text-white" aria-hidden="true"></i>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Secure Payments</h3>
        <p className="text-gray-400 text-sm">
          PCI-compliant payments with multiple gateways and currencies.
        </p>
      </div>
    </div>
  </div>
</div>

  </section>
);
};
export default Event;