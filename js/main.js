/* ==========================================================================
   FIND | Real Estate Premium — Main JavaScript
   Dependencias: GSAP 3.12, ScrollTrigger, Lenis 1.0.19
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. Smooth Scroll — Lenis
// --------------------------------------------------------------------------
const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

// --------------------------------------------------------------------------
// 2. GSAP + ScrollTrigger Setup
// --------------------------------------------------------------------------
gsap.registerPlugin(ScrollTrigger);

// Vincular Lenis con ScrollTrigger — SOLO vía gsap.ticker (no requestAnimationFrame separado)
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// --------------------------------------------------------------------------
// 3. Hero — Logo mask scroll parallax
// --------------------------------------------------------------------------
gsap.to('#main-logo', {
    backgroundPosition: '50% 100%',
    ease: 'none',
    scrollTrigger: {
        trigger: '#hero-trigger',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
    },
});

// Hero — Imagen de fondo sutil fade out al hacer scroll
gsap.to('#hero-bg-deep', {
    scale: 1,
    opacity: 0,
    scrollTrigger: {
        trigger: '#hero-trigger',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
    },
});

// --------------------------------------------------------------------------
// 4. Horizontal Scroll Section (desktop only)
// --------------------------------------------------------------------------
const horizontalContent = document.querySelector('.horizontal-wrap');

if (window.innerWidth >= 768) {
    gsap.to(horizontalContent, {
        x: () => -(horizontalContent.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
            trigger: '#horizontal-wrapper',
            start: 'top top',
            end: () => '+=' + horizontalContent.scrollWidth,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
        },
    });
}

// --------------------------------------------------------------------------
// 5. Background Color Shift
// --------------------------------------------------------------------------

// Verde oscuro → Verde oscuro al salir del scroll horizontal (servicios también es oscuro)
gsap.to('body', {
    backgroundColor: '#0c1f11',
    color: '#ffffff',
    scrollTrigger: {
        trigger: '.service-item',
        start: 'top 80%',
        scrub: true,
    },
});

// --------------------------------------------------------------------------
// 6. Reveal Animations (al hacer load)
// --------------------------------------------------------------------------
window.addEventListener('load', () => {
    // Tagline del hero
    gsap.to('#hero-sub', {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'expo.out',
        delay: 0.8,
    });

    // CTA del hero
    gsap.to('#hero-cta', {
        opacity: 1,
        duration: 1.2,
        ease: 'expo.out',
        delay: 1.4,
    });

    // Mosaico de imágenes — animaciones por dirección
    // Grande (izquierda): entra desde abajo
    gsap.from('#mosaic-main', {
        y: 120,
        opacity: 0,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: '#mosaic-main', start: 'top 85%' },
    });
    // Superior derecha: entra desde arriba
    gsap.from('#mosaic-top', {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '#mosaic-top', start: 'top 85%' },
    });
    // Inferior derecha: entra desde el costado derecho
    gsap.from('#mosaic-bottom', {
        x: 120,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '#mosaic-bottom', start: 'top 90%' },
    });

    // ── Animaciones filas de servicios ───────────────────────────────────

    gsap.utils.toArray('.svc-row').forEach((row, i) => {
        // Título desliza desde la izquierda
        gsap.from(row.querySelector('.svc-title'), {
            x: -80,
            opacity: 0,
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: { trigger: row, start: 'top 88%' },
        });
        // Chips (si los hay) aparecen con stagger después del título
        const chips = row.querySelectorAll('.svc-chip');
        if (chips.length) {
            gsap.from(chips, {
                y: 20,
                opacity: 0,
                duration: 0.6,
                ease: 'expo.out',
                stagger: 0.06,
                delay: 0.25,
                scrollTrigger: { trigger: row, start: 'top 88%' },
            });
        }
        // Descripción (desktop): NO animar con GSAP para no bloquear el hover CSS
        // El CSS ya maneja opacity 0→1 en :hover
        // Línea separadora: se "dibuja" de izquierda a derecha
        gsap.from(row, {
            borderTopColor: 'rgba(255,255,255,0)',
            duration: 0.8,
            ease: 'expo.out',
            scrollTrigger: { trigger: row, start: 'top 90%' },
        });
    });

    // ── Animaciones de imágenes al hacer scroll ──────────────────────────

    // Mosaico "Nosotros": fotos entran con stagger y dirección alternada
    gsap.from('.news-card .aspect-\\[16\\/9\\] img', {
        scale: 1.15,
        opacity: 0,
        duration: 1.4,
        ease: 'expo.out',
        stagger: 0.2,
        scrollTrigger: { trigger: '.news-card', start: 'top 85%' },
    });

    // Tarjetas "¿Por qué Optimizare?": imagen sube con clip reveal
    gsap.utils.toArray('#ahorro .group .rounded-\\[40px\\]').forEach((img, i) => {
        gsap.from(img, {
            y: 80,
            opacity: 0,
            duration: 1.1,
            ease: 'expo.out',
            delay: i * 0.18,
            scrollTrigger: { trigger: img, start: 'top 88%' },
        });
    });

    // Tarjetas complementarios: escalan desde pequeño al entrar
    gsap.utils.toArray('.comp-card').forEach((card, i) => {
        gsap.from(card, {
            scale: 0.92,
            opacity: 0,
            duration: 0.9,
            ease: 'expo.out',
            delay: i * 0.12,
            scrollTrigger: { trigger: card, start: 'top 88%' },
        });
    });

    // Filas de servicios: imagen de fondo hace parallax suave
    gsap.utils.toArray('.svc-bg img').forEach((img) => {
        gsap.fromTo(img,
            { y: -30 },
            {
                y: 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: img.closest('.svc-row'),
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5,
                },
            }
        );
    });

    // Imagen hero del mosaico mobile: entra desde abajo
    gsap.from('.block.md\\:hidden.mt-6', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.block.md\\:hidden.mt-6', start: 'top 88%' },
    });
});

// --------------------------------------------------------------------------
// Tap en servicios (mobile): muestra imagen de fondo al tocar
// --------------------------------------------------------------------------
if (window.innerWidth < 768) {
    document.querySelectorAll('.svc-row').forEach(row => {
        row.addEventListener('click', (e) => {
            // Si se tocó el botón CTA, dejarlo navegar libremente
            if (e.target.closest('.svc-cta-btn')) return;
            // Primer tap: mostrar imagen
            if (!row.classList.contains('tapped')) {
                document.querySelectorAll('.svc-row').forEach(r => r.classList.remove('tapped'));
                row.classList.add('tapped');
            } else {
                // Segundo tap en el título: cerrar
                row.classList.remove('tapped');
            }
        });
    });
}

// --------------------------------------------------------------------------
// 7. Calculadora de ahorro
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    var tipoSeleccionado = null;
    var energiaSeleccionada = 'solar';
    var tejadoSeleccionado = null;

    // Precio medio €/kW/día término de potencia en España (tarifa BT)
    var PRECIO_POTENCIA_DIA = 0.104708;

    function activarGrupo(selector, atributo, cb) {
        document.querySelectorAll(selector).forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll(selector).forEach(function(b) {
                    b.style.background = '';
                    b.style.color = 'rgba(255,255,255,0.6)';
                    b.style.borderColor = 'rgba(255,255,255,0.15)';
                    b.style.boxShadow = '';
                });
                btn.style.background = '#2dc866';
                btn.style.color = '#000';
                btn.style.borderColor = '#2dc866';
                btn.style.boxShadow = '0 4px 14px rgba(45,200,102,0.4)';
                cb(btn.getAttribute(atributo));
            });
        });
    }

    activarGrupo('.calc-tipo-btn',   'data-tipo',   function(v) { tipoSeleccionado   = v; });
    activarGrupo('.calc-tejado-btn',  'data-tejado',  function(v) { tejadoSeleccionado  = v; });

    function mostrarError(msg, inputId) {
        var err = document.getElementById('calc-error');
        err.textContent = msg;
        err.style.display = 'block';
        if (inputId) {
            var el = document.getElementById(inputId);
            if (el) el.style.borderColor = '#ef4444';
            setTimeout(function() { if (el) el.style.borderColor = ''; }, 2500);
        }
        setTimeout(function() { err.style.display = 'none'; }, 3000);
    }

    function fmt(n) {
        return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
    }

    var calcBtn = document.getElementById('calc-btn');
    if (!calcBtn) return;

    calcBtn.addEventListener('click', function() {
        var kwh      = parseFloat(document.getElementById('calc-kwh').value);
        var potencia = parseFloat(document.getElementById('calc-potencia').value);
        var precio   = parseFloat(document.getElementById('calc-precio').value);

        if (!kwh || kwh <= 0)           return mostrarError('Introduce tu consumo mensual en kWh.', 'calc-kwh');
        if (!potencia || potencia <= 0) return mostrarError('Introduce la potencia contratada en kW.', 'calc-potencia');
        if (!precio || precio <= 0)     return mostrarError('Introduce el precio por kWh de tu factura.', 'calc-precio');
        if (!tipoSeleccionado)   return mostrarError('Selecciona Autónomo o Empresa.');
        if (!tejadoSeleccionado) return mostrarError('Indica si tienes tejado disponible.');

        // ── Cálculo real ──────────────────────────────────────────────
        // Coste actual mensual
        var costeEnergia   = kwh * precio;
        var costePotencia  = potencia * PRECIO_POTENCIA_DIA * 30;
        var costeImpuestos = (costeEnergia + costePotencia) * 0.0511; // impuesto eléctrico 5.11%
        var costeAlquiler  = 0.81; // alquiler de contador fijo aprox.
        var costoMensual   = costeEnergia + costePotencia + costeImpuestos + costeAlquiler;
        costoMensual = costoMensual * 1.21; // IVA 21%

        // Porcentaje de ahorro según perfil
        // Solar: reduce término energía ~50-60%, gas: optimiza tarifa ~25-35%
        var pctEnergia = tejadoSeleccionado === 'si' ? 0.58 : 0.30;

        // Empresas negocian mejor tarifa de potencia
        var pctPotencia = tipoSeleccionado === 'empresa' ? 0.15 : 0.08;

        var ahorroEnMes = (costeEnergia * pctEnergia) + (costePotencia * pctPotencia);
        ahorroEnMes = ahorroEnMes * 1.21; // con IVA
        var ahorroAnual = ahorroEnMes * 12;
        var kwhAhorrados = Math.round(kwh * pctEnergia * 12);
        var mesesGratis = (ahorroAnual / costoMensual).toFixed(1);

        document.getElementById('calc-mensual').textContent    = fmt(ahorroEnMes);
        document.getElementById('calc-ahorro-num').textContent = fmt(ahorroAnual);
        document.getElementById('calc-kwh-ahorro').textContent = kwhAhorrados.toLocaleString('es-ES') + ' kWh';
        document.getElementById('calc-meses').textContent      = mesesGratis;

        var resultado = document.getElementById('calc-resultado');
        resultado.style.display = 'block';
        resultado.style.opacity = '0';
        resultado.style.transform = 'translateY(20px)';
        var start = null;
        function animate(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / 500, 1);
            resultado.style.opacity = p;
            resultado.style.transform = 'translateY(' + (20 * (1 - p)) + 'px)';
            if (p < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    });
});

// --------------------------------------------------------------------------
// 8. Hamburger Menu Toggle
// --------------------------------------------------------------------------
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('menu-open');
        const lines = menuToggle.querySelectorAll('.ham-line');
        if (isOpen) {
            lines[0].style.transform = 'translateY(8px) rotate(45deg)';
            lines[1].style.opacity = '0';
            lines[2].style.transform = 'translateY(-8px) rotate(-45deg)';
            lines[2].style.width = '1.5rem';
            lenis.stop();
        } else {
            lines[0].style.transform = '';
            lines[1].style.opacity = '';
            lines[2].style.transform = '';
            lines[2].style.width = '';
            lenis.start();
        }
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('menu-open');
            menuToggle.querySelectorAll('.ham-line').forEach(l => {
                l.style.transform = '';
                l.style.opacity = '';
                l.style.width = '';
            });
            lenis.start();
        });
    });
}

// --------------------------------------------------------------------------
// 9. EmailJS — Automatización de emails
// --------------------------------------------------------------------------
// ⚠️  PASOS PARA ACTIVAR (tarda 5 minutos):
//
//  1. Ve a https://www.emailjs.com → Sign Up gratis
//  2. Dashboard → Email Services → Add New Service → Gmail
//     Conecta tu cuenta Gmail y copia el "Service ID" → reemplaza EMAILJS_SERVICE_ID
//  3. Email Templates → Create New Template
//     PLANTILLA 1 (notificación al dueño):
//       - To email: nahuelmolher024@gmail.com
//       - Subject: "Nuevo lead Optimizare – {{from_name}}"
//       - Body: Nombre: {{from_name}} | Email: {{from_email}} | Tel: {{telefono}} | Tipo: {{tipo_cliente}} | Mensaje: {{mensaje}}
//       - Copia el "Template ID" → reemplaza EMAILJS_TEMPLATE_NOTIF
//  4. Email Templates → Create New Template
//     PLANTILLA 2 (respuesta automática al cliente):
//       - To email: {{to_email}}
//       - Subject: "Recibimos tu solicitud – Optimizare"
//       - Body: Hola {{to_name}}, recibimos tu solicitud y te contactaremos en menos de 24h. – Equipo Optimizare
//       - Copia el "Template ID" → reemplaza EMAILJS_TEMPLATE_AUTOREPLY
//  5. Account → API Keys → copia tu "Public Key" → reemplaza EMAILJS_PUBLIC_KEY
// --------------------------------------------------------------------------

const EMAILJS_PUBLIC_KEY         = 'TU_PUBLIC_KEY_AQUI';       // ← paso 5
const EMAILJS_SERVICE_ID         = 'TU_SERVICE_ID_AQUI';       // ← paso 2
const EMAILJS_TEMPLATE_NOTIF     = 'TU_TEMPLATE_NOTIF_AQUI';   // ← paso 3
const EMAILJS_TEMPLATE_AUTOREPLY = 'TU_TEMPLATE_REPLY_AQUI';   // ← paso 4

// Inicializar EmailJS
if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

// Manejar el formulario de contacto
const contactForm = document.getElementById('contact-form');
const submitBtn   = document.getElementById('form-submit-btn');
const formSuccess = document.getElementById('form-success');
const formError   = document.getElementById('form-error');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nombre   = document.getElementById('nombre').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const email    = document.getElementById('email').value.trim();
        const tipo     = document.getElementById('tipo').value;
        const mensaje  = document.getElementById('mensaje').value.trim();

        // Validación básica
        if (!nombre || !telefono || !email || !tipo) {
            if (formError) {
                formError.style.display = 'block';
                formError.querySelector('p').textContent = 'Por favor completa todos los campos obligatorios.';
                setTimeout(() => { formError.style.display = 'none'; }, 4000);
            }
            return;
        }

        // Estado cargando
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        const templateParams = {
            from_name:    nombre,
            from_email:   email,
            telefono:     telefono,
            tipo_cliente: tipo,
            mensaje:      mensaje || 'Sin mensaje adicional',
            to_name:      nombre,
            to_email:     email,
        };

        // Enviar notificación al dueño + auto-respuesta al cliente en paralelo
        Promise.all([
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_NOTIF,     templateParams),
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_AUTOREPLY, templateParams),
        ])
        .then(() => {
            contactForm.style.display = 'none';
            if (formSuccess) formSuccess.style.display = 'block';
        })
        .catch(() => {
            submitBtn.textContent = 'Quiero mi estudio de ahorro gratuito →';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            if (formError) {
                formError.style.display = 'block';
                setTimeout(() => { formError.style.display = 'none'; }, 5000);
            }
        });
    });
}
