function Status({ number, name, className = '', accent = '#0ea5e9' }) {
  return (
    <section
      className={`inline-flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 px-8 py-7 text-center shadow-lg shadow-slate-200 ${className}`}
      style={{ '--accent': accent }}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 bg-[color:var(--accent)]/10 text-sm font-semibold text-[color:var(--accent)] shadow-inner">
        {String(number).padStart(2, '0')}
      </span>
      <div className="space-y-1">
        <p className="m-0 text-m font-semibold tracking-tight text-slate-900 md:text-xs">
          {name}
        </p>
      </div>
    </section>
  )
}

export default Status
