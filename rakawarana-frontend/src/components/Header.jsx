function Header() {
  return (
    <header className="w-full border-b border-slate-200 bg-white shadow-sm">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 h-full w-full">
          <img
            src="/hero.jpg"
            alt="Background"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-slate-900/50 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/40" />
        </div>
        <div className="fade-in relative mx-auto flex w-full max-w-5xl flex-col items-center gap-2 px-6 py-8 text-center md:py-10">
          <h1 className="text-2xl font-semibold tracking-wide text-white drop-shadow md:text-3xl">
            <span className="font-sinhala" lang="si">
              රැකවරණ
            </span>{' '}
            · <span className="font-[Poppins] font-bold">RAKAWARANA</span>
          </h1>
          <p className="max-w-3xl text-sm font-semibold text-slate-100 drop-shadow md:text-base">
            මේ දිනවල පැවතෙන අදික වර්ෂා තත්වය නිසා අසරණ වූ ශ්‍රී ලාංකීය ජනතාවට උදව් ලබා ගැනීමටත් ලබා දීමටත් ඔබට මෙම වෙබ් අඩවියෙන් හැකිය.
          </p>
        </div>
      </div>
    </header>
  )
}

export default Header
