import { useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header'
import Status from './components/Status'
import PostCard from './components/PostCard'
import Footer from './components/Footer'
import HelpForm from './components/HelpForm'

function App() {
  const [showHelpForm, setShowHelpForm] = useState(false)
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [postsError, setPostsError] = useState('')
  const [stats, setStats] = useState({
    total_posts: 0,
    high_priority_posts: 0,
    medium_priority_posts: 0,
    low_priority_posts: 0,
  })
  const [reloadPostsToggle, setReloadPostsToggle] = useState(false)
  const statusCards = [
    { number: stats.total_posts, name: 'Total', accent: '#0ea5e9' },
    { number: stats.high_priority_posts, name: 'High', accent: '#ef4444' },
    { number: stats.medium_priority_posts, name: 'Medium', accent: '#f59e0b' },
    { number: stats.low_priority_posts, name: 'Low', accent: '#10b981' },
  ]

  const triggerReload = () => setReloadPostsToggle((p) => !p)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true)
      setPostsError('')
      try {
        const res = await fetch('/api/posts', { headers: { accept: 'application/json' } })
        if (!res.ok) {
          throw new Error(`Failed to load posts (${res.status})`)
        }
        const data = await res.json()
        const mapped = Array.isArray(data)
          ? data.map((p) => {
              const needs = [
                p.need_foods ? 'Food' : null,
                p.need_water ? 'Water' : null,
                p.need_transport ? 'Transport' : null,
                p.need_medic ? 'Medic' : null,
                p.need_power ? 'Power' : null,
                p.need_clothes ? 'Clothes' : null,
              ]
                .filter(Boolean)
                .join(', ')
              const images = Array.isArray(p.images) ? p.images.map((img) => img.image_url) : []
              return {
                id: p.id,
                name: p.full_name,
                phoneNumbers: [p.phone_number, p.alt_phone_number].filter(Boolean).map(String),
                location: p.location,
                landmark: p.land_mark,
                district: p.district,
                peopleCount: p.number_of_peoples || p.number_of_peoples_to_rescue || 0,
                situation: `${p.emergency_type || ''} · Water: ${p.water_level || 'n/a'} · Safe hours: ${
                  p.safe_hours ?? 'n/a'
                }`,
                emergencyType: p.emergency_type,
                waterLevel: p.water_level,
                safeHours: p.safe_hours,
                needs: needs || 'N/A',
                priority: p.priority_level || 'N/A',
                battery: p.safe_hours ?? 0,
                mapLink: p.location_url || '',
                description: p.description || '',
                isMedicalNeeded: Boolean(p.is_medical_needed),
                isVerified: Boolean(p.is_verified),
                createdAt: p.created_at,
                needsFlags: {
                  food: Boolean(p.need_foods),
                  water: Boolean(p.need_water),
                  transport: Boolean(p.need_transport),
                  medic: Boolean(p.need_medic),
                  power: Boolean(p.need_power),
                  clothes: Boolean(p.need_clothes),
                },
                images,
              }
            })
          : []
        setPosts(mapped.filter((p) => p.isVerified))
      } catch (err) {
        setPostsError(err.message || 'Failed to load posts.')
      } finally {
        setLoadingPosts(false)
      }
    }

    fetchPosts()
  }, [reloadPostsToggle])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/posts/stats', { headers: { accept: 'application/json' } })
        if (!res.ok) {
          throw new Error(`Failed to load stats (${res.status})`)
        }
        const data = await res.json()
        setStats({
          total_posts: data.total_posts ?? 0,
          high_priority_posts: data.high_priority_posts ?? 0,
          medium_priority_posts: data.medium_priority_posts ?? 0,
          low_priority_posts: data.low_priority_posts ?? 0,
        })
      } catch (_err) {
        // keep defaults on failure
      }
    }
    fetchStats()
  }, [reloadPostsToggle])

  return (
    <div className="relative min-h-screen bg-[#f1f3e0] text-slate-900">
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 justify-center px-4 pb-16 pt-4 md:px-8 lg:px-10">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8">
            <div className="slide-up grid w-full grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {statusCards.map((status) => (
                <Status
                  key={`${status.name}-${status.number}`}
                  number={status.number}
                  name={status.name}
                  accent={status.accent}
                />
              ))}
            </div>
            <button
              className="slide-up inline-flex items-center font-sinhala mt-8 justify-center rounded-full bg-red-600 px-24 py-4 text-lg font-bold uppercase tracking-wide text-white shadow-lg shadow-slate-300 transition hover:bg-red-700 hover:shadow-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-300 "
              onClick={() => setShowHelpForm(true)}
            >
              උදව් ඉල්ලීම
            </button>
            <section className="fade-in w-full">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">උදව් අවශ්‍යය අය</h2>
                <button
                  type="button"
                  onClick={triggerReload}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  <i className="ri-refresh-line text-base" aria-hidden="true"></i>
                </button>
              </div>
              {loadingPosts && <p className="text-sm text-slate-600">Loading posts...</p>}
              {postsError && <p className="text-sm text-red-600">{postsError}</p>}
              {!loadingPosts && !postsError && (
                <div className="flex w-full flex-col gap-4">
                  {posts.map((post) => (
                    <PostCard key={post.id} {...post} />
                  ))}
                  {!posts.length && (
                    <p className="text-sm text-slate-600">No posts available yet.</p>
                  )}
                </div>
              )}
            </section>
          </div>
        </main>
        <Footer />
      </div>
      {showHelpForm && <HelpForm onClose={() => setShowHelpForm(false)} />}
    </div>
  )
}

export default App
