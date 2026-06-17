import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const ROOM_STATUS = ['available', 'booked', 'maintenance']
const DRESS_STATUS = ['available', 'rented', 'maintenance']
const SIZES = ['2','3','4','5','6','7','8','9','10','11','12','13','14','15']

const blankRoom = { name: '', room_number: '', description: '', capacity: '', price_per_hour: '', location: '', amenities: '', status: 'available', image: null }
const blankDress = { name: '', dress_number: '', description: '', category: '', size: '8', color: '', rental_price_per_day: '', deposit_amount: '0', status: 'available', image: null }

function Msg({ msg }) {
  if (!msg) return null
  return (
    <div className={`mb-4 rounded-xl px-4 py-3 text-sm border ${msg.ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-wine/8 border-wine/20 text-wine'}`}>
      {msg.text}
    </div>
  )
}

export default function AdminPanel() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Bookings')

  // Bookings
  const [bookings, setBookings] = useState([])
  const [bookingsLoading, setBookingsLoading] = useState(true)

  // Rooms
  const [rooms, setRooms] = useState([])
  const [roomsLoading, setRoomsLoading] = useState(true)
  const [showRoomForm, setShowRoomForm] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)   // null = add mode, object = edit mode
  const [roomForm, setRoomForm] = useState(blankRoom)
  const [roomMsg, setRoomMsg] = useState(null)
  const [roomSubmitting, setRoomSubmitting] = useState(false)

  // Dresses
  const [dresses, setDresses] = useState([])
  const [dressesLoading, setDressesLoading] = useState(true)
  const [showDressForm, setShowDressForm] = useState(false)
  const [editingDress, setEditingDress] = useState(null) // null = add mode, object = edit mode
  const [dressForm, setDressForm] = useState(blankDress)
  const [dressMsg, setDressMsg] = useState(null)
  const [dressSubmitting, setDressSubmitting] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    if (!user) return
    if (!user.is_staff) { navigate('/'); return }
    loadBookings()
    loadRooms()
    loadDresses()
    api.get('/categories/').then(({ data }) => setCategories(data.results || data || [])).catch(() => {})
  }, [user])

  const loadBookings = () => {
    setBookingsLoading(true)
    api.get('/bookings/').then(({ data }) => setBookings(data.results || data || [])).catch(() => setBookings([])).finally(() => setBookingsLoading(false))
  }
  const loadRooms = () => {
    setRoomsLoading(true)
    api.get('/rooms/').then(({ data }) => setRooms(data.results || data || [])).catch(() => setRooms([])).finally(() => setRoomsLoading(false))
  }
  const loadDresses = () => {
    setDressesLoading(true)
    api.get('/dresses/').then(({ data }) => setDresses(data.results || data || [])).catch(() => setDresses([])).finally(() => setDressesLoading(false))
  }

  // ── Booking actions ──
  const actBooking = async (id, action) => {
    if (!window.confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} this booking?`)) return
    try { await api.post(`/bookings/${id}/${action}/`); loadBookings() }
    catch { alert(`Failed to ${action} booking.`) }
  }

  // ── Room actions ──
  const startAddRoom = () => {
    setEditingRoom(null)
    setRoomForm(blankRoom)
    setRoomMsg(null)
    setShowRoomForm(true)
  }

  const startEditRoom = (r) => {
    setEditingRoom(r)
    setRoomForm({
      name: r.name || '',
      room_number: r.room_number || '',
      description: r.description || '',
      capacity: r.capacity || '',
      price_per_hour: r.price_per_hour || '',
      location: r.location || '',
      amenities: r.amenities || '',
      status: r.status || 'available',
      image: null,
    })
    setRoomMsg(null)
    setShowRoomForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelRoomForm = () => {
    setShowRoomForm(false)
    setEditingRoom(null)
    setRoomMsg(null)
  }

  const deleteRoom = async (id) => {
    if (!window.confirm('Delete this room? This cannot be undone.')) return
    try { await api.delete(`/rooms/${id}/`); loadRooms() }
    catch { alert('Failed to delete room.') }
  }

  const submitRoom = async (e) => {
    e.preventDefault()
    setRoomMsg(null)
    setRoomSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(roomForm).forEach(([k, v]) => {
        if (k === 'image') { if (v) fd.append(k, v) }
        else if (v !== '') fd.append(k, v)
      })
      if (editingRoom) {
        await api.patch(`/rooms/${editingRoom.id}/`, fd, { headers: { 'Content-Type': undefined } })
        setRoomMsg({ ok: true, text: 'Room updated successfully.' })
      } else {
        await api.post('/rooms/', fd, { headers: { 'Content-Type': undefined } })
        setRoomMsg({ ok: true, text: 'Room created successfully.' })
      }
      setRoomForm(blankRoom)
      setEditingRoom(null)
      setShowRoomForm(false)
      loadRooms()
    } catch (err) {
      setRoomMsg({ ok: false, text: Object.values(err.response?.data || {}).flat().join(' ') || `Failed to ${editingRoom ? 'update' : 'create'} room.` })
    } finally {
      setRoomSubmitting(false)
    }
  }

  // ── Dress actions ──
  const startAddDress = () => {
    setEditingDress(null)
    setDressForm(blankDress)
    setDressMsg(null)
    setShowDressForm(true)
  }

  const startEditDress = (d) => {
    setEditingDress(d)
    setDressForm({
      name: d.name || '',
      dress_number: d.dress_number || '',
      description: d.description || '',
      category: d.category || '',
      size: d.size || '8',
      color: d.color || '',
      rental_price_per_day: d.rental_price_per_day || '',
      deposit_amount: d.deposit_amount || '0',
      status: d.status || 'available',
      image: null,
    })
    setDressMsg(null)
    setShowDressForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelDressForm = () => {
    setShowDressForm(false)
    setEditingDress(null)
    setDressMsg(null)
  }

  const deleteDress = async (id) => {
    if (!window.confirm('Delete this dress? This cannot be undone.')) return
    try { await api.delete(`/dresses/${id}/`); loadDresses() }
    catch { alert('Failed to delete dress.') }
  }

  const submitDress = async (e) => {
    e.preventDefault()
    setDressMsg(null)
    setDressSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(dressForm).forEach(([k, v]) => {
        if (k === 'image') { if (v) fd.append(k, v) }
        else if (v !== '') fd.append(k, v)
      })
      if (editingDress) {
        await api.patch(`/dresses/${editingDress.id}/`, fd, { headers: { 'Content-Type': undefined } })
        setDressMsg({ ok: true, text: 'Dress updated successfully.' })
      } else {
        await api.post('/dresses/', fd, { headers: { 'Content-Type': undefined } })
        setDressMsg({ ok: true, text: 'Dress created successfully.' })
      }
      setDressForm(blankDress)
      setEditingDress(null)
      setShowDressForm(false)
      loadDresses()
    } catch (err) {
      setDressMsg({ ok: false, text: Object.values(err.response?.data || {}).flat().join(' ') || `Failed to ${editingDress ? 'update' : 'create'} dress.` })
    } finally {
      setDressSubmitting(false)
    }
  }

  const pendingCount = bookings.filter(b => b.status === 'pending').length

  if (!user?.is_staff) return null

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      <div className="animate-fade-in-up mb-8">
        <p className="eyebrow">Administration</p>
        <h1 className="heading text-4xl mt-1">Admin Panel</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Bookings', value: bookings.length },
          { label: 'Pending Approval', value: pendingCount, warn: pendingCount > 0 },
          { label: 'Total Rooms', value: rooms.length },
          { label: 'Total Dresses', value: dresses.length },
        ].map(s => (
          <div key={s.label} className={`card p-5 ${s.warn ? 'border-wine/30' : ''}`}>
            <div className={`heading text-3xl ${s.warn ? 'text-wine' : 'gold-text'}`}>{s.value}</div>
            <p className="text-xs text-muted mt-1 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl bg-gold-light/20 w-fit">
        {['Bookings', 'Rooms', 'Dresses'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-white shadow text-ink' : 'text-muted hover:text-ink'}`}>
            {t}
            {t === 'Bookings' && pendingCount > 0 && (
              <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-wine text-white">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Bookings Tab ── */}
      {tab === 'Bookings' && (
        <div className="card overflow-hidden animate-fade-in-up">
          {bookingsLoading ? (
            <div className="py-16 grid place-items-center"><div className="spinner" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted border-b border-line">
                    <th className="py-4 px-5 font-medium">Guest</th>
                    <th className="py-4 px-4 font-medium">Item</th>
                    <th className="py-4 px-4 font-medium">Type</th>
                    <th className="py-4 px-4 font-medium">Dates</th>
                    <th className="py-4 px-4 font-medium">Status</th>
                    <th className="py-4 px-4 font-medium text-right">Total</th>
                    <th className="py-4 px-5 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-14 text-muted">No bookings yet.</td></tr>
                  ) : bookings.map(b => (
                    <tr key={b.id} className="border-b border-line/60 last:border-0 hover:bg-gold-light/10 transition-colors">
                      <td className="py-4 px-5 text-muted">{b.user_email || b.user}</td>
                      <td className="py-4 px-4 heading">{b.room_name || b.dress_name || 'N/A'}</td>
                      <td className="py-4 px-4">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-gold-light/30 text-gold-dark">{b.room ? 'Suite' : 'Dress'}</span>
                      </td>
                      <td className="py-4 px-4 text-muted whitespace-nowrap">
                        {new Date(b.start_date).toLocaleDateString()} – {new Date(b.end_date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4"><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                      <td className="py-4 px-4 text-right heading text-gold-dark">${b.total_price}</td>
                      <td className="py-4 px-5">
                        <div className="flex justify-center gap-2">
                          {b.status === 'pending' ? (
                            <>
                              <button onClick={() => actBooking(b.id, 'approve')}
                                className="text-xs px-3 py-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors">Approve</button>
                              <button onClick={() => actBooking(b.id, 'reject')}
                                className="text-xs px-3 py-1.5 rounded-full bg-wine/8 text-wine hover:bg-wine/15 transition-colors">Reject</button>
                            </>
                          ) : (
                            <span className="text-muted text-xs">{b.status}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Rooms Tab ── */}
      {tab === 'Rooms' && (
        <div className="animate-fade-in-up space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-muted text-sm">{rooms.length} room{rooms.length !== 1 ? 's' : ''} total</p>
            <button onClick={showRoomForm && !editingRoom ? cancelRoomForm : startAddRoom}
              className="btn btn-primary py-2! px-5! text-sm">
              {showRoomForm && !editingRoom ? 'Cancel' : '+ Add Room'}
            </button>
          </div>

          {showRoomForm && (
            <div className="card p-6">
              <h2 className="heading text-xl mb-1">{editingRoom ? 'Edit Room' : 'New Room'}</h2>
              {editingRoom && <p className="text-sm text-muted mb-4">Editing: <span className="text-ink font-medium">{editingRoom.name}</span></p>}
              <Msg msg={roomMsg} />
              <form onSubmit={submitRoom} className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Name *</label>
                  <input className="input-field" value={roomForm.name} onChange={e => setRoomForm({ ...roomForm, name: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Room Number</label>
                  <input className="input-field" value={roomForm.room_number} onChange={e => setRoomForm({ ...roomForm, room_number: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Description *</label>
                  <textarea className="input-field" rows="2" value={roomForm.description} onChange={e => setRoomForm({ ...roomForm, description: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Capacity *</label>
                  <input type="number" min="1" className="input-field" value={roomForm.capacity} onChange={e => setRoomForm({ ...roomForm, capacity: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Price per Hour ($) *</label>
                  <input type="number" min="0" step="0.01" className="input-field" value={roomForm.price_per_hour} onChange={e => setRoomForm({ ...roomForm, price_per_hour: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Location *</label>
                  <input className="input-field" value={roomForm.location} onChange={e => setRoomForm({ ...roomForm, location: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select className="input-field" value={roomForm.status} onChange={e => setRoomForm({ ...roomForm, status: e.target.value })}>
                    {ROOM_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Amenities <span className="text-muted normal-case font-normal">(comma separated)</span></label>
                  <input className="input-field" placeholder="e.g. WiFi, AC, Mirror" value={roomForm.amenities} onChange={e => setRoomForm({ ...roomForm, amenities: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">
                    Image
                    {editingRoom && <span className="text-muted normal-case font-normal ml-1">(leave blank to keep existing)</span>}
                  </label>
                  <input type="file" accept="image/*" className="input-field py-2!" onChange={e => setRoomForm({ ...roomForm, image: e.target.files[0] || null })} />
                </div>
                <div className="sm:col-span-2 flex justify-end gap-3">
                  <button type="button" onClick={cancelRoomForm} className="btn btn-outline py-2! px-6!">Cancel</button>
                  <button type="submit" disabled={roomSubmitting} className="btn btn-primary py-2! px-6!">
                    {roomSubmitting ? 'Saving…' : editingRoom ? 'Update Room' : 'Create Room'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="card overflow-hidden">
            {roomsLoading ? (
              <div className="py-16 grid place-items-center"><div className="spinner" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-muted border-b border-line">
                      <th className="py-4 px-5 font-medium">Name</th>
                      <th className="py-4 px-4 font-medium">No.</th>
                      <th className="py-4 px-4 font-medium">Capacity</th>
                      <th className="py-4 px-4 font-medium">Location</th>
                      <th className="py-4 px-4 font-medium">Price/hr</th>
                      <th className="py-4 px-4 font-medium">Status</th>
                      <th className="py-4 px-5 font-medium text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-14 text-muted">No rooms yet. Add one above.</td></tr>
                    ) : rooms.map(r => (
                      <tr key={r.id} className={`border-b border-line/60 last:border-0 hover:bg-gold-light/10 transition-colors ${editingRoom?.id === r.id ? 'bg-gold-light/20' : ''}`}>
                        <td className="py-4 px-5 heading">{r.name}</td>
                        <td className="py-4 px-4 text-muted">{r.room_number || '—'}</td>
                        <td className="py-4 px-4 text-muted">{r.capacity}</td>
                        <td className="py-4 px-4 text-muted">{r.location}</td>
                        <td className="py-4 px-4 heading text-gold-dark">${r.price_per_hour}</td>
                        <td className="py-4 px-4"><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                        <td className="py-4 px-5">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => startEditRoom(r)}
                              className="text-xs px-3 py-1.5 rounded-full bg-gold-light/40 text-gold-dark hover:bg-gold-light/70 transition-colors">Edit</button>
                            <button onClick={() => deleteRoom(r.id)}
                              className="text-xs px-3 py-1.5 rounded-full bg-wine/8 text-wine hover:bg-wine/15 transition-colors">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Dresses Tab ── */}
      {tab === 'Dresses' && (
        <div className="animate-fade-in-up space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-muted text-sm">{dresses.length} dress{dresses.length !== 1 ? 'es' : ''} total</p>
            <button onClick={showDressForm && !editingDress ? cancelDressForm : startAddDress}
              className="btn btn-primary py-2! px-5! text-sm">
              {showDressForm && !editingDress ? 'Cancel' : '+ Add Dress'}
            </button>
          </div>

          {showDressForm && (
            <div className="card p-6">
              <h2 className="heading text-xl mb-1">{editingDress ? 'Edit Dress' : 'New Dress'}</h2>
              {editingDress && <p className="text-sm text-muted mb-4">Editing: <span className="text-ink font-medium">{editingDress.name}</span></p>}
              <Msg msg={dressMsg} />
              <form onSubmit={submitDress} className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Name *</label>
                  <input className="input-field" value={dressForm.name} onChange={e => setDressForm({ ...dressForm, name: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Dress Number</label>
                  <input className="input-field" value={dressForm.dress_number} onChange={e => setDressForm({ ...dressForm, dress_number: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Description *</label>
                  <textarea className="input-field" rows="2" value={dressForm.description} onChange={e => setDressForm({ ...dressForm, description: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Category</label>
                  <select className="input-field" value={dressForm.category} onChange={e => setDressForm({ ...dressForm, category: e.target.value })}>
                    <option value="">— Select Category —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Size *</label>
                  <select className="input-field" value={dressForm.size} onChange={e => setDressForm({ ...dressForm, size: e.target.value })} required>
                    {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Color *</label>
                  <input className="input-field" value={dressForm.color} onChange={e => setDressForm({ ...dressForm, color: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Rental Price per Day ($) *</label>
                  <input type="number" min="0" step="0.01" className="input-field" value={dressForm.rental_price_per_day} onChange={e => setDressForm({ ...dressForm, rental_price_per_day: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Deposit Amount ($)</label>
                  <input type="number" min="0" step="0.01" className="input-field" value={dressForm.deposit_amount} onChange={e => setDressForm({ ...dressForm, deposit_amount: e.target.value })} />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select className="input-field" value={dressForm.status} onChange={e => setDressForm({ ...dressForm, status: e.target.value })}>
                    {DRESS_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">
                    Image
                    {editingDress && <span className="text-muted normal-case font-normal ml-1">(leave blank to keep existing)</span>}
                  </label>
                  <input type="file" accept="image/*" className="input-field py-2!" onChange={e => setDressForm({ ...dressForm, image: e.target.files[0] || null })} />
                </div>
                <div className="sm:col-span-2 flex justify-end gap-3">
                  <button type="button" onClick={cancelDressForm} className="btn btn-outline py-2! px-6!">Cancel</button>
                  <button type="submit" disabled={dressSubmitting} className="btn btn-primary py-2! px-6!">
                    {dressSubmitting ? 'Saving…' : editingDress ? 'Update Dress' : 'Create Dress'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="card overflow-hidden">
            {dressesLoading ? (
              <div className="py-16 grid place-items-center"><div className="spinner" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-muted border-b border-line">
                      <th className="py-4 px-5 font-medium">Name</th>
                      <th className="py-4 px-4 font-medium">No.</th>
                      <th className="py-4 px-4 font-medium">Category</th>
                      <th className="py-4 px-4 font-medium">Size</th>
                      <th className="py-4 px-4 font-medium">Color</th>
                      <th className="py-4 px-4 font-medium">Price/day</th>
                      <th className="py-4 px-4 font-medium">Status</th>
                      <th className="py-4 px-5 font-medium text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dresses.length === 0 ? (
                      <tr><td colSpan={8} className="text-center py-14 text-muted">No dresses yet. Add one above.</td></tr>
                    ) : dresses.map(d => (
                      <tr key={d.id} className={`border-b border-line/60 last:border-0 hover:bg-gold-light/10 transition-colors ${editingDress?.id === d.id ? 'bg-gold-light/20' : ''}`}>
                        <td className="py-4 px-5 heading">{d.name}</td>
                        <td className="py-4 px-4 text-muted">{d.dress_number || '—'}</td>
                        <td className="py-4 px-4 text-muted">{d.category_name || '—'}</td>
                        <td className="py-4 px-4 text-muted">{d.size}</td>
                        <td className="py-4 px-4 text-muted">{d.color}</td>
                        <td className="py-4 px-4 heading text-gold-dark">${d.rental_price_per_day}</td>
                        <td className="py-4 px-4"><span className={`badge badge-${d.status}`}>{d.status}</span></td>
                        <td className="py-4 px-5">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => startEditDress(d)}
                              className="text-xs px-3 py-1.5 rounded-full bg-gold-light/40 text-gold-dark hover:bg-gold-light/70 transition-colors">Edit</button>
                            <button onClick={() => deleteDress(d.id)}
                              className="text-xs px-3 py-1.5 rounded-full bg-wine/8 text-wine hover:bg-wine/15 transition-colors">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
