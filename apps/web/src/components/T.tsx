"use client";
import { useEffect, useRef, useState } from "react";
// We must avoid direct 'import "gsap"' as the environment failed to resolve it.
// We will rely on window.gsap being available after the CDN script loads.
import { MoveRight } from "lucide-react";

// Register GSAP plugins (We must ensure it's registered only after GSAP loads)
// We will handle registration inside the useEffect after checking window.gsap

// --- Partner Logo Data ---
// 1. Define the core list separately to avoid the 'partners is not iterable' error
const corePartners = [
  {
    name: "Ethio Telecom",
    logoUrl: "https://placehold.co/150x75/00AEEF/ffffff?text=Ethio+Telecom",
    color: "text-blue-600",
  },
  {
    name: "EDB",
    logoUrl: "https://placehold.co/150x75/007A33/ffffff?text=EDB",
    color: "text-green-700",
  },
  {
    name: "Safari Code",
    logoUrl: "https://placehold.co/150x75/FF7F00/ffffff?text=Safari+Code",
    color: "text-orange-500",
  },
  {
    name: "Ethiopian Airlines",
    logoUrl: "https://placehold.co/150x75/E62739/ffffff?text=Eth+Airlines",
    color: "text-red-600",
  },
  {
    name: "Dashen Bank",
    logoUrl: "https://placehold.co/150x75/FFD700/000000?text=Dashen+Bank",
    color: "text-yellow-500",
  },
  {
    name: "Awash Bank",
    logoUrl: "https://placehold.co/150x75/1E90FF/ffffff?text=Awash+Bank",
    color: "text-blue-500",
  },
];

// 2. Build the final array by spreading the core list and its duplicates
const partners = [
  ...corePartners,
  // Duplicate the list for a longer, more impactful horizontal scroll
  ...corePartners.map((p) => ({ ...p, name: p.name + " (2)" })),
  ...corePartners.map((p) => ({ ...p, name: p.name + " (3)" })),
];

// Helper to load external scripts dynamically
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => {
      console.error(`Failed to load script: ${src}`);
      resolve(); // Resolve anyway so execution doesn't halt
    };
    document.head.appendChild(script);
  });
};

const ToMembers = () => {
  const scrollSectionRef = useRef<HTMLElement>(null);
  const wideContainerRef = useRef<HTMLDivElement>(null);
  const [isGsapReady, setIsGsapReady] = useState(false);

  useEffect(() => {
    // 1. Load GSAP and ScrollTrigger via CDN if not already present
    if (typeof (window as any).gsap === "undefined") {
      Promise.all([
        loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
        ),
        loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"
        ),
      ]).then(() => {
        // Scripts are loaded, now register and set ready state
        const gsap = (window as any).gsap;
        const ScrollTrigger = (window as any).ScrollTrigger;
        if (gsap && ScrollTrigger) {
          gsap.registerPlugin(ScrollTrigger);
          setIsGsapReady(true);
        }
      });
    } else {
      // GSAP is already loaded, just register and set ready state
      const gsap = (window as any).gsap;
      const ScrollTrigger = (window as any).ScrollTrigger;
      if (gsap && ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        setIsGsapReady(true);
      }
    }

    // 2. Animation logic runs when GSAP is confirmed ready
    if (isGsapReady && wideContainerRef.current && scrollSectionRef.current) {
      const gsap = (window as any).gsap;
      const ScrollTrigger = (window as any).ScrollTrigger;

      const wideContainer = wideContainerRef.current;

      // Calculate the required horizontal scroll distance.
      // We need requestAnimationFrame to ensure the scrollWidth is calculated after initial render
      const calculateAndAnimate = () => {
        if (!wideContainer) return;

        // Kill any existing ScrollTrigger instances before recalculating/creating new ones
        ScrollTrigger.getById("partnerScroll")?.kill();

        // Recalculate dimensions
        const totalWidth = wideContainer.scrollWidth;
        const viewportWidth = wideContainer.offsetWidth;
        const scrollDistance = totalWidth - viewportWidth;

        // Create the horizontal scroll animation.
        gsap.to(wideContainer, {
          x: -scrollDistance, // Animate the X position left by the required distance
          ease: "none", // Keep it linear for a smooth scrubbing effect

          scrollTrigger: {
            id: "partnerScroll",
            trigger: scrollSectionRef.current,
            pin: true, // PIN the entire section
            start: "top top", // Start the pin when the section hits the top
            end: "+=3000", // The animation lasts for 3000px of vertical scroll
            scrub: 0.5, // SMOOTH: Links vertical scroll to horizontal movement with a slight lag
          },
        });
      };

      // Run calculation on initial load and again on window resize
      calculateAndAnimate();
      window.addEventListener("resize", calculateAndAnimate);

      // --- Cleanup ---
      return () => {
        window.removeEventListener("resize", calculateAndAnimate);
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }
  }, [isGsapReady]); // Re-run effect when GSAP is ready

  return (
    // The main section is the scroll trigger and pin target
    <section
      ref={scrollSectionRef}
      className="bg-gray-50 dark:bg-gray-900 overflow-hidden relative"
      // min-h-[100vh] ensures the section is tall enough to hit 'top top'
      style={{ minHeight: "100vh" }}
    >
      {/* Fixed Content (Title and Description) */}
      <div className="absolute top-1/4 left-0 w-full z-20 pointer-events-none p-8 md:p-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 dark:from-yellow-400 dark:to-gold">
            Our Members & Partners
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl flex items-center">
            Trusted by the best institutions in Ethiopia and globally. Scroll
            down to see.
            <MoveRight className="w-6 h-6 ml-3 animate-pulse" />
          </p>
        </div>
      </div>

      {/* Content Container - This moves horizontally */}
      {/* We use flex and w-[max-content] to force all items onto a single, wide row */}
      <div
        ref={wideContainerRef}
        className="flex h-full items-center py-48 will-change-transform"
        style={{ width: "max-content" }} // Mandatory to enable horizontal scroll
      >
        {partners.map((partner, index) => (
          <div
            key={index}
            className={`w-72 h-40 flex-shrink-0 mx-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border-2 border-transparent hover:border-blue-500/50 flex flex-col justify-center items-center`}
          >
            <img
              src={partner.logoUrl}
              alt={`${partner.name} Logo`}
              className="w-full h-12 object-contain mb-3"
              onError={(e) => {
                // Fallback for placeholder images
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src =
                  "https://placehold.co/150x75/CCCCCC/000000?text=Logo";
              }}
            />
            <p className={`text-sm font-semibold mt-2 ${partner.color}`}>
              {partner.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ToMembers;
