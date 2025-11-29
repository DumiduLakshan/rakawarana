function PostCard({
  name,
  phoneNumbers = [],
  location,
  landmark,
  district,
  peopleCount,
  situation,
  emergencyType,
  waterLevel,
  safeHours,
  needs,
  priority,
  isMedicalNeeded,
  isVerified,
  createdAt,
  needsFlags = {},
  mapLink,
  description,
  images = [],
}) {
  const priorityLevel = (priority || '').toLowerCase()
  const priorityClasses =
    priorityLevel === 'high'
      ? 'bg-red-100 text-red-700'
      : priorityLevel === 'medium'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-emerald-100 text-emerald-700'

  return (
    <article className="fade-in flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-md shadow-slate-200 sm:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-5">
        <div className="flex flex-col gap-2 rounded-xl p-3 md:hidden">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-900">
            ප්රමුඛත්වය
          </div>
          <div
            className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${priorityClasses}`}
          >
            {priority}
          </div>
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-900">
            අවශ්‍යය වර්ග
          </div>
          <div className="text-sm font-medium text-slate-500">{needs}</div>
        </div>

        <div className="hidden w-full flex-col gap-3 rounded-xl p-4 md:flex md:w-44">
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-900">
            ප්රමුඛත්වය
          </div>
          <div
            className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${priorityClasses}`}
          >
            {priority}
          </div>
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-900">
            අවශ්‍යය වර්ග
          </div>
          <div className="text-sm font-medium text-slate-500">{needs}</div>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-start gap-2 md:items-center md:gap-3">
            <h3 className="text-xl font-bold text-slate-900">{name}</h3>
           {phoneNumbers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {phoneNumbers.map((phone, idx) => (
                  <a
                    key={`${phone}-${idx}`}
                    href={`tel:${phone}`}
                    className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                  >
                    <i className="ri-phone-line mr-1 text-slate-500" aria-hidden="true"></i>
                    {phone}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 text-sm text-slate-700">
            <p className="m-0 text-lg font-semibold text-slate-900">
              <i className="ri-information-2-line"></i> තොරතුරු
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <p className="m-0">
                <span className="font-semibold text-slate-900">
                  <i className="ri-map-pin-line mr-1 text-slate-500" aria-hidden="true"></i>
                  ස්ථානය:
                </span>{' '}
                {location}
              </p>
              <p className="m-0">
                <span className="font-semibold text-slate-900">
                  <i className="ri-community-line mr-1 text-slate-500" aria-hidden="true"></i>
                  ආසන්න ස්ථානය:
                </span>{' '}
                {landmark}
              </p>
              <p className="m-0">
                <span className="font-semibold text-slate-900">
                  <i className="ri-map-2-line mr-1 text-slate-500" aria-hidden="true"></i>
                  දිස්ත්රික්කය:
                </span>{' '}
                {district}
              </p>
              <p className="m-0">
                <span className="font-semibold text-slate-900">
                  <i className="ri-user-line mr-1 text-slate-500" aria-hidden="true"></i>
                  පුද්ගලයන් සංඛ්යාව:
                </span>{' '}
                {peopleCount}
              </p>
              {mapLink && (
                <p className="m-0 md:col-span-2">
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-slate-800 underline underline-offset-4"
                  >
                    <i className="ri-external-link-line mr-1 text-slate-500" aria-hidden="true"></i>
                    View map
                  </a>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 text-sm text-slate-700">
            <p className="m-0 text-lg font-semibold text-slate-900">තත්ත්වය</p>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <p className="m-0">
                <span className="font-semibold text-slate-900">
                  <i className="ri-alert-line mr-1 text-slate-500" aria-hidden="true"></i>
                  හදිසි තත්වය:
                </span>{' '}
                {emergencyType || 'N/A'}
              </p>
              <p className="m-0">
                <span className="font-semibold text-slate-900">
                  <i className="ri-water-percent-line mr-1 text-slate-500" aria-hidden="true"></i>
                  ජල මට්ටම:
                </span>{' '}
                {waterLevel || 'N/A'}
              </p>
              <p className="m-0">
                <span className="font-semibold text-slate-900">
                  <i className="ri-timer-line mr-1 text-slate-500" aria-hidden="true"></i>
                  ආරක්ෂිත පැය:
                </span>{' '}
                {safeHours ?? 'N/A'}
              </p>
              <p className="m-0">
                <span className="font-semibold text-slate-900">
                  <i className="ri-first-aid-kit-line mr-1 text-slate-500" aria-hidden="true"></i>
                  වෛද්‍ය සහාය අවශ්‍යද?:
                </span>{' '}
                {isMedicalNeeded ? 'ඔව්' : 'නැ'}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-sm text-slate-700">
            <p className="m-0 text-lg font-bold text-slate-900">අමතර විස්තර:</p>
            <p className="m-0">{description}</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {['food', 'water', 'transport', 'medic', 'power', 'clothes']
                .filter((key) => needsFlags[key])
                .map((key) => (
                  <span
                    key={key}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700"
                  >
                    {key}
                  </span>
                ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-900">Verified:</span>
              <span>{isVerified ? 'Yes' : 'No'}</span>
              {createdAt && (
                <span className="text-slate-500">
                  ({new Date(createdAt).toLocaleString()})
                </span>
              )}
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {images.slice(0, 4).map((src, idx) => (
                <a
                  key={src + idx}
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className="block h-20 w-full overflow-hidden rounded-lg ring-offset-2 transition hover:ring-2 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <img
                    src={src}
                    alt={`Post image ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </a>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:gap-3">
            {phoneNumbers[0] && (
              <a
                href={`tel:${phoneNumbers[0]}`}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow hover:bg-emerald-700"
              >
                Call
              </a>
            )}
            {mapLink && (
              <a
                href={mapLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow hover:bg-slate-800"
              >
                View Map
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default PostCard
