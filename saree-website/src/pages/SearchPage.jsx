import React, { useState, useRef } from 'react';
import { FaSearch, FaArrowRight, FaFacebook, FaInstagram, FaTwitter, FaMagic } from 'react-icons/fa';
import './SearchPage.css';
import DesignCard from '../components/DesignCard';
import SareeDetailModal from '../components/SareeDetailModal';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

// --- QUICK PROMPT SUGGESTIONS ---
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

// --- MOCK IMAGE ARRAYS (Your exact links preserved) ---
const heroSareeImages = [
  "https://images.unsplash.com/photo-1609748342012-7dfce6fee14f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHNhcmVlJTIwaW1hZ2UlMjBpbiUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
  "https://images.unsplash.com/photo-1736849625286-ab3267b7d508?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fHNhcmVlJTIwaW1hZ2UlMjBpbiUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
  "https://images.unsplash.com/photo-1750008560217-53fd7066acec?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fHNhcmVlJTIwaW1hZ2UlMjBpbiUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
  "https://images.unsplash.com/photo-1711688590009-539d18c9d56f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fHNhcmVlJTIwaW1hZ2UlMjBpbiUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600"
];

const sideGalleryImages = [
  "https://images.unsplash.com/photo-1609748342012-7dfce6fee14f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHNhcmVlJTIwaW1hZ2UlMjBpbiUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
  "https://images.unsplash.com/photo-1736849625286-ab3267b7d508?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fHNhcmVlJTIwaW1hZ2UlMjBpbiUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
  "https://images.unsplash.com/photo-1750008560217-53fd7066acec?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fHNhcmVlJTIwaW1hZ2UlMjBpbiUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
  "https://images.unsplash.com/photo-1711688590009-539d18c9d56f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fHNhcmVlJTIwaW1hZ2UlMjBpbiUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600"
];

// We'll keep this array in case the API fails and we want to show mocks
const mockSareeImages = [
  "https://images.unsplash.com/photo-1610189019555-b1e26c2e424d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njd8fHNhcmVlJTIwaW1hZ2UlMjBpbiUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
  "https://images.unsplash.com/photo-1609748340756-aeb8223d6c64?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzV8fHNhcmVlJTIwaW1hZ2UlMjBpbiUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
  "https://images.unsplash.com/photo-1710967356986-f40445106d24?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAxfHxzYXJlZSUyMGltYWdlJTIwaW4lMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
  "https://images.unsplash.com/photo-1752469145295-3146b95cb544?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTh8fHNhcmVlJTIwaW1hZ2UlMjBpbiUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
];

// --- COMPONENT START ---

