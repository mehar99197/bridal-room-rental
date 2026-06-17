import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-ivory/60">
      <div className="max-w-7xl mx-auto px-5 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2 max-w-sm">
          <span className="heading text-2xl gold-text">Maison Belle</span>
          <p className="mt-3 text-sm text-muted leading-relaxed">
            A curated atelier of luxury bridal suites and designer wedding gowns —
            crafted to make your most cherished day effortlessly unforgettable.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark mb-4">Explore</h4>
          <ul className="space-y-2.5 text-sm text-muted">
            <li><Link to="/rooms" className="hover:text-gold-dark transition-colors">Bridal Suites</Link></li>
            <li><Link to="/dresses" className="hover:text-gold-dark transition-colors">Dress Collection</Link></li>
            <li><Link to="/register" className="hover:text-gold-dark transition-colors">Create Account</Link></li>
            <li><Link to="/bookings" className="hover:text-gold-dark transition-colors">My Reservations</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark mb-4">Atelier</h4>
          <ul className="space-y-2.5 text-sm text-muted">
            <li>123 kasur Avenue</li>
            <li>meharahmad6599197@gmail.com</li>
            <li>+923289946268</li>
            <li>Tue – Sun · 10am – 7pm</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
          <span>&copy; {new Date().getFullYear()} Maison Belle. All rights reserved.</span>
          <span className="divider text-xs">Crafted with love for forever moments</span>
        </div>
      </div>
    </footer>
  )
}
