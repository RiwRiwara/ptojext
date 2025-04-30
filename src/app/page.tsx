"use client";

import BaseLayout from "@/components/layout/BaseLayout";
import LandingPageComponent from "@/components/page_components/landing_page/LandingPageComponent";
import Section1 from "@/components/page_components/landing_page/Section1";
import { Card } from "@heroui/card";
import { Spinner } from "@nextui-org/spinner";
import { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Animated particles background effect
const ParticleBackground = () => {
  useEffect(() => {
    const particles: Particle[] = [];
    const colors = ['#4CC9F0', '#4361EE', '#3A0CA3', '#7209B7', '#F72585'];
    const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 2;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Define the Particle class first before using it
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.01;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
    }

    const init = () => {
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Create connections between particles that are close
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = particles[i].color;
            ctx.lineWidth = 0.2;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.closePath();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas id="particle-canvas" className="fixed inset-0 -z-10 opacity-60" />;
};

// Reveal section animation
const RevealSection = ({ children }: { children: React.ReactNode }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// Loading progress animation with SEO-friendly content
const LoadingProgress = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Loading AI Interactive Playground...');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress(prev => {
          const increment = Math.floor(Math.random() * 15) + 5;
          const newProgress = Math.min(prev + increment, 100);

          // Update loading text with SEO-optimized phrases
          if (newProgress > 85) setLoadingText('Finalizing Web Application...');
          else if (newProgress > 60) setLoadingText('Initializing Interactive Physics Simulations...');
          else if (newProgress > 30) setLoadingText('Loading ...');
          else setLoadingText('Almost ready...');

          return newProgress;
        });
      }
    }, 20);

    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="w-full max-w-xs">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        />
      </div>
      <div className="flex justify-between items-center mt-2">
        <p className="text-sm text-gray-600 font-medium">{loadingText}</p>
        <p className="text-xs font-semibold text-gray-500">{`${progress}%`}</p>
      </div>
    </div>
  );
};

// Note: All metadata is defined in layout.tsx (not here) since components with 'use client' can't export metadata

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Suspense fallback={
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md z-50">
        <Card className="p-8 shadow-lg flex flex-col items-center gap-6 bg-content1/90 border-0">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <Spinner
              size="lg"
              color="primary"
              className="h-10 w-10"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center"
          >
            <p className="text-lg font-medium mb-4">Preparing your experience...</p>
            <LoadingProgress />
          </motion.div>
        </Card>
      </div>}>
      <AnimatePresence mode="wait">

        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <ParticleBackground />
          <motion.div
            className="fixed inset-0 bg-gradient-to-b from-transparent to-white/30 pointer-events-none -z-10"
            animate={{
              background: [
                'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3))',
                'linear-gradient(to bottom, transparent, rgba(235,245,255,0.3))',
                'linear-gradient(to bottom, transparent, rgba(245,235,255,0.3))',
                'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3))'
              ]
            }}
            transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.div
            className="fixed inset-0 opacity-30 pointer-events-none -z-5"
            style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0, rgba(99, 102, 241, 0) 70%)'
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          />
          <BaseLayout>
            <Section1 />
            <motion.div
              className="absolute top-6 right-6 z-30 flex items-center gap-2 px-3 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm text-sm text-gray-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 0.5 }}
              aria-live="polite"
              role="status"
            >
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></span>
              <span>Interactive Algorithms Demo Ready</span>
            </motion.div>
            <RevealSection>
              <LandingPageComponent />
            </RevealSection>
          </BaseLayout>
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
}