function SearchPage({ isLoggedIn, onAddToCart, userId }) {
  // --- STATE ---
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- MODAL STATE ---
  const [modalData, setModalData] = useState(null);

  const handleCardClick = (designData) => {
    setModalData(designData);
  };
  const handleCloseModal = () => {
    setModalData(null);
  };

  // --- REFS ---
  const searchBarRef = useRef(null);
  const descriptionSectionRef = useRef(null);
  const featuresSectionRef = useRef(null); // Added ref for Features section

  // --- API/Search Function (Puter.js — FREE, no API key needed) ---
  const getRandomPrice = () => {
    const min = 2000;
    const max = 6000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleSearch = async () => {
    if (!prompt) return;

    setIsLoading(true);
    setResults([]);
    setError(null);
    console.log("Generating images via Puter.js for:", prompt);

    const NUM_IMAGES = 4;
    const enhancedPrompt = `photorealistic full-body portrait of a beautiful Indian woman model wearing an elegant draped Saree, studio lighting, fashion photography, ${prompt}`;

    if (!window.puter || !window.puter.ai) {
      setError('Puter.js is still loading. Please wait a moment and try again.');
      setIsLoading(false);
      return;
    }

    try {
      // Generate images one at a time to avoid rate limits
      for (let i = 0; i < NUM_IMAGES; i++) {
        try {
          const imgEl = await window.puter.ai.txt2img(enhancedPrompt, { model: 'flux-schnell' });
          const design = {
            id: `${Date.now()}-${i}`,
            imageUrl: imgEl.src,
            price: getRandomPrice()
          };
          // Show each image as it arrives
          setResults(prev => [...prev, design]);
        } catch (singleErr) {
          console.warn(`Image ${i + 1} failed, skipping:`, singleErr);
        }
        // Small delay between requests to avoid rate limiting
        if (i < NUM_IMAGES - 1) {
          await new Promise(r => setTimeout(r, 1500));
        }
      }
      console.log("Image generation complete.");

    } catch (err) {
      console.error("Image generation failed:", err);
      setError(`Failed to generate images. Reason: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Scroll handlers and Animation Hooks ---
  const scrollToSearch = () => { searchBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
  const scrollToDescription = () => { descriptionSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const { ref: heroRef, inView: heroIsVisible } = useInView({ triggerOnce: false, threshold: 0.1 });
  const { ref: gridRef, inView: gridIsVisible } = useInView({ triggerOnce: false, threshold: 0.1 });
  const { ref: descriptionInViewRef, inView: descriptionIsVisible } = useInView({ triggerOnce: false, threshold: 0.1 });
  const { ref: empoweringRef, inView: empoweringIsVisible } = useInView({ triggerOnce: false, threshold: 0.1 });
  const { ref: statsRef, inView: statsIsVisible } = useInView({ triggerOnce: false, threshold: 0.1 });
  const { ref: solutionsRef, inView: solutionsIsVisible } = useInView({ triggerOnce: false, threshold: 0.1 });
  const { ref: galleryRef, inView: galleryIsVisible } = useInView({ triggerOnce: false, threshold: 0.1 });
  const { ref: testimonialRef, inView: testimonialIsVisible } = useInView({ triggerOnce: false, threshold: 0.1 });
  const { ref: finalCtaRef, inView: finalCtaIsVisible } = useInView({ triggerOnce: false, threshold: 0.1 });
  const { ref: aboutRef, inView: aboutIsVisible } = useInView({ triggerOnce: false, threshold: 0.1 });
  const { ref: promptChipsRef, inView: promptChipsIsVisible } = useInView({ triggerOnce: false, threshold: 0.1 });

  // --- Quick prompt handler ---
  const handleQuickPrompt = (quickPrompt) => {
    setPrompt(quickPrompt);
    // Auto-trigger search
    searchBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Small delay so user sees the prompt fill in
    setTimeout(() => {
      document.querySelector('.prompt-button-new')?.click();
    }, 400);
  };

  // --- JSX RENDER ---
  return (
    <div className="search-page-container">

      {/* 1. Hero Section */}
      <div ref={heroRef} className={`hero-section-new fade-in-section ${heroIsVisible ? 'is-visible' : ''}`}>
        <div className="hero-lockup">{/* ... */}</div>
        <h1>Design Your Dream Saree with AI</h1>
        <p className="hero-subtitle-new">
          Use our generative AI to create unique, intricate Saree designs.
          From traditional Paithani to modern digital prints, transform your vision into reality.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={scrollToSearch}>Try It Now</button>
          <button className="btn btn-secondary" onClick={scrollToDescription}>Learn More</button>
        </div>
        <div className="hero-image-gallery">
          <img src={heroSareeImages[0]} alt="Saree 1" className="hero-gallery-img img-1" />
          <img src={heroSareeImages[1]} alt="Saree 2" className="hero-gallery-img img-2" />
          <img src={heroSareeImages[2]} alt="Saree 3" className="hero-gallery-img img-3" />
          <img src={heroSareeImages[3]} alt="Saree 4" className="hero-gallery-img img-4" />
        </div>
      </div>

      {/* 3. Prompt Container */}
      <div className="prompt-container-new" ref={searchBarRef}>
        <div className="prompt-input-wrapper-new">
          <FaSearch className="prompt-icon-new" />
          <input
            type="text"
            className="prompt-input-new"
            placeholder="e.g., 'traditional red and gold Banarasi style', 'modern floral print'..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button className="prompt-button-new" onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {/* 3.5. Quick Prompts Section */}
      <div ref={promptChipsRef} className={`quick-prompts-section fade-in-section ${promptChipsIsVisible ? 'is-visible' : ''}`}>
        <div className="quick-prompts-header">
          <FaMagic className="quick-prompts-icon" />
          <h3>Quick Design Ideas</h3>
          <p>Tap any prompt below to instantly generate stunning saree designs</p>
        </div>
        <div className="quick-prompts-grid">
          {QUICK_PROMPTS.map((qp, index) => (
            <button
              key={index}
              className="quick-prompt-chip"
              onClick={() => handleQuickPrompt(qp.prompt)}
              disabled={isLoading}
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Results Grid */}
      <div ref={gridRef} className={`masonry-grid fade-in-section ${gridIsVisible ? 'is-visible' : ''}`}>
        {isLoading && <p className="loading-message">Generating your designs... (This may take a moment)</p>}
        {error && <p className="error-message">{error}</p>}
        {!isLoading && !error && results.map((design, index) => (
          <DesignCard
            key={design.id}
            imageUrl={design.imageUrl}
            price={design.price}
            isLoggedIn={isLoggedIn}
            onAddToCart={onAddToCart}
            userId={userId}
            onCardClick={handleCardClick}
          />
        ))}
      </div>

      {/* 5. Description Section ("Inspired by Tradition") */}
      <div
        ref={(node) => {
          descriptionSectionRef.current = node;
          descriptionInViewRef(node);
        }}
        className={`description-and-gallery-section fade-in-section ${descriptionIsVisible ? 'is-visible' : ''}`}
        id="features" // Added id for nav link
      >
        <div className="description-content">
          <h2>Inspired by Tradition, Designed by AI</h2>
          <p>
            Welcome to the future of textile design. Our AI analyzes thousands of traditional motifs,
            color palettes, and weaving patterns to generate entirely new Saree designs that
            honor heritage while pushing creative boundaries.
          </p>
          <button className="get-started-button" onClick={scrollToSearch}>Get Started with AI</button>
        </div>
        <div className="side-image-gallery">
          {sideGalleryImages.map((imgSrc, index) => (
            <img key={index} src={imgSrc} alt={`Saree design example ${index + 1}`} className="gallery-image" />
          ))}
        </div>
      </div>

      {/* 6. Empowering Section */}
      <div ref={empoweringRef} className={`empowering-section fade-in-section ${empoweringIsVisible ? 'is-visible' : ''}`}>
        <div className="empowering-image-stack">
          <img src={sideGalleryImages[0]} alt="Saree 1" className="stack-img stack-img-1" />
          <img src={sideGalleryImages[1]} alt="Saree 2" className="stack-img stack-img-2" />
          <img src={sideGalleryImages[2]} alt="Saree 3" className="stack-img stack-img-3" />
        </div>
        <div className="empowering-content">
          <h2>Empowering Weavers and Designers</h2>
          <p>
            Our platform provides powerful AI tools for artisans, designers, and enthusiasts.
            Generate production-ready digital proofs, experiment with endless variations,
            and reduce design time from weeks to minutes.
          </p>
          <h3>From Concept to Loom</h3>
          <p>
            Whether you're exploring complex Banarasi brocades or minimalist Kanjivaram concepts,
            our AI assists at every step. Create, refine, and export.
          </p>
          <ul className="features-list">
            <li>AI Pattern Generation</li>
            <li>Virtual Draping Models</li>
            <li>Color Palette Exploration</li>
          </ul>
          <button className="btn btn-primary" onClick={scrollToSearch}>Try Now</button>
        </div>
      </div>

      {/* 7. Data Stats Section */}
      <div ref={statsRef} className={`data-stats-section fade-in-section ${statsIsVisible ? 'is-visible' : ''}`}>
        <div className="data-stats-header">
          <h2>Data-Driven Saree Design</h2>
          <p>
            Our AI is trained on a vast dataset of heritage textiles, ensuring
            every generated design is unique and culturally informed.
          </p>
        </div>
        <div className="data-stats-grid">
          <div className="stat-item"><h3>2B+</h3><p>Saree Designs Generated</p></div>
          <div className="stat-item"><h3>200K+</h3><p>Supported Artisans</p></div>
          <div className="stat-item"><h3>10M+</h3><p>Unique Motifs Created</p></div>
          <div className="stat-item"><h3>1Note</h3><p>Patterns Analyzed</p></div>
        </div>
      </div>

      {/* 8. AI SOLUTIONS SECTION */}
      <div ref={solutionsRef} className={`ai-solutions-section fade-in-section ${solutionsIsVisible ? 'is-visible' : ''}`}>
        <h2>Our Saree AI Toolkit</h2>
        <p className="section-subtitle">
          Discover our suite of specialized AI tools, built from the ground up
          for textile and ethnic wear design.
        </p>
        <div className="solutions-grid">
          <div className="solution-card">
            <img src={sideGalleryImages[0]} alt="AI Motif Generator" className="solution-card-image" />
            <div className="solution-card-content">
              <h3>AI Motif Generator</h3>
              <p>Create intricate new motifs (buttas, borders, pallus) from a simple text prompt.</p>
              <a href="#" className="solution-link">Learn More <FaArrowRight /></a>
            </div>
          </div>
          <div className="solution-card">
            <img src={sideGalleryImages[1]} alt="Virtual Saree Draper" className="solution-card-image" />
            <div className="solution-card-content">
              <h3>Virtual Saree Draper</h3>
              <p>See your generated design draped on a virtual model in real-time.</p>
              <a href="#" className="solution-link">Learn More <FaArrowRight /></a>
            </div>
          </div>
          <div className="solution-card">
            <img src={sideGalleryImages[2]} alt="AI Colorway Creator" className="solution-card-image" />
            <div className="solution-card-content">
              <h3>AI Colorway Creator</h3>
              <p>Instantly explore dozens of harmonious color combinations for your design.</p>
              <a href="#" className="solution-link">Learn More <FaArrowRight /></a>
            </div>
          </div>
        </div>
      </div>

      {/* 9. GALLERY OF INNOVATION SECTION */}
      <div ref={galleryRef} className={`gallery-of-innovation fade-in-section ${galleryIsVisible ? 'is-visible' : ''}`}>
        <h2>Gallery of Innovation</h2>
        <p className="section-subtitle">A collection of breathtaking Saree designs showcasing the fusion of AI creativity and traditional art.</p>
        <div className="static-gallery-grid">
          <div className="static-gallery-item item-1"><img src={mockSareeImages[0]} alt="Saree Design 1" /></div>
          <div className="static-gallery-item item-2"><img src={mockSareeImages[1]} alt="Saree Design 2" /></div>
          <div className="static-gallery-item item-3"><img src={mockSareeImages[2]} alt="Saree Design 3" /></div>
          <div className="static-gallery-item item-4"><img src={heroSareeImages[0]} alt="Saree Design 4" /></div>
          <div className="static-gallery-item item-5"><img src={heroSareeImages[1]} alt="Saree Design 5" /></div>
          <div className="static-gallery-item item-6"><img src={heroSareeImages[2]} alt="Saree Design 6" /></div>
        </div>
      </div>

      {/* 10. TESTIMONIAL SECTION */}
      <div ref={testimonialRef} className={`testimonial-section fade-in-section ${testimonialIsVisible ? 'is-visible' : ''}`}>
        <p className="testimonial-quote">
          "PyThani's AI helped me break a creative block. I generated a Pallu design
          I never would have thought of, and my weavers are already working on the sample.
          A game-changer for independent designers!"
        </p>
        <div className="testimonial-author">
          <img src="https://i.pravatar.cc/50?img=47" alt="Priya S." />
          <span>Priya S, Designer</span>
        </div>
        <div className="testimonial-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>

      {/* 11. About Us Section */}
      <div id="about" ref={aboutRef} className={`about-us-section fade-in-section ${aboutIsVisible ? 'is-visible' : ''}`}>
        <div className="about-image-gallery">
          {sideGalleryImages.map((imgSrc, index) => (
            <img key={index} src={imgSrc} alt={`PyThani example ${index + 1}`} className="gallery-image" />
          ))}
        </div>
        <div className="about-content">
          <h2>About PyThani</h2>
          <p>
            At PyThani, we believe in the timeless beauty of the Saree. Our name, a blend of
            'Python' (the language of AI) and 'Paithani' (a traditional weave),
            represents our mission: to merge cutting-edge technology with heritage crafts.
          </p>
          <p>
            We empower artisans and designers by providing AI tools that inspire creativity,
            preserve traditional knowledge, and open new possibilities for Saree design.
          </p>
        </div>
      </div>

      {/* 12. FINAL CTA SECTION */}
      <div ref={finalCtaRef} className={`final-cta-section fade-in-section ${finalCtaIsVisible ? 'is-visible' : ''}`}>
        <div className="final-cta-content">
          <h2>Start Designing Your Saree Today</h2>
          <p>
            Ready to create your own masterpiece? Use our AI generator to bring your
            perfect Saree design to life. Sign up for free and start generating.
          </p>
          <button className="btn btn-primary" onClick={scrollToSearch}>Get Started for Free</button>
        </div>
        <div className="final-cta-image">
          <img src="https://images.unsplash.com/photo-1710967357101-843e3a9ac9ee?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTg0fHxzYXJlZSUyMGltYWdlJTIwaW4lMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600" alt="Beautiful Saree" />
        </div>
      </div>

      {/* SAREE DETAIL MODAL */}
      <SareeDetailModal
        isOpen={!!modalData}
        onClose={handleCloseModal}
        imageUrl={modalData?.imageUrl}
        price={modalData?.price}
        isLoggedIn={isLoggedIn}
        onAddToCart={onAddToCart}
      />

    </div>
  );
}

export default SearchPage;