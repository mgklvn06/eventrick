import React, { useEffect, useState } from "react";
import slide1 from "../assets/event.jpg";
import slide2 from "../assets/event2.jpg";
import slide3 from "../assets/event1.jpg";
import image1 from "../assets/party1.jpg";
import image2 from "../assets/party2.jpg";
import image3 from "../assets/party3.jpg";
import video from "../assets/video3.mp4";
import "font-awesome/css/font-awesome.min.css";

const slides = [
  {
    img: slide1,
    title: "Annual Coffee Festival",
    subtitle: "Join us for workshops, live music and great brews.",
    ctaText: "Learn More",
    ctaLink: "/events/coffee-fest",
  },
  {
    img: slide2,
    title: "Snow Adventure Run",
    subtitle: "A thrilling 10K through winter landscapes.",
    ctaText: "Get Tickets",
    ctaLink: "/events/snow-run",
  },
  {
    img: slide3,
    title: "Mountain Retreat",
    subtitle: "Relax, recharge and network with creators.",
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
    <section>
      {/* <div>
        <video autoPlay loop muted className="w-full h-full top-0 left-0">
          <source src={video} type="video/mp4" />
        </video>
      </div> */}
      <div className="relative w-full h-96 overflow-hidden object-contain mt-20 rounded-3xl">
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
    <div className="grid grid-cols-3 gap-8 pt-8 border-t mt-20">
              <div className="text-center lg:text-center">
                <div className="flex items-center justify-center lg:justify-center space-x-2 text-blue-900">
                    <i class="fa fa-calendar-check-o" aria-hidden="true"></i>
                  <span className="text-2xl font-bold">50K+</span>
                </div>
                <p className="text-sm">Events Created</p>
              </div>
              <div className="text-center lg:text-center">
                <div className="flex items-center justify-center lg:justify-center space-x-2 text-blue-900">
                    <i class="fa fa-user-o" aria-hidden="true"></i>
                  <span className="text-2xl font-bold">2M+</span>
                </div>
                <p className="text-sm">Tickets Sold</p>
              </div>
              <div className="text-center lg:text-center">
                <div className="flex items-center justify-center lg:justify-center space-x-2 text-blue-900">
                    <i class="fa fa-line-chart" aria-hidden="true"></i>
                  <span className="text-2xl font-bold">98%</span>
                </div>
                <p className="text-sm">Customer Satisfaction</p>
              </div>
            </div>
            <hr className="mt-10" />

      <div className="relative min-h-screen">
      <div className="sticky top-20 mt-40 py-8 px-4 max-w-7xl mx-auto text-center text-5xl font-serif">
        <h1>
          Find <i className="font-mono">amaaaaazing</i> events and create your <br />
          <b className="font-extrabold">perfect events</b> all in one place effortlessly
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

       <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Every User
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you're an admin, employee, or user, Eventrick has everything you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-blue-900 rounded-3xl flex items-center justify-center mb-4">
                <i class="fa fa-user-o fa-2x" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">User management</h3>
              <p className="text-gray-600">
                Complete system control with advanced reporting, user management, and full event oversight
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-blue-900 rounded-3xl flex items-center justify-center mb-4">
                <i class="fa fa-calendar-check-o fa-2x" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Event Management</h3>
              <p className="text-gray-600">
                Employees can create, edit, and manage events with real-time analytics and ticket tracking
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-blue-900 rounded-3xl flex items-start justify-start mb-4">
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">User Experience</h3>
              <p className="text-gray-600">
                Seamless event discovery, secure ticket purchasing, and personal ticket management
              </p>
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-blue-900 rounded-3xl flex items-center justify-center mb-4">
                <i class="fa fa-bar-chart fa-2x" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics & Reporting</h3>
              <p className="text-gray-600">
                Comprehensive reporting on sales, attendance, revenue, and conversion metrics.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-blue-900 rounded-3xl flex items-center justify-center mb-4">
                <i class="fa fa-shield fa-2x" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Security First</h3>
              <p className="text-gray-600">
                HTTPS, encrypted data, RBAC, audit logs, and OWASP security standards compliance
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-blue-900 rounded-3xl flex items-center justify-center mb-4">
                <i class="fa fa-credit-card fa-2x" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Payments</h3>
              <p className="text-gray-600">
                PCI-compliant payment processing with support for multiple gateways and currencies
              </p>
            </div>
          </div>
        </div>
      </div>
  </section>
);
};
export default Event;