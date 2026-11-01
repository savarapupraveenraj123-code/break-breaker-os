import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { PointerEvent } from 'react';

export default function BikeShowcase() {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-11, 11]), { stiffness: 90, damping: 18 });
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [7, -7]), { stiffness: 90, damping: 18 });

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  const reset = () => { pointerX.set(0); pointerY.set(0); };

  return (
    <section className="bike-showcase" onPointerMove={handleMove} onPointerLeave={reset} aria-label="Motorcycle showcase">
      <div className="bike-showcase-grain" />
      <div className="bike-showcase-copy">
        <span className="bike-showcase-kicker"><i /> BUILT FOR THE OPEN ROAD</span>
        <h2>Feel the machine.<br /><em>Own the ride.</em></h2>
        <p>A closer look at the machine behind every journey.</p>
        <div className="bike-showcase-meta">
          <span><b>01</b> / RIDER VIEW</span>
          <span className="bike-showcase-line" />
          <span>360° MOTION EXPERIENCE</span>
        </div>
      </div>
      <motion.div className="bike-showcase-art" style={{ rotateX, rotateY, transformPerspective: 1100 }}>
        <div className="bike-showcase-aura" />
        <motion.img
          src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1500&q=88"
          alt="Sport motorcycle displayed in a dramatic studio setting"
          loading="lazy"
          draggable={false}
          animate={{ y: [0, -7, 0], rotateZ: [0, -0.5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="bike-showcase-orbit orbit-one" />
        <div className="bike-showcase-orbit orbit-two" />
        <span className="bike-showcase-caption">MACHINE / 001</span>
      </motion.div>
      <div className="bike-showcase-index">BREAK BREAKER <span>—</span> MOTORCYCLE INTELLIGENCE</div>
    </section>
  );
}
