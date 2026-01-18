import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const WaveBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const mountElement: HTMLDivElement = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const canvas: HTMLCanvasElement = renderer.domElement;
    mountElement.appendChild(canvas);

    // ===== Wave Mesh =====
    const geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    const material = new THREE.MeshBasicMaterial({
      color: 0x9945ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });

    const wave = new THREE.Mesh(geometry, material);
    wave.rotation.x = -Math.PI / 3;
    scene.add(wave);

    // ===== Particles =====
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 150;
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.2,
      color: 0x14f195,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particles);

    camera.position.set(0, 20, 50);

    let time = 0;

    const animate = () => {
      time += 0.01;

      const positions =
        wave.geometry.attributes.position as THREE.BufferAttribute;

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z =
          Math.sin(x * 0.2 + time) *
          Math.cos(y * 0.2 + time) *
          3;

        positions.setZ(i, z);
      }

      positions.needsUpdate = true;
      particles.rotation.y += 0.0005;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // ===== Cleanup =====
    return () => {
      window.removeEventListener('resize', handleResize);

      if (mountElement.contains(canvas)) {
        mountElement.removeChild(canvas);
      }

      geometry.dispose();
      material.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute top-0 left-0 w-full h-full"
    />
  );
};

// ==================== HERO ====================

const HeroContent: React.FC = () => (
  <div className="max-w-4xl animate-fadeInUp mt-24">
    <h1 className="text-7xl md:text-8xl font-bold text-white mb-6 leading-none">
      The capital market
      <br />
      <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
        for every asset on earth.
      </span>
    </h1>

    <p className="text-xl text-gray-400 mb-8 max-w-2xl">
      Solana is the leading high performance network powering internet
      capital markets, payments, and crypto applications.
    </p>

    <div className="flex space-x-4">
      <button className="bg-white text-black px-8 py-4 rounded-full">
        Get Started →
      </button>
      <button className="border border-white/20 text-white px-8 py-4 rounded-full">
        Read Docs
      </button>
    </div>
  </div>
);

const Hero: React.FC = () => (
  <div className="relative min-h-screen bg-black overflow-hidden flex items-center">
    <WaveBackground />
    <div className="relative z-10 container mx-auto px-6">
      <HeroContent />
    </div>
  </div>
);

export default Hero;