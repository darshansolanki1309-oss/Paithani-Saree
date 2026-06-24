import React, { useState, useRef } from 'react';
import { FaSearch, FaArrowRight, FaMagic } from 'react-icons/fa';
import './SearchPage.css';
import DesignCard from '../components/DesignCard';
import SareeDetailModal from '../components/SareeDetailModal';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// ── Animation Variants ─────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const VP = { once: true, amount: 0.12 };

// ── Data ───────────────────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  { label: '🔴 Red Banarasi Silk', prompt: 'traditional red and gold Banarasi silk saree with intricate zari work' },
  { label: '💛 Golden Kanjivaram', prompt: 'royal golden Kanjivaram silk saree with temple border and rich pallu' },
  { label: '🟢 Emerald Patola', prompt: 'vibrant emerald green Patola saree with geometric double ikat pattern' },
  { label: '🌸 Pink Floral Print', prompt: 'modern pastel pink saree with delicate floral digital print design' },
  { label: '🦚 Peacock Motif', prompt: 'deep teal saree with ornate peacock motif embroidery and gold border' },
  { label: '⚪ White Chikankari', prompt: 'elegant white Lucknowi chikankari saree with intricate hand embroidery' },
  { label: '💜 Purple Paithani', prompt: 'luxurious purple Paithani saree with golden peacock pallu and muniya border' },
  { label: '🌊 Ocean Blue Organza', prompt: 'flowing ocean blue organza saree with silver sequin and pearl work' },
  { label: '🌅 Sunset Ombre', prompt: 'modern sunset ombre saree blending orange to magenta with gold dust finish' },
  { label: '🖤 Black & Gold Tussar', prompt: 'dramatic black Tussar silk saree with bold gold tribal art motifs' },
  { label: '🌿 Olive Chanderi', prompt: 'subtle olive green Chanderi silk saree with delicate butis and sheer texture' },
  { label: '💎 Royal Maroon Velvet', prompt: 'opulent maroon velvet border saree with diamond-shaped kundan work' },
  { label: '🌼 Yellow Bandhani', prompt: 'bright yellow Rajasthani bandhani tie-dye saree with mirror work border' },
  { label: '🔵 Indigo Ajrakh', prompt: 'hand-block printed indigo Ajrakh saree with natural dye geometric patterns' },
  { label: '🩷 Coral Georgette', prompt: 'lightweight coral georgette saree with cascading floral thread embroidery' },
  { label: '✨ Champagne Tissue', prompt: 'shimmering champagne gold tissue saree with delicate lace border and crystals' },
];

const heroSareeImages = [
  'https://images.unsplash.com/photo-1609748342012-7dfce6fee14f?auto=format&fit=crop&q=60&w=600',
  'https://images.unsplash.com/photo-1736849625286-ab3267b7d508?auto=format&fit=crop&q=60&w=600',
  'https://images.unsplash.com/photo-1750008560217-53fd7066acec?auto=format&fit=crop&q=60&w=600',
  'https://images.unsplash.com/photo-1711688590009-539d18c9d56f?auto=format&fit=crop&q=60&w=600',
];

const sideGalleryImages = [
  'https://images.unsplash.com/photo-1609748342012-7dfce6fee14f?auto=format&fit=crop&q=60&w=600',
  'https://images.unsplash.com/photo-1736849625286-ab3267b7d508?auto=format&fit=crop&q=60&w=600',
  'https://images.unsplash.com/photo-1750008560217-53fd7066acec?auto=format&fit=crop&q=60&w=600',
  'https://images.unsplash.com/photo-1711688590009-539d18c9d56f?auto=format&fit=crop&q=60&w=600',
];

const mockSareeImages = [
  'https://images.unsplash.com/photo-1610189019555-b1e26c2e424d?auto=format&fit=crop&q=60&w=600',
  'https://images.unsplash.com/photo-1609748340756-aeb8223d6c64?auto=format&fit=crop&q=60&w=600',
  'https://images.unsplash.com/photo-1710967356986-f40445106d24?auto=format&fit=crop&q=60&w=600',
  'https://images.unsplash.com/photo-1752469145295-3146b95cb544?auto=format&fit=crop&q=60&w=600',
];

