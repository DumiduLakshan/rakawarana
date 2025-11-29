import { useState } from 'react'

function HelpForm({ onClose }) {
  const [coords, setCoords] = useState({ lat: '', lng: '' })
  const [geoError, setGeoError] = useState('')
  const [manualLocation, setManualLocation] = useState('')
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    altPhoneNumber: '',
    location: '',
    district: '',
    landmark: '',
    emergencyType: 'Medical need',
    numberOfPeopleToRescue: '',
    numberOfPeople: '',
    isMedicalNeeded: true,
    waterLevel: 'ankle',
    safeHours: '',
    needFoods: false,
    needWater: false,
    needTransport: false,
    needMedic: false,
    needPower: false,
    needClothes: false,
    description: '',
    priorityLevel: 'High',
    locationUrl: '',
  })

  const handleUseLocation = () => {
    setGeoError('')
    if (!navigator.geolocation) {
      setGeoError('Geolocation not supported on this device.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const lat = latitude.toFixed(6)
        const lng = longitude.toFixed(6)
        setCoords({ lat, lng })
        const url = `https://www.google.com/maps?q=${lat},${lng}`
        setManualLocation(url)
        setForm((prev) => ({ ...prev, locationUrl: url }))
      },
      () => {
        setGeoError('Unable to fetch location. Please allow location access.')
      },
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  const handleInputChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || [])
    const merged = [...images, ...files].slice(0, 4)
    setImages(merged)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitMessage('')
    if (!form.fullName || !form.phoneNumber || !form.location) {
      setSubmitMessage('Name, phone number, and location are required.')
      return
    }
    if (!images.length) {
      setSubmitMessage('Please add at least one photo.')
      return
    }
    const locUrl = manualLocation || form.locationUrl
    if (!locUrl) {
      setSubmitMessage('Please provide a GPS link (Use map or paste a map URL).')
      return
    }
    setSubmitting(true)

    const formData = new FormData()
    formData.append('full_name', form.fullName)
    formData.append('phone_number', form.phoneNumber)
    if (form.altPhoneNumber) formData.append('alt_phone_number', form.altPhoneNumber)
    formData.append('location', form.location)
    const landMarkValue = form.landmark
    if (landMarkValue) formData.append('land_mark', landMarkValue)
    formData.append('location_url', locUrl)
    if (form.district) formData.append('district', form.district)
    formData.append('emergency_type', form.emergencyType)
    formData.append('priority_level', form.priorityLevel)

    const rescueCount = form.numberOfPeopleToRescue
      ? Number(form.numberOfPeopleToRescue)
      : 0
    const peopleCount = form.numberOfPeople ? Number(form.numberOfPeople) : rescueCount
    formData.append('number_of_peoples_to_rescue', rescueCount)
    formData.append('number_of_peoples', peopleCount)

    formData.append('is_medical_needed', Boolean(form.isMedicalNeeded))
    if (form.waterLevel) formData.append('water_level', form.waterLevel)
    formData.append('safe_hours', form.safeHours ? Number(form.safeHours) : 0)

    formData.append('need_foods', Boolean(form.needFoods))
    formData.append('need_water', Boolean(form.needWater))
    formData.append('need_transport', Boolean(form.needTransport))
    formData.append('need_medic', Boolean(form.needMedic))
    formData.append('need_power', Boolean(form.needPower))
    formData.append('need_clothes', Boolean(form.needClothes))

    formData.append('description', form.description || 'No additional details provided.')
    formData.append('is_verified', false)

    images.forEach((file) => formData.append('images', file))

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        let message = 'Failed to submit'
        try {
          const data = await res.json()
          if (Array.isArray(data?.detail)) {
            message = data.detail.map((d) => d.msg || JSON.stringify(d)).join(', ')
          } else if (typeof data?.detail === 'string') {
            message = data.detail
          } else {
            message = data?.message || message
          }
        } catch (err) {
          const text = await res.text()
          message = text || message
        }
        throw new Error(message)
      }

      setSubmitMessage('Request sent successfully.')
      setForm({
        fullName: '',
        phoneNumber: '',
        altPhoneNumber: '',
        location: '',
        district: '',
        landmark: '',
        emergencyType: 'Medical need',
        numberOfPeopleToRescue: '',
        numberOfPeople: '',
        isMedicalNeeded: true,
        waterLevel: 'ankle',
        safeHours: '',
        description: '',
        needFoods: false,
        needWater: false,
        needTransport: false,
        needMedic: false,
        needPower: false,
        needClothes: false,
        priorityLevel: 'High',
        locationUrl: '',
      })
      setManualLocation('')
      setImages([])
      if (onClose) {
        onClose()
      } else {
        window.location.href = '/'
      }
      window.dispatchEvent(new Event('posts:reload'))
    } catch (err) {
      setSubmitMessage('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 py-8 sm:items-center sm:py-12">
      <form
        className="fade-in flex w-full max-w-5xl max-h-[calc(100vh-2.5rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onSubmit={handleSubmit}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">උදව් ඉල්ලන්න</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <div className="grid flex-1 gap-5 overflow-y-auto px-6 py-6 md:grid-cols-2 md:gap-6 md:items-start">
          <section className="flex h-full flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-5 shadow-sm">
            <h3 className="text-sm font-bold tracking-[0.2em] text-slate-900">
              ඔබගේ සම්බන්ධතා තොරතුරු
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                නම
                <input
                  type="text"
                  value={form.fullName}
                  onChange={handleInputChange('fullName')}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-400 focus:outline-none"
                  placeholder="Your name"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                දුරකථන අංකය
                <input
                  type="tel"
                  value={form.phoneNumber}
                  onChange={handleInputChange('phoneNumber')}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-400 focus:outline-none"
                  placeholder="+940777123456"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                විකල්ප දුරකථන අංකය
                <input
                  type="tel"
                  value={form.altPhoneNumber}
                  onChange={handleInputChange('altPhoneNumber')}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-400 focus:outline-none"
                  placeholder="+940777123456 (optional)"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                දිස්ත්රික්කය
                <input
                  type="text"
                  value={form.district}
                  onChange={handleInputChange('district')}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-400 focus:outline-none"
                  placeholder="District"
                />
              </label>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                ස්ථානය
                <input
                  type="text"
                  value={form.location}
                  onChange={handleInputChange('location')}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-400 focus:outline-none"
                  placeholder="නිවසේ අංකය / වීදිය"
                />
              </label>
            <label className="flex flex-col gap-2 text-sm text-slate-700">
              <span>GPS ස්ථානය</span>
              <button
                type="button"
                onClick={handleUseLocation}
                className="inline-flex w-fit items-center justify-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white shadow hover:bg-slate-800"
                >
                  <i className="ri-map-pin-line text-sm" aria-hidden="true"></i>
                  Use map
                </button>
                <div className="flex flex-col gap-1">
                  {manualLocation ? (
                    <a
                      href={manualLocation}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-slate-800 underline underline-offset-4 hover:text-slate-900"
                    >
                      Open in map to verify location
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500">
                      ඔබගේ ස්ථානය ලබා ගැනීමට සහ සත්‍යාපනය කිරීමට සිතියම තට්ටු කරන්න.
                    </span>
                  )}
                  {geoError && <span className="text-xs text-red-600">{geoError}</span>}
                </div>
                <label className="flex flex-col gap-1 text-sm text-slate-700">
              ස්ථානය URL
              <input
                type="url"
                value={form.locationUrl}
                onChange={handleInputChange('locationUrl')}
                className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-400 focus:outline-none"
                placeholder="https://map.google.com/..."
              />
            </label>
              </label>
            </div>
            <label className="flex flex-col gap-1 text-sm text-slate-700">
              ආසන්න ස්ථානය
              <input
                type="text"
                value={form.landmark}
                onChange={handleInputChange('landmark')}
                className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-400 focus:outline-none"
                placeholder="ලගම පාසල, පන්සල, තවත්..."
              />
            </label>
          </section>

          <section className="flex h-full flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-5 shadow-sm">
            <h3 className="text-sm font-bold tracking-[0.2em] text-slate-900">
              හදිසි තොරතුරු
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                හදිසි තත්වය
                <select
                  className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-400 focus:outline-none"
                  value={form.emergencyType}
                  onChange={handleInputChange('emergencyType')}
                >
                  <option>ගංවතුරට කොටු වෙලා</option>
                  <option>වෛද්ය අවශ්යතාව</option>
                  <option>ජලය/ආහාර අවශ්‍යතාවය</option>
                  <option>ඉවත් කිරීමේ අවශ්යතාව</option>
                  <option>අතුරුදහන් වූ පුද්ගලයන්</option>
                  <option>ප්රවාහන අවශ්යතාව</option>
                  <option>වෙනත් අවශ්යතා</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-700">
                <span>වෛද්‍ය සහාය අවශ්‍යද?</span>
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={form.isMedicalNeeded}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, isMedicalNeeded: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                  />
                  ඔව්, වෛද්‍ය උපකාර අවශ්‍යයි
                </label>
              </label>
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                පුද්ගලයන් සංඛ්යාව
                <input
                  type="number"
                  min="0"
                  value={form.numberOfPeopleToRescue}
                  onChange={handleInputChange('numberOfPeopleToRescue')}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-400 focus:outline-none"
                  placeholder="e.g. 2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                ප්රමුඛත්වය
                <select
                  className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-400 focus:outline-none"
                  value={form.priority}
                  onChange={handleInputChange('priority')}
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </label>
            </div>
          </section>

          <section className="flex h-full flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-5 shadow-sm">
            <h3 className="text-sm font-bold tracking-[0.2em] text-slate-900">
              වත්මන් තත්ත්වය
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                ජල මට්ටම
                <select
                  className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-400 focus:outline-none"
                  value={form.waterLevel}
                  onChange={handleInputChange('waterLevel')}
                >
                  <option value="වළලුකරය">වළලුකරය</option>
                  <option value="දණහිස">දණහිස</option>
                  <option value="ඉණ">ඉණ</option>
                  <option value="පපුව">පපුව</option>
                  <option value="හිසට උඩින්">හිසට උඩින්</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                ආරක්ෂිත පැය
                <input
                  type="number"
                  min="0"
                  value={form.safeHours}
                  onChange={handleInputChange('safeHours')}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-400 focus:outline-none"
                  placeholder="Estimated safe hours"
                />
              </label>
            </div>
            <label className="flex flex-col gap-2 text-sm text-slate-700">
              ඡායාරූප (up to 4)
              <input
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                onChange={handleImagesChange}
                className="text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-800"
              />
              <span className="text-xs text-slate-500">
                තත්ත්වය පෙන්වීමට මෑත කාලීන ඡායාරූප එක් කරන්න. ඔබට කැමරාව හෝ ගොනු තෝරා ගත හැකිය.
              </span>
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {images.map((file, idx) => {
                    const url = URL.createObjectURL(file)
                    return (
                      <div
                        key={`${file.name}-${idx}`}
                        className="h-16 w-16 overflow-hidden rounded-lg border border-slate-200"
                      >
                        <img src={url} alt={file.name} className="h-full w-full object-cover" />
                      </div>
                    )
                  })}
                </div>
              )}
            </label>
          </section>

          <section className="flex h-full flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-5 shadow-sm">
            <h3 className="text-sm font-bold tracking-[0.2em] text-slate-900">
              අවශ්‍යය වර්ග
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.needFoods}
                  onChange={(e) => setForm((p) => ({ ...p, needFoods: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                />
                ආහාර
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.needWater}
                  onChange={(e) => setForm((p) => ({ ...p, needWater: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                />
                ජලය
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.needTransport}
                  onChange={(e) => setForm((p) => ({ ...p, needTransport: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                />
                ප්රවාහන
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.needMedic}
                  onChange={(e) => setForm((p) => ({ ...p, needMedic: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                />
                වෛද්ය උදව්
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.needPower}
                  onChange={(e) => setForm((p) => ({ ...p, needPower: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                />
                විදුලි බලය
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.needClothes}
                  onChange={(e) => setForm((p) => ({ ...p, needClothes: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                />
                ඇඳුම් පැළඳුම්
              </label>
            </div>
            <label className="flex flex-col gap-1 text-sm text-slate-700">
              අමතර විස්තර
              <textarea
                rows="3"
                value={form.description}
                onChange={handleInputChange('description')}
                className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-400 focus:outline-none"
                placeholder="නිශ්චිත අවශ්‍යතා හෝ දිශාවන් විස්තර කරන්න"
              />
            </label>
          </section>
        </div>
        <div className="sticky bottom-0 z-10 flex items-center justify-center gap-3 border-t border-slate-200 bg-white px-6 py-4">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
          >
            {submitting ? 'Sending...' : 'තහවුරු කරන්න'}
          </button>
          {submitMessage && (
            <span className="text-sm font-semibold text-slate-800">{submitMessage}</span>
          )}
        </div>
      </form>
    </div>
  )
}

export default HelpForm
