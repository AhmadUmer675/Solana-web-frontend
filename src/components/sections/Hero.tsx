import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const WaveBackground = () => {
  const mountRef = useRef(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    
    // Create animated wave mesh
    const geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    const material = new THREE.MeshBasicMaterial({
      color: 0x9945FF,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    
    const wave = new THREE.Mesh(geometry, material);
    wave.rotation.x = -Math.PI / 3;
    scene.add(wave);
    
    // Add flowing particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 150;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.2,
      color: 0x14F195,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    camera.position.z = 50;
    camera.position.y = 20;
    
    let time = 0;
    
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      // Animate wave vertices
      const positions = wave.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = Math.sin(x * 0.2 + time) * Math.cos(y * 0.2 + time) * 3;
        positions.setZ(i, z);
      }
      positions.needsUpdate = true;
      
      particles.rotation.y += 0.0005;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full" />;
};

// ==================== Hero Components with Animations ====================

const HeroContent = () => {
  return (
    <div className="max-w-4xl animate-fadeInUp mt-24" style={{ animationDelay: '0.2s' }}>
      <h1 className="text-7xl md:text-8xl font-bold text-white mb-6 leading-none mt-8">
        <span className="inline-block animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          The capital market
        </span>
        <br />
        <span className="inline-block animate-fadeInUp bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent" style={{ animationDelay: '0.5s' }}>
          for every asset on earth.
        </span>
      </h1>
      <p className="text-xl text-gray-400 mb-8 max-w-2xl animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
        Solana is the leading high performance network powering internet capital markets, payments, and crypto applications.
      </p>
      <div className="flex space-x-4 animate-fadeInUp" style={{ animationDelay: '0.9s' }}>
        <button className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
          Get Started →
        </button>
        <button className="border border-white/20 text-white px-8 py-4 rounded-full hover:border-white/40 transition-all duration-300 hover:scale-105 hover:bg-white/5">
          Read Docs
        </button>
      </div>
    </div>
  );
};

const PartnerLogos = () => {
  const partners = ['Phantom', 'VISA', 'Worldpay', 'Circle', 'Stripe', 'Jump'];
  
  return (
    <div className="absolute bottom-12 left-0 right-0 z-10 animate-fadeIn" style={{ animationDelay: '1.3s' }}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center space-x-12 opacity-40">
          {partners.map((partner, i) => (
            <div 
              key={i} 
              className="text-white text-sm hover:opacity-100 transition-all duration-300 hover:scale-110 animate-fadeInUp"
              style={{ animationDelay: `${1.4 + i * 0.1}s` }}
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center">
      <WaveBackground />
      <div className="relative z-10 container mx-auto px-6">
        <HeroContent />
      </div>
      <PartnerLogos />
    </div>
  );
};

export default function App() {
  return (
    <div className="bg-black">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      
      <Hero />
    </div>
  );
}