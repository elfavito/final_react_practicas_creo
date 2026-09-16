import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Cpu, Wrench, ArrowRight, ShieldCheck, Truck, Award, Sparkles } from 'lucide-react';
import { Button } from '../../../../components/ui/Button/Button';

export const HomePage: React.FC = () => {
  const categories = [
    {
      id: 'study-materials',
      title: 'Study Materials',
      subtitle: 'Bibliografía técnica & Papelería',
      description: 'Cuadernos de alto gramaje, textos universitarios de física/cálculo e instrumentos de dibujo milimetrado.',
      image: '/images/11.webp',
      badge: 'Esenciales',
      url: '/products?categoria=Study%20Materials',
      icon: BookOpen,
    },
    {
      id: 'tech-tools',
      title: 'Tech Tools',
      subtitle: 'Tablets, Calculadoras & Gadgets',
      description: 'Calculadoras científicas de 552 funciones, stylus pens de precisión y microscopios de inspección digital.',
      image: '/images/1.webp',
      badge: 'Más Populares',
      url: '/products?categoria=Tech%20Tools',
      icon: Cpu,
    },
    {
      id: 'robotics-hardware',
      title: 'Robotics & Hardware',
      subtitle: 'Kits STEAM & Sensores IoT',
      description: 'Placas de desarrollo ESP32, kits de robótica educativa programables en Python y brazos 4-DOF.',
      image: '/images/3.webp',
      badge: 'STEAM Ready',
      url: '/products?categoria=Robotics%20%26%20Hardware',
      icon: Wrench,
    },
  ];

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* ─── Hero Section (Centrado) ─── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-950 text-white p-8 sm:p-14 lg:p-20 shadow-2xl border border-indigo-800/40 flex flex-col items-center justify-center text-center">
        <div className="absolute top-0 right-1/4 -mt-16 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 -mb-16 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        <div
          className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-6"
          style={{ margin: '0 auto', textAlign: 'center' }}
        >
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-indigo-200 border border-indigo-400/30 shadow-sm">
            <Sparkles size={16} className="text-amber-400" />
            <span>Marketplace Oficial para la Comunidad Académica 2025</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-center">
            Potencia tu aprendizaje con herramientas de{' '}
            <span className="bg-gradient-to-r from-indigo-300 via-pink-300 to-amber-200 bg-clip-text text-transparent">
              alto rendimiento
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-indigo-100/90 leading-relaxed font-normal max-w-2xl mx-auto text-center">
            Centralizamos la mejor oferta de bibliografía especializada, papelería técnica de precisión y hardware formativo para estudiantes, docentes e instituciones.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {/* Botón con contraste perfecto garantizado con estilo explícito */}
            <Link
              to="/products"
              style={{ backgroundColor: '#ffffff', color: '#090d16' }}
              className="inline-flex items-center justify-center font-black px-8 py-3.5 rounded-xl shadow-xl hover:bg-slate-100 transition-all text-base no-underline hover:scale-105 active:scale-95"
            >
              <span style={{ color: '#090d16', fontWeight: 900 }}>Explorar Catálogo Completo</span>
              <ArrowRight size={18} style={{ color: '#090d16', marginLeft: '0.5rem' }} />
            </Link>

            <a
              href="#featured-categories"
              className="inline-flex items-center justify-center text-sm font-bold text-indigo-200 hover:text-white px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 transition-all"
            >
              Ver Categorías Destacadas ↓
            </a>
          </div>
        </div>
      </section>

      {/* ─── Categorías Destacadas (Títulos Centrados) ─── */}
      <section id="featured-categories" className="flex flex-col gap-10 scroll-mt-24">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto gap-2" style={{ margin: '0 auto', textAlign: 'center' }}>
          <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
            Catálogo Vertical
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1 text-center">
            Categorías Destacadas
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base text-center leading-relaxed">
            Explora cada categoría equipada con stock garantizado y especificaciones verificadas para planes de estudio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="group relative flex flex-col bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Header visual con imagen */}
                <div className="relative h-56 bg-slate-100 dark:bg-slate-900/60 p-6 flex items-center justify-center overflow-hidden">
                  <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200/50 dark:border-slate-700">
                    <Icon size={14} className="text-indigo-600 dark:text-indigo-400" />
                    {cat.badge}
                  </span>
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="h-44 w-44 object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                {/* Contenido */}
                <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{cat.subtitle}</span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <Link to={cat.url} className="w-full">
                    <Button variant="secondary" fullWidth className="group-hover:bg-indigo-600 group-hover:text-white transition-colors font-bold">
                      Ver {cat.title}
                      <ArrowRight size={16} className="ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Banner Promocional (Centrado) ─── */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-8 sm:p-12 text-white shadow-xl flex flex-col items-center text-center gap-6">
        <div className="flex flex-col items-center gap-3 max-w-2xl mx-auto text-center">
          <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3.5 py-1 rounded-full border border-white/20">
            Promoción Semestral
          </span>
          <h3 className="text-2xl sm:text-4xl font-black text-center leading-tight">
            20% OFF en Kits de Robótica & Hardware Académico
          </h3>
          <p className="text-amber-100 text-sm sm:text-base text-center leading-relaxed">
            Equipa tu laboratorio o inicia tu proyecto de tesis con componentes certificados y stock inmediato.
          </p>
        </div>

        <Link to="/products?categoria=Robotics%20%26%20Hardware">
          <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-black px-8 py-3.5 shadow-lg hover:shadow-xl text-base">
            Aprovechar Oferta
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </Link>
      </section>

      {/* ─── Propuesta de Valor (Centrada) ─── */}
      <section className="flex flex-col gap-8 pt-2">
        <div className="flex flex-col items-center text-center max-w-xl mx-auto gap-2">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 px-3.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
            Garantía Académica
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white text-center">
            ¿Por qué elegir EduCart?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base text-center">
            Diseñado exclusivamente para responder a las exigencias de la comunidad educativa
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex items-start gap-4 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 dark:text-white text-base">Calidad Académica</h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Catálogo avalado por estándares educativos y programas universitarios.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
            <Truck size={26} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 dark:text-white text-base">Envíos a Campus</h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Despacho prioritario y seguimiento seguro de todas tus compras.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
            <Award size={26} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 dark:text-white text-base">Precios Estudiantiles</h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Tarifas preferenciales accesibles pensadas para estudiantes y docentes.
            </p>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
};
