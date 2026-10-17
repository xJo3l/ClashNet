import React, { useState } from 'react';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    // Feedback state
    setIsSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <section
      id="contact"
      className="relative w-full text-slate-900 z-10 flex items-center justify-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-20 md:pb-24 bg-white selection:bg-rose-500 selection:text-white overflow-hidden"
    >
      <div className="max-w-6xl w-full mx-auto relative z-20 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, Subtext & Coffee Space */}
          <div className="lg:col-span-5 flex flex-col justify-center gap-6 sm:gap-8" data-sc-in data-sc-stagger="70">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-slate-600 font-montserrat font-bold text-[10px] tracking-[0.2em] uppercase self-start mb-4 sm:mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Contact
              </div>

              {/* Main Heading with Kinetic Split Line Reveal */}
              <h2 className="font-cormorant font-normal text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.02] mb-3 sm:mb-4">
                <span className="sc-split sc-split--line">
                  <span className="sc-split__i">Get in touch</span>
                </span>
              </h2>

              {/* Small descriptive text */}
              <p className="font-outfit text-sm sm:text-base text-slate-500 leading-relaxed max-w-md mb-4 sm:mb-6">
                If you have any questions, suggestions, need any help contact me
              </p>
            </div>

            {/* Support / Coffee space - enhanced with 3D tilt and cursor spotlight */}
            <div
              data-sc-tilt="6"
              data-sc-spotlight
              className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 md:p-6 transition-all duration-300 hover:border-amber-300 hover:shadow-lg shadow-sm will-change-transform"
            >
              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-100/90 border border-amber-200/70 flex items-center justify-center flex-shrink-0 text-amber-700">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  >
                    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                    <path d="M3 8h14v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                    <line x1="6" y1="2" x2="6" y2="4" />
                    <line x1="10" y1="2" x2="10" y2="4" />
                    <line x1="14" y1="2" x2="14" y2="4" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-montserrat font-bold text-xs uppercase tracking-[0.16em] text-slate-800 mb-1">
                    Buy me a coffee
                  </h3>
                  <p className="font-outfit text-xs text-slate-500 leading-relaxed mb-3">
                    If ClashNet has helped your game, feel free to drop a small tip to support ongoing development.
                  </p>
                  <a
                    href="#donate"
                    data-sc-magnet="0.25"
                    className="inline-flex items-center gap-1.5 text-xs font-montserrat font-bold tracking-wider uppercase text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    Support creator
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3.5 h-3.5"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Name, Email & Message Form Box with 3D Tilt & Magnetic Button */}
          <div className="lg:col-span-7 w-full" data-sc-in>
            <div
              data-sc-tilt="3"
              data-sc-spotlight
              className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 md:p-9 lg:p-10 shadow-[0_16px_48px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-xl will-change-transform"
            >
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5" data-sc-in data-sc-stagger="55">
                {/* Name Box */}
                <div>
                  <label
                    htmlFor="name"
                    className="block font-montserrat font-semibold text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1.5 sm:mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 placeholder:text-slate-400 font-outfit text-base sm:text-sm focus:outline-none focus:border-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-800 transition-all duration-200"
                  />
                </div>

                {/* Email Box */}
                <div>
                  <label
                    htmlFor="email"
                    className="block font-montserrat font-semibold text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1.5 sm:mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 placeholder:text-slate-400 font-outfit text-base sm:text-sm focus:outline-none focus:border-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-800 transition-all duration-200"
                  />
                </div>

                {/* Message Box */}
                <div>
                  <label
                    htmlFor="message"
                    className="block font-montserrat font-semibold text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1.5 sm:mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 placeholder:text-slate-400 font-outfit text-base sm:text-sm focus:outline-none focus:border-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-800 transition-all duration-200 resize-none"
                  />
                </div>

                {/* Magnetic Submit Button */}
                <div className="w-full flex pt-1 sm:pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitted}
                    data-sc-magnet="0.28"
                    className={`w-full py-3 sm:py-3.5 rounded-xl font-montserrat font-bold text-xs uppercase tracking-[0.22em] transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 will-change-transform ${
                      isSubmitted
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-slate-900 hover:bg-black text-white hover:scale-[1.01]'
                    }`}
                  >
                    {isSubmitted ? (
                      <>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Message Sent
                      </>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
