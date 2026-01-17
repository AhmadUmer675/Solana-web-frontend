import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import MeetSolana from '@/components/sections/MeetSolana';
import Stats from '@/components/sections/Stats';
import WhatsHappening from '@/components/sections/WhatsHappening';
import Institutions from '@/components/sections/Institutions';
import LatestNews from '@/components/sections/LatestNews';
import HowWeBuilt from '@/components/sections/HowWeBuilt';
import Community from '@/components/sections/Community';
import Footer from '@/components/layout/Footer';
import ReadyToCreate from './components/sections/ReadyToCreate';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <MeetSolana />
      <Stats />
      <WhatsHappening />
      <Institutions />
      <LatestNews />
      <HowWeBuilt />
      <Community />
      <ReadyToCreate />
      <Footer />
    </div>
  );
};

export default Index;