// ── Component ──────────────────────────────────────────────────────────────────
function SearchPage({ isLoggedIn, onAddToCart, userId }) {
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalData, setModalData] = useState(null);

  const searchBarRef = useRef(null);

  // Scroll parallax
  const { scrollY } = useScroll();
  const heroGalleryY = useTransform(scrollY, [0, 600], [0, -60]);
  const heroTextY = useTransform(scrollY, [0, 600], [0, -30]);

  const handleCardClick = (data) => setModalData(data);
  const handleCloseModal = () => setModalData(null);
  const scrollToSearch = () => searchBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const getRandomPrice = () => Math.floor(Math.random() * (6000 - 2000 + 1)) + 2000;

  const handleSearch = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setResults([]);
    setError(null);
    const NUM_IMAGES = 4;
    const enhancedPrompt = `photorealistic full-body portrait of a beautiful Indian woman model wearing an elegant draped Saree, studio lighting, fashion photography, ${prompt}`;
    if (!window.puter || !window.puter.ai) {
      setError('Puter.js is still loading. Please wait a moment and try again.');
      setIsLoading(false);
      return;
    }
    try {
      for (let i = 0; i < NUM_IMAGES; i++) {
        try {
          const imgEl = await window.puter.ai.txt2img(enhancedPrompt, { model: 'flux-schnell' });
          setResults(prev => [...prev, { id: `${Date.now()}-${i}`, imageUrl: imgEl.src, price: getRandomPrice() }]);
        } catch (singleErr) {
          console.warn(`Image ${i + 1} failed:`, singleErr);
        }
        if (i < NUM_IMAGES - 1) await new Promise(r => setTimeout(r, 1500));
      }
    } catch (err) {
      setError(`Failed to generate images. Reason: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (quickPrompt) => {
    setPrompt(quickPrompt);
    searchBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => document.querySelector('.prompt-button-new')?.click(), 400);
  };

  return (
    <div className="search-page-container">

      {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
      <section className="hero-section-new">
        {/* Left: text */}
        <motion.div
          className="hero-text-content"
          style={{ y: heroTextY }}
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} className="hero-eyebrow">
            <span className="hero-tag">✦ AI-Powered Design</span>
          </motion.div>
          <motion.h1 variants={fadeUp}>
            Design Your Dream<br /><em>Saree</em> with AI
          </motion.h1>
          <motion.p variants={fadeUp} className="hero-subtitle-new">
            Use generative AI to create unique, intricate Saree designs —
            from traditional Paithani to modern digital prints.
          </motion.p>
          <motion.div variants={fadeUp} className="hero-buttons">
            <motion.button
              className="btn btn-primary"
              onClick={scrollToSearch}
              whileHover={{ scale: 1.04, boxShadow: '0 10px 36px rgba(184, 134, 42, 0.38)' }}
              whileTap={{ scale: 0.97 }}
            >
              Try It Now
            </motion.button>
            <motion.a
              href="#features"
              className="btn btn-secondary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Learn More
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Right: spatial floating images */}
        <motion.div className="hero-image-gallery" style={{ y: heroGalleryY }}>
          <motion.img
            src={heroSareeImages[0]} alt="Saree 1"
            className="hero-gallery-img img-1"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.img
            src={heroSareeImages[1]} alt="Saree 2"
            className="hero-gallery-img img-2"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.img
            src={heroSareeImages[2]} alt="Saree 3"
            className="hero-gallery-img img-3"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.38, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.img
            src={heroSareeImages[3]} alt="Saree 4"
            className="hero-gallery-img img-4"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      </section>

      {/* ── 2. SEARCH BAR ────────────────────────────────────────────────────── */}
      <motion.div
        className="prompt-container-new"
        ref={searchBarRef}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="prompt-input-wrapper-new">
          <FaSearch className="prompt-icon-new" />
          <input
            type="text"
            className="prompt-input-new"
            placeholder="e.g., 'traditional red and gold Banarasi style'…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <motion.button
          className="prompt-button-new"
          onClick={handleSearch}
          disabled={isLoading}
          whileHover={{ scale: 1.03, boxShadow: '0 8px 28px rgba(184, 134, 42, 0.35)' }}
          whileTap={{ scale: 0.97 }}
        >
          {isLoading ? 'Generating…' : 'Generate'}
        </motion.button>
      </motion.div>

      {/* ── 3. QUICK PROMPTS ─────────────────────────────────────────────────── */}
      <motion.div
        className="quick-prompts-section"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
      >
        <motion.div variants={fadeUp} className="quick-prompts-header">
          <FaMagic className="quick-prompts-icon" />
          <h3>Quick Design Ideas</h3>
          <p>Tap any prompt to instantly generate stunning saree designs</p>
        </motion.div>
        <motion.div className="quick-prompts-grid" variants={staggerFast}>
          {QUICK_PROMPTS.map((qp, index) => (
            <motion.button
              key={index}
              className="quick-prompt-chip"
              variants={fadeUp}
              whileHover={{ scale: 1.05, y: -3, boxShadow: '0 8px 24px rgba(184, 134, 42, 0.22)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleQuickPrompt(qp.prompt)}
              disabled={isLoading}
            >
              {qp.label}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* ── 4. RESULTS GRID ──────────────────────────────────────────────────── */}
      <div className="masonry-grid">
        <AnimatePresence>
          {isLoading && (
            <motion.p
              className="loading-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Weaving your designs with AI… this may take a moment ✦
            </motion.p>
          )}
        </AnimatePresence>
        {error && <p className="error-message">{error}</p>}
        {!isLoading && !error && results.map((design, index) => (
          <motion.div
            key={design.id}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <DesignCard
              imageUrl={design.imageUrl}
              price={design.price}
              isLoggedIn={isLoggedIn}
              onAddToCart={onAddToCart}
              userId={userId}
              onCardClick={handleCardClick}
            />
          </motion.div>
        ))}
      </div>

      {/* ── 5. TRADITION SECTION ─────────────────────────────────────────────── */}
      <motion.div
        className="description-and-gallery-section"
        id="features"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
      >
        <motion.div variants={fadeLeft} className="description-content">
          <span className="section-eyebrow">Our Philosophy</span>
          <h2>Inspired by Tradition,<br />Designed by AI</h2>
          <p>
            Our AI analyses thousands of traditional motifs, colour palettes, and weaving
            patterns to generate entirely new Saree designs that honour heritage while
            pushing creative boundaries.
          </p>
          <motion.button
            className="get-started-button"
            onClick={scrollToSearch}
            whileHover={{ scale: 1.03, boxShadow: '0 8px 28px rgba(184, 134, 42, 0.3)' }}
            whileTap={{ scale: 0.97 }}
          >
            Get Started with AI
          </motion.button>
        </motion.div>
        <motion.div variants={fadeRight} className="side-image-gallery">
          {sideGalleryImages.map((src, i) => (
            <motion.img
              key={i} src={src} alt={`Saree ${i + 1}`} className="gallery-image"
              whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(12, 26, 53, 0.18)' }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* ── 6. EMPOWERING ────────────────────────────────────────────────────── */}
      <motion.div
        className="empowering-section"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
      >
        <motion.div variants={fadeLeft} className="empowering-image-stack">
          <img src={sideGalleryImages[0]} alt="Saree 1" className="stack-img stack-img-1" />
          <img src={sideGalleryImages[1]} alt="Saree 2" className="stack-img stack-img-2" />
          <img src={sideGalleryImages[2]} alt="Saree 3" className="stack-img stack-img-3" />
        </motion.div>
        <motion.div variants={fadeRight} className="empowering-content">
          <span className="section-eyebrow">For Artisans</span>
          <h2>Empowering Weavers<br />and Designers</h2>
          <p>
            Our platform provides powerful AI tools for artisans, designers, and enthusiasts.
            Generate production-ready digital proofs, experiment with endless variations,
            and reduce design time from weeks to minutes.
          </p>
          <h3>From Concept to Loom</h3>
          <p>
            Whether exploring complex Banarasi brocades or minimalist Kanjivaram concepts,
            our AI assists at every step.
          </p>
          <ul className="features-list">
            <li>AI Pattern Generation</li>
            <li>Virtual Draping Models</li>
            <li>Colour Palette Exploration</li>
          </ul>
          <motion.button
            className="btn btn-primary"
            onClick={scrollToSearch}
            whileHover={{ scale: 1.03, boxShadow: '0 8px 28px rgba(184, 134, 42, 0.3)' }}
            whileTap={{ scale: 0.97 }}
          >
            Try Now
          </motion.button>
        </motion.div>
      </motion.div>

      {/* ── 7. DATA STATS ────────────────────────────────────────────────────── */}
      <motion.div
        className="data-stats-section"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
      >
        <motion.div variants={fadeUp} className="data-stats-header">
          <span className="section-eyebrow section-eyebrow--light">By the Numbers</span>
          <h2>Data-Driven Saree Design</h2>
          <p>Our AI is trained on a vast dataset of heritage textiles, ensuring every generated design is unique and culturally informed.</p>
        </motion.div>
        <motion.div className="data-stats-grid" variants={staggerFast}>
          {[
            { num: '2B+', label: 'Designs Generated' },
            { num: '200K+', label: 'Supported Artisans' },
            { num: '10M+', label: 'Unique Motifs' },
            { num: '50+', label: 'Weave Traditions' },
          ].map((stat, i) => (
            <motion.div key={i} className="stat-item" variants={fadeUp}>
              <h3>{stat.num}</h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── 8. AI SOLUTIONS ──────────────────────────────────────────────────── */}
      <motion.div
        className="ai-solutions-section"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
      >
        <motion.div variants={fadeUp}>
          <span className="section-eyebrow">What We Offer</span>
          <h2>Our Saree AI Toolkit</h2>
          <p className="section-subtitle">
            A suite of specialised AI tools built from the ground up for textile and ethnic wear design.
          </p>
        </motion.div>
        <motion.div className="solutions-grid" variants={staggerFast}>
          {[
            { img: sideGalleryImages[0], title: 'AI Motif Generator', desc: 'Create intricate new motifs — buttas, borders, pallus — from a simple text prompt.' },
            { img: sideGalleryImages[1], title: 'Virtual Saree Draper', desc: 'See your generated design draped on a virtual model in real-time.' },
            { img: sideGalleryImages[2], title: 'AI Colorway Creator', desc: 'Instantly explore dozens of harmonious colour combinations for your design.' },
          ].map((card, i) => (
            <motion.div
              key={i} className="solution-card" variants={fadeUp}
              whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(12, 26, 53, 0.14)' }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            >
              <img src={card.img} alt={card.title} className="solution-card-image" />
              <div className="solution-card-content">
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                <a href="#" className="solution-link">Learn More <FaArrowRight /></a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── 9. GALLERY ───────────────────────────────────────────────────────── */}
      <motion.div
        className="gallery-of-innovation"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
      >
        <motion.div variants={fadeUp}>
          <span className="section-eyebrow">Our Gallery</span>
          <h2>Gallery of Innovation</h2>
          <p className="section-subtitle">
            Breathtaking Saree designs showcasing the fusion of AI creativity and traditional art.
          </p>
        </motion.div>
        <motion.div className="static-gallery-grid" variants={staggerFast}>
          {[...mockSareeImages.slice(0, 3), ...heroSareeImages.slice(0, 3)].map((src, i) => (
            <motion.div
              key={i} className={`static-gallery-item item-${i + 1}`} variants={fadeUp}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            >
              <img src={src} alt={`Gallery ${i + 1}`} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── 10. TESTIMONIAL ──────────────────────────────────────────────────── */}
      <motion.div
        className="testimonial-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="testimonial-quote-mark">&ldquo;</div>
        <p className="testimonial-quote">
          PyThani's AI helped me break a creative block. I generated a Pallu design
          I never would have thought of, and my weavers are already working on the sample.
          A game-changer for independent designers.
        </p>
        <div className="testimonial-author">
          <div>
            <span className="author-name">Meera Krishnamurthy</span>
            <span className="author-title">Independent Saree Designer, Chennai</span>
          </div>
        </div>
        <div className="testimonial-dots">
          <div className="dot active" />
          <div className="dot" />
          <div className="dot" />
        </div>
      </motion.div>

      {/* ── 11. ABOUT ──────────────────────────────────────────────────────── */}
      <motion.div
        className="about-us-section"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
      >
        <motion.div className="about-image-gallery" variants={fadeLeft}>
          {heroSareeImages.slice(0, 4).map((img, i) => (
            <img key={i} src={img} alt="Saree" className="gallery-image" loading="lazy" />
          ))}
        </motion.div>
        <motion.div className="about-content" variants={fadeRight}>
          <span className="section-eyebrow">About pAIThani</span>
          <h2>Weaving Heritage with Intelligence</h2>
          <p>
            pAIThani was born from a simple question: what if AI could learn the grammar
            of Paithani weaving — its motifs, its colours, its centuries of meaning — and
            help designers speak it fluently?
          </p>
          <p>
            Our platform trains on thousands of authenticated Paithani textiles,
            preserving the tradition while empowering a new generation of creators.
          </p>
          <motion.button
            className="get-started-button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById('prompt-input')?.focus()}
          >
            Start Creating →
          </motion.button>
        </motion.div>
      </motion.div>

      {/* ── 12. FINAL CTA ──────────────────────────────────────────────────── */}
      <motion.div
        className="final-cta-section"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
      >
        <motion.div className="final-cta-content" variants={fadeLeft}>
          <span className="section-eyebrow section-eyebrow--light">Get Started Today</span>
          <h2>Ready to Design Your Masterpiece?</h2>
          <p>
            Join artisans and designers using pAIThani to create
            stunning Paithani designs that honour tradition and embrace the future.
          </p>
          <motion.button
            className="btn-cta-gold"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById('prompt-input')?.focus()}
          >
            Generate Your First Design ✦
          </motion.button>
        </motion.div>
        <motion.div className="final-cta-image" variants={fadeRight}>
          <img
            src={heroSareeImages[0] || mockSareeImages[0]}
            alt="Paithani saree"
          />
        </motion.div>
      </motion.div>

    </div>
  );
}

export default SearchPage;
