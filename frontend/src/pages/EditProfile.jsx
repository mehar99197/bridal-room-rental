import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function EditProfile() {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()

  const [phone, setPhone] = useState(user?.phone || '')
  const [address, setAddress] = useState(user?.address || '')
  const [avatar, setAvatar] = useState(null)
  const [preview, setPreview] = useState(user?.avatar || null)
  const [msg, setMsg] = useState(null)
  const [saving, setSaving] = useState(false)

  const onPick = (e) => {
    const file = e.target.files[0] || null
    setAvatar(file)
    setPreview(file ? URL.createObjectURL(file) : user?.avatar || null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg(null)
    setSaving(true)
    try {
      await updateProfile({ phone, address, avatar })
      setMsg({ ok: true, text: 'Profile updated successfully.' })
      setAvatar(null)
    } catch (err) {
      setMsg({ ok: false, text: Object.values(err.response?.data || {}).flat().join(' ') || 'Failed to update profile.' })
    } finally {
      setSaving(false)
    }
  }

  const initial = (user?.username || user?.email || '?').charAt(0)

  return (
    <div className="max-w-lg mx-auto px-5 py-12">
      <div className="card p-8 md:p-10 animate-fade-in-up">
        <div className="mb-7">
          <p className="eyebrow">Your account</p>
          <h1 className="heading text-3xl mt-1">Edit Profile</h1>
          <p className="text-sm text-muted mt-2">Update your contact details and photo</p>
        </div>

        {msg && (
          <div className={`mb-5 rounded-xl px-4 py-3 text-sm border ${msg.ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-wine/8 border-wine/20 text-wine'}`}>
            {msg.text}
          </div>
        )}

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-7">
          {preview ? (
            <img src={preview} alt="Avatar" className="w-20 h-20 rounded-full object-cover border border-line" />
          ) : (
            <span className={`grid place-items-center w-20 h-20 rounded-full text-2xl font-semibold uppercase ${user?.is_staff ? 'bg-wine/12 text-wine' : 'bg-gold-light/50 text-gold-dark'}`}>
              {initial}
            </span>
          )}
          <label className="btn btn-outline py-2! px-5! text-sm cursor-pointer">
            Change photo
            <input type="file" accept="image/*" className="hidden" onChange={onPick} />
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Read-only identity */}
          <div>
            <label className="label">Username</label>
            <input className="input-field bg-gold-light/10 text-muted" value={user?.username || ''} disabled />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input className="input-field bg-gold-light/10 text-muted" value={user?.email || ''} disabled />
          </div>

          {/* Editable */}
          <div>
            <label className="label">Phone</label>
            <input className="input-field" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="label">Address</label>
            <textarea className="input-field" rows="3" placeholder="Where should we reach you?" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-outline py-2! px-6!">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary py-2! px-6!">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
