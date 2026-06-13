(function() {
    'use strict';

    // ── Confetti Effect on Page Load ──
    function createConfetti() {
        const colors = ['#D4AF37', '#8B3A8B', '#F0D68A', '#B86BB8', '#FFD700', '#C8A8C8'];
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: ${Math.random() * 8 + 4}px;
                height: ${Math.random() * 8 + 4}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                top: -10px;
                left: ${Math.random() * 100}vw;
                opacity: ${Math.random() * 0.5 + 0.3};
                pointer-events: none;
                z-index: 9999;
                animation: confettiFall ${Math.random() * 3 + 3}s linear forwards;
                animation-delay: ${Math.random() * 2}s;
            `;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 7000);
        }
    }

    // Add keyframes dynamically
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes confettiFall {
            0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg) scale(0.3); opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);

    // Trigger confetti on first load
    if (window.location.pathname === '/admin/' || window.location.pathname === '/admin/login/') {
        setTimeout(createConfetti, 500);
    }

    // ── Interactive Row Glow ──
    document.addEventListener('mouseover', function(e) {
        const row = e.target.closest('tr');
        if (row && row.closest('#result_list')) {
            row.style.transition = 'box-shadow 0.3s ease';
            row.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.08)';
        }
    });

    document.addEventListener('mouseout', function(e) {
        const row = e.target.closest('tr');
        if (row && row.closest('#result_list')) {
            row.style.boxShadow = 'none';
        }
    });

    // ── Smooth Sidebar Toggle ──
    const toggleNav = document.getElementById('toggle-nav');
    if (toggleNav) {
        toggleNav.addEventListener('click', function() {
            const nav = document.getElementById('nav-sidebar');
            if (nav) {
                nav.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            }
        });
    }

    // ── Animated Submit Button ──
    document.addEventListener('submit', function(e) {
        const btn = e.target.querySelector('input[type="submit"]');
        if (btn) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
        }
    });

    // ─── Typing Effect for Brand ───
    const brandEl = document.querySelector('.brand-glow a');
    if (brandEl) {
        const originalText = '💎 Bridal Rental Admin';
        // Just add a subtle pulse class
        brandEl.classList.add('brand-pulse');
    }

    // ── Fade In Action Items ──
    const actionItems = document.querySelectorAll('.action-checkbox');
    actionItems.forEach((item, i) => {
        item.style.animation = `fadeInUp 0.3s ease-out ${i * 0.05}s both`;
    });

    // ── Module Counter Badge ──
    const moduleTables = document.querySelectorAll('.module table');
    moduleTables.forEach(table => {
        const count = table.querySelectorAll('tbody tr').length;
        if (count > 0) {
            const caption = table.closest('.module')?.querySelector('caption');
            if (caption) {
                const badge = document.createElement('span');
                badge.style.cssText = `
                    background: linear-gradient(135deg, #D4AF37, #B8960F);
                    color: #1a0a1e;
                    border-radius: 12px;
                    padding: 2px 10px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    margin-left: 10px;
                    vertical-align: middle;
                    animation: badgePulse 2s ease-in-out infinite;
                `;
                badge.textContent = count;
                caption.appendChild(badge);
            }
        }
    });

    // ── Add Gradient Border to Active Filters ──
    document.querySelectorAll('#changelist-filter li.selected').forEach(li => {
        li.style.borderLeft = '3px solid #D4AF37';
        li.style.paddingLeft = '9px';
    });

})();
