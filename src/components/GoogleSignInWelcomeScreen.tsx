import React from 'react';

export default function GoogleSignInWelcomeScreen() {
  return (
    <>
      <div className="relative flex flex-col w-full flex-grow">
        {/* Header */}
        <div className="flex items-center px-4 py-4 pt-8 justify-between z-10">
          <button aria-label="Go back" className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-slate-900 dark:text-white">
            <span className="material-symbols-outlined text-2xl font-normal">arrow_back</span>
          </button>
          <h1 className="text-moriones-red dark:text-moriones-red text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
            Marinduque Market Hub
          </h1>
        </div>
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center flex-grow px-4 pb-8 w-full max-w-md mx-auto">
          {/* Hero Illustration */}
          <div className="@container w-full mb-6">
            <div className="w-full aspect-[4/3] bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-xl shadow-sm border border-black/5 dark:border-white/5" data-alt="Vibrant Moriones mask illustration Philippines" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBj_MNkhStjJLmZZElQtyT-sRZixVj-ShRCPUWwLmVhskIG5GT9rqBbpJMoRx81016SYo6qS9l8JFYxliZIJ88JhT9SKAMWmcTsTX_2-v4KghhLbwPYwzclq1QBgjVpDfJYOgTHVDregH_EutBR8e2JHA7oEDjSBFWcwcry16XgltH5Jw97m4W7idt9XClXWVwBcXxdZiIjK451R9z5AfgoHgMj94TRoB4M6HI6r3dwhu2a_4stZbzTc2O7S9013gurwDr4ONJTbfw")' }}>
              <div className="w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>
          {/* Welcome Text */}
          <div className="text-center mb-10 px-2">
            <h2 className="text-slate-900 dark:text-white tracking-tight text-3xl font-extrabold leading-tight mb-3">
              Connecting the Heart of the Philippines
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-xs mx-auto">
              Buy, sell, and connect with your local community in Marinduque securely and easily.
            </p>
          </div>
          {/* Actions */}
          <div className="w-full space-y-4">
            <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 bg-primary hover:bg-red-700 transition-all active:scale-[0.98] text-white gap-3 shadow-lg shadow-primary/30">
              <span className="bg-white p-1 rounded-full flex items-center justify-center size-7">
                <svg height={18} viewBox="0 0 24 24" width={18} xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.225 -9.429 56.472 -10.689 57.25 L -10.689 60.15 L -6.824 60.15 C -4.561 58.07 -3.264 55.009 -3.264 51.509 Z" fill="#4285F4" />
                    <path d="M -14.754 63.239 C -11.519 63.239 -8.804 62.159 -6.824 60.15 L -10.689 57.25 C -11.764 57.969 -13.139 58.389 -14.754 58.389 C -17.889 58.389 -20.529 56.279 -21.469 53.459 L -25.469 53.459 L -25.469 56.559 C -23.494 60.479 -19.414 63.239 -14.754 63.239 Z" fill="#34A853" />
                    <path d="M -21.469 53.459 C -21.699 52.749 -21.839 51.989 -21.839 51.209 C -21.839 50.429 -21.699 49.669 -21.469 48.959 L -21.469 45.859 L -25.469 45.859 C -26.289 47.479 -26.754 49.299 -26.754 51.209 C -26.754 53.119 -26.289 54.939 -25.469 56.559 L -21.469 53.459 Z" fill="#FBBC05" />
                    <path d="M -14.754 44.029 C -12.984 44.029 -11.424 44.639 -10.164 45.829 L -6.749 42.414 C -8.804 40.499 -11.519 39.239 -14.754 39.239 C -19.414 39.239 -23.494 41.999 -25.469 45.859 L -21.469 48.959 C -20.529 46.139 -17.889 44.029 -14.754 44.029 Z" fill="#EA4335" />
                  </g>
                </svg>
              </span>
              <span className="text-base font-bold leading-normal tracking-wide">Continue with Google</span>
            </button>
            <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 transition-colors text-sm font-bold leading-normal tracking-wide">
              Continue as Guest
            </button>
          </div>
          {/* Footer links */}
          <div className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
            <p>By continuing, you agree to our <a className="underline hover:text-primary dark:hover:text-primary transition-colors" href="/">Terms of Service</a> and <a className="underline hover:text-primary dark:hover:text-primary transition-colors" href="/">Privacy Policy</a>.</p>
          </div>
        </div>
        {/* Bottom Safe Area Spacer */}
        <div className="h-6" />
      </div>

    </>
  );
}
