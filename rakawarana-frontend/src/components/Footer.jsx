function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-4 text-sm text-slate-700 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <span className="font-semibold text-slate-900">
            Developed with YAKA-Team <span className="text-red-600">♥</span> for Sri Lanka
          </span>
          <div className="flex flex-wrap justify-center gap-2 text-xs sm:justify-start">
            <a
              href="https://www.dumidu.dev/"
              className="inline-flex items-center gap-1 font-semibold text-slate-800 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              <i className="ri-user-line text-slate-500" aria-hidden="true"></i> Dumindu
            </a>
            <span className="text-slate-300">|</span>
            <a
              href="https://vimukthi.vercel.app/"
              className="inline-flex items-center gap-1 font-semibold text-slate-800 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              <i className="ri-user-line text-slate-500" aria-hidden="true"></i> Vimukthi
            </a>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 sm:flex-row sm:items-center sm:gap-4">
          <span className="font-semibold text-slate-900">Contact:</span>
          <a href="tel:+94712345678" className="hover:text-slate-900">
            +94 72 360 2211
          </a>

        </div>
      </div>
    </footer>
  )
}

export default Footer
