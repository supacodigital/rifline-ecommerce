import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MoveRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import ProductCard from "../components/ui/ProductCard";
import s from "./Home.module.css";

const SLIDE_KEYS = [
  { img: "/hero1.webp", eyebrowKey: "home.eyebrow1", titleKey: "home.title1" },
  { img: "/hero2.png",  eyebrowKey: "home.eyebrow2", titleKey: "home.title2" },
  { img: "/hero3.png",  eyebrowKey: "home.eyebrow3", titleKey: "home.title3" },
];

export default function Home() {
  const { t } = useTranslation();
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    api.get("/products?limit=8")
      .then((res) => setProducts(res.data.products || []))
      .catch(() => {});
    api.get("/categories")
      .then((res) => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  // Avance automatique toutes les 5 secondes
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % SLIDE_KEYS.length);
        setTransitioning(false);
      }, 450);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  function goTo(index) {
    if (transitioning) return;
    clearInterval(timerRef.current);
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setTransitioning(false);
    }, 450);
    timerRef.current = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % SLIDE_KEYS.length);
        setTransitioning(false);
      }, 450);
    }, 5000);
  }

  function handleNewsletter(e) {
    e.preventDefault();
    setEmail("");
    setNewsletterDone(true);
  }

  const slide = SLIDE_KEYS[current];

  return (
    <>
      {/* ===== HERO ===== */}
      <section className={s.hero}>
        {/* Images slider */}
        {SLIDE_KEYS.map((sl, i) => (
          <div
            key={i}
            className={`${s.heroImg} ${i === current ? s.heroImgActive : ""}`}
            style={{ backgroundImage: `url(${sl.img})` }}
          />
        ))}

        {/* Overlays */}
        <div className={s.heroOverlay} />
        <div className={s.heroGrid} />

        <div
          className={`${s.heroContent} ${
            transitioning ? s.heroContentOut : s.heroContentIn
          }`}
        >
          <p className={s.heroEyebrow}>{t(slide.eyebrowKey)}</p>
          <h1 className={s.heroTitle}>{t(slide.titleKey)}</h1>

          <div className={s.heroMeta}>
            <Link to="/catalogue" className="btn-primary">
              {t('home.discover')} <ArrowRight size={14} />
            </Link>
            <Link to="/catalogue?cat=parfums" className="btn-ghost">
              {t('home.ourPerfumes')} <MoveRight size={14} />
            </Link>
          </div>
        </div>

        {/* Indicateurs de slide */}
        <div className={s.sliderDots}>
          {SLIDE_KEYS.map((_, i) => (
            <button
              key={i}
              className={`${s.dot} ${i === current ? s.dotActive : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Numérotation */}
        <div className={s.sliderCounter}>
          <span className={s.counterCurrent}>0{current + 1}</span>
          <span className={s.counterSep} />
          <span className={s.counterTotal}>0{SLIDE_KEYS.length}</span>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className={s.categories}>
        <div className="container">
          <div className={s.sectionHeader}>
            <div>
              <p className="section-label">{t('home.universes')}</p>
              <h2 className="section-title">{t('home.ourCollections')}</h2>
            </div>
            <Link to="/catalogue" className="btn-ghost">
              {t('home.seeAll')} <MoveRight size={14} />
            </Link>
          </div>

          <div className={s.categoriesGrid}>
            {categories.slice(0, 4).map((cat, i) => (
              <Link
                key={cat.id}
                to={`/catalogue?cat=${cat.id}`}
                className={s.catCard}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {cat.image_url
                  ? <div className={s.catBg} style={{ backgroundImage: `url(${cat.image_url})` }} />
                  : <div className={`${s.catBg} ${s[cat.slug] || ''}`} />
                }
                <div className={s.catPattern} />
                <div className={s.catOverlay} />
                <div className={s.catInfo}>
                  <p className={s.catLabel}>{cat.name_fr}</p>
                  <h3 className={s.catName}>{cat.name_fr}</h3>
                  <span className={s.catArrow}>
                    {t('home.explore')} <MoveRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUITS VEDETTES ===== */}
      {products.length > 0 && (
        <section className={s.featured}>
          <div className="container">
            <div className={s.sectionHeader}>
              <div>
                <p className="section-label">{t('home.selection')}</p>
                <h2 className="section-title">{t('home.newProducts')}</h2>
              </div>
              <Link to="/catalogue" className="btn-ghost">
                {t('home.seeAll')} <MoveRight size={14} />
              </Link>
            </div>

            <div className={s.productsGrid}>
              {products.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== SECTION ÉDITORIALE ===== */}
      <section className={s.editorial}>
        <div className={s.editorialInner}>
          <div className={s.editorialVisual}>
            <div className={s.editorialPattern} />
            <span className={s.editorialGlyph}>ر</span>
          </div>
          <div className={s.editorialText}>
            <p className="section-label">{t('home.philosophy')}</p>
            <blockquote>{t('home.quote')}</blockquote>
            <cite>{t('home.quoteAuthor')}</cite>
            <div style={{ marginTop: "var(--space-8)" }}>
              <Link to="/catalogue" className="btn-outline">
                {t('home.discoverStory')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className={s.newsletter}>
        <div className="container">
          <h2 className={s.newsletterTitle}>{t('home.newsletter')}</h2>
          <p className={s.newsletterSub}>{t('home.newsletterSub')}</p>
          {newsletterDone ? (
            <p className={s.newsletterSuccess}>{t('home.newsletterSuccess')}</p>
          ) : (
            <form className={s.newsletterForm} onSubmit={handleNewsletter}>
              <input
                type="email"
                className={s.newsletterInput}
                placeholder={t('home.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary">
                {t('home.subscribe')}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
