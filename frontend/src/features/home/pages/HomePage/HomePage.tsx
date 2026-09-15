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
      color: 'from-blue-600 to-indigo-600',
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
      color: 'from-indigo-600 to-purple-600',
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
      color: 'from-purple-600 to-pink-600',
    },
  ];

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-indigo-200 border border-white/10 w-fit">
            <Sparkles size={16} className="text-yellow-400" />
            <span>Marketplace Oficial para la Comunidad Académica 2025</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Potencia tu aprendizaje con herramientas de <span className="bg-gradient-to-r from-indigo-300 via-pink-300 to-amber-200 bg-clip-text text-transparent">alto rendimiento</span>
          </h1>

          <p className="text-lg sm:text-xl text-indigo-100/90 leading-relaxed font-normal">
            Centralizamos la mejor oferta de bibliografía especializada, papelería técnica de precisión y hardware formativo para estudiantes, docentes e instituciones.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/products">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-slate-100 font-bold px-8 py-3.5 shadow-lg hover:shadow-xl transition-all">
                Explorar Catálogo Completo
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <a href="#featured-categories" className="text-sm font-semibold text-indigo-200 hover:text-white px-4 py-2 transition-colors">
              Ver Categorías Destacadas ↓
            </a>
          </div>
        </div>
      </section>

      {/* ─── Categorías Destacadas (RF-SHOP-01 / US-SHOP-01) ─── */}
      <section id="featured-categories" className="flex flex-col gap-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Catálogo Vertical</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Categorías Destacadas
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-md text-sm">
            Explora cada categoría equipada con stock garantizado y especificaciones verificadas para planes de estudio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="group relative flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Header visual con imagen */}
                <div className="relative h-52 bg-slate-100 dark:bg-slate-900/60 p-6 flex items-center justify-center overflow-hidden">
                  <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm">
                    <Icon size={14} className="text-indigo-600 dark:text-indigo-400" />
                    {cat.badge}
                  </span>
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="h-40 w-40 object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                {/* Contenido */}
                <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{cat.subtitle}</span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <Link to={cat.url} className="w-full">
                    <Button variant="secondary" fullWidth className="group-hover:bg-indigo-600 group-hover:text-white transition-colors">
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

      {/* ─── Banner Promocional ─── */}
      <section className="rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-xl text-center md:text-left">
          <span className="text-xs font-extrabold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full w-fit mx-auto md:mx-0">
            Promoción Semestral
          </span>
          <h3 className="text-2xl sm:text-3xl font-black">
            20% OFF en Kits de Robótica & Hardware Académico
          </h3>
          <p className="text-amber-100 text-sm sm:text-base">
            Equipa tu laboratorio o inicia tu proyecto de tesis con componentes certificados y stock inmediato.
          </p>
        </div>

        <Link to="/products?categoria=Robotics%20%26%20Hardware" className="shrink-0">
          <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-6 py-3 shadow-md">
            Aprovechar Oferta
          </Button>
        </Link>
      </section>

      {/* ─── Propuesta de Valor (Garantías) ─── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
        <div className="flex items-start gap-4 p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Calidad Académica</h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Catálogo avalado por estándares educativos y programas universitarios.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Truck size={26} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Envíos a Campus</h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Despacho prioritario y seguimiento seguro de todas tus compras.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Award size={26} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Precios Estudiantiles</h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Tarifas preferenciales accesibles pensadas para estudiantes y docentes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
