"use client";
import { useEffect, useRef, useState } from "react";
import { MoveRight } from "lucide-react";

// --- Partner Logo Data ---
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

// Row 2: Double the list for a shorter Left-to-Right (LTR) scroll
const partnersRow2 = [
  ...corePartners.map((p) => ({ ...p, name: p.name + " (A)" })),
  ...corePartners.map((p) => ({ ...p, name: p.name + " (B)" })),
];

// Helper to load external scripts dynamically
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => {
      console.error(`Failed to load script: ${src}`);
      resolve();
    };
    document.head.appendChild(script);
  });
};

interface Partner {
  name: string;
  logoUrl: string;
  color: string;
}

const ToMembers = () => {
  const scrollSectionRef = useRef<HTMLElement>(null);
  const wideContainerRef2 = useRef<HTMLDivElement>(null); // LTR Marquee
  const [isGsapReady, setIsGsapReady] = useState(false);

  useEffect(() => {
    // 1. Load GSAP and ScrollTrigger via CDN
    if (typeof (window as any).gsap === "undefined") {
      Promise.all([
        loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
        ),
        loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"
        ),
      ]).then(() => {
        const gsap = (window as any).gsap;
        const ScrollTrigger = (window as any).ScrollTrigger;
        if (gsap && ScrollTrigger) {
          gsap.registerPlugin(ScrollTrigger);
          setIsGsapReady(true);
        }
      });
    } else {
      const gsap = (window as any).gsap;
      const ScrollTrigger = (window as any).ScrollTrigger;
      if (gsap && ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        setIsGsapReady(true);
      }
    }

    // 2. Animation logic runs when GSAP is confirmed ready
    if (isGsapReady && wideContainerRef2.current && scrollSectionRef.current) {
      const gsap = (window as any).gsap;
      const ScrollTrigger = (window as any).ScrollTrigger;

      const wideContainer2 = wideContainerRef2.current;

      const calculateAndAnimate = () => {
        if (!wideContainer2) return;

        // Kill any existing ScrollTrigger instances before creating new ones
        ScrollTrigger.getById("partnerScroll")?.kill();

        const cardElements2 = Array.from(
          wideContainer2.children
        ) as HTMLElement[];
        const allCardElements = [...cardElements2];

        // Recalculate dimensions for horizontal scroll
        const totalWidth2 = wideContainer2.scrollWidth;
        const viewportWidth = wideContainer2.offsetWidth;
        const scrollDistance2 = totalWidth2 - viewportWidth;

        // 1. Initial State Setup
        // Card elements (from both rows)
        allCardElements.forEach((card, index: number) => {
          // Apply alternating vertical offset
          const startY = index % 2 === 0 ? 80 : -80;
          gsap.set(card, { opacity: 0, scale: 0.95, y: startY });
        });
        // Container 2 needs to be initialized far left for the LTR scroll
        gsap.set(wideContainer2, { x: -scrollDistance2 });
        // Header content
        gsap.set(scrollSectionRef.current?.children[0], { opacity: 0, y: -20 });

        // 2. Create the Master Scroll Timeline (Pinning remains the main effect)
        const scrollTimeline = gsap.timeline({
          scrollTrigger: {
            id: "partnerScroll",
            trigger: scrollSectionRef.current,
            pin: true,
            start: "top top",
            end: "+=3500", // Long scroll duration
            scrub: 0.5, // Very smooth lag
          },
        });

        // --- PHASE 1: Header Entry ---
        scrollTimeline.to(
          scrollSectionRef.current?.children[0],
          { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" },
          0
        );

        // --- PHASE 2: Combined Vertical Entry & Continuous X/Y Flow ---
        const combinedStartTime = 0.5; // Start both V and H motion simultaneously

        // A. Cards smoothly move from initial y to y: 0 (resting place)
        allCardElements.forEach((card, index: number) => {
          // The vertical entry is given a short duration and smooth ease
          scrollTimeline.to(
            card,
            {
              y: 0, // Moves to the center line
              opacity: 1,
              scale: 1,
              duration: 1.0,
              ease: "power2.out",
            },
            combinedStartTime + index * 0.03
          ); // Staggered start
        });

        const horizontalStartTime = 1.5; // Start the main horizontal and parallax flow after the initial entry

        // C. ROW 2: Left-to-Right (LTR) movement (x: negative to 0)
        scrollTimeline.to(
          wideContainer2,
          {
            x: 0,
            ease: "none",
            duration: 10,
          },
          horizontalStartTime
        );

        // D. Continuous Y Parallax on ALL Cards (The COMBINED X/Y effect)
        allCardElements.forEach((card, index: number) => {
          const isOdd = index % 2 !== 0;
          // Apply a subtle, opposite Y shift that runs for the duration of the horizontal scroll
          scrollTimeline.to(
            card,
            {
              y: isOdd ? 15 : -15, // Subtle float: up 15px or down 15px
              ease: "none", // Linear motion linked to scroll
              duration: 10, // Same duration as the X movement
            },
            horizontalStartTime
          );
        });
      };

      // Run calculation on initial load and again on window resize
      calculateAndAnimate();
      window.addEventListener("resize", calculateAndAnimate);

      // --- Cleanup ---
      return () => {
        window.removeEventListener("resize", calculateAndAnimate);
        ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
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
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full z-20 pointer-events-none p-8 md:p-16">
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

      {/* Scrollable Content Container */}
      <div className="flex flex-col justify-center h-full absolute w-full top-0 left-0">
        {/* ROW 2: Left-to-Right Marquee (Bottom Row) */}
        <div
          ref={wideContainerRef2}
          className="flex h-40 items-center py-4 will-change-transform mt-5vh]"
          style={{ width: "max-content" }} // Mandatory to enable horizontal scroll
        >
          {partnersRow2.map((partner: Partner, index: number) => (
            <div
              key={`row2-${index}`}
              className={`w-72 h-40 flex-shrink-0 mx-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border-2 border-transparent hover:border-blue-500/50 flex flex-col justify-center items-center`}
            >
              <img
                src={partner.logoUrl}
                alt={`${partner.name} Logo`}
                className="w-full h-12 object-contain mb-3"
                onError={(e) => {
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
      </div>
    </section>
  );
};

export default ToMembers;
