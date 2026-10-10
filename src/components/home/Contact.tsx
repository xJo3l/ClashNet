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
      className="relative w-full min-h-screen bg-white text-slate-900 flex items-center justify-center px-6 sm:px-10 md:px-16 lg:px-24 py-24 md:py-32 selection:bg-rose-500 selection:text-white overflow-hidden"
    >
      <div className="max-w-6xl w-full mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading, Subtext & Donate Space */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-slate-600 font-montserrat font-bold text-[10px] tracking-[0.2em] uppercase self-start mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Contact
              </div>

              {/* Main Heading */}
              <h2 className="font-cormorant font-normal text-4xl sm:text-5xl md:text-6xl text-slate-900 tracking-tight leading-[0.95] mb-4">
                Get in touch
              </h2>

              {/* Small descriptive text */}
              <p className="font-outfit text-sm sm:text-base text-slate-500 leading-relaxed max-w-md mb-8">
                If you have any questions, suggestions, need any help contact me
              </p>
            </div>

            {/* Support / Cup of tea space */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 transition-all duration-300 hover:border-amber-300 hover:bg-slate-50 hover:shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-100/90 border border-amber-200/70 flex items-center justify-center flex-shrink-0 text-amber-700">
                  {/* Cup of Tea SVG */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                    <path d="M3 8h14v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                    <line x1="6" y1="2" x2="6" y2="4" />
                    <line x1="10" y1="2" x2="10" y2="4" />
                    <line x1="14" y1="2" x2="14" y2="4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-montserrat font-bold text-xs uppercase tracking-[0.16em] text-slate-800 mb-1">
                    Buy me a coffee
                  </h3>
                  <p className="font-outfit text-xs text-slate-500 leading-relaxed mb-3">
                    If ClashNet has helped your game, feel free to drop a small tip to support ongoing development.
                  </p>
                  <a
                    href="#donate"
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

          {/* Right Column: Name & Message Form Box */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 md:p-10 shadow-[0_16px_48px_rgba(0,0,0,0.05)]">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Name Box */}
                <div>
                  <label
                    htmlFor="name"
                    className="block font-montserrat font-semibold text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2"
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
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 placeholder:text-slate-400 font-outfit text-sm focus:outline-none focus:border-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-800 transition-all duration-200"
                  />
                </div>

                {/* Email Box */}
                <div>
                  <label
                    htmlFor="email"
                    className="block font-montserrat font-semibold text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2"
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
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 placeholder:text-slate-400 font-outfit text-sm focus:outline-none focus:border-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-800 transition-all duration-200"
                  />
                </div>

                {/* Message Box */}
                <div>
                  <label
                    htmlFor="message"
                    className="block font-montserrat font-semibold text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 placeholder:text-slate-400 font-outfit text-sm focus:outline-none focus:border-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-800 transition-all duration-200 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitted}
                  className={`w-full py-4 rounded-xl font-montserrat font-bold text-xs uppercase tracking-[0.22em] transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 ${
                    isSubmitted
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-slate-900 hover:bg-black text-white'
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
