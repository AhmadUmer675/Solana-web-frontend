import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

import Hero from '@/components/sections/Hero';
import Stats from '@/components/sections/Stats';
import Institutions from '@/components/sections/Institutions';
import LatestNews from '@/components/sections/LatestNews';
import HowWeBuilt from '@/components/sections/HowWeBuilt';
import Community from '@/components/sections/Community';
import ReadyToCreate from '@/components/sections/ReadyToCreate';

const Home = () => (
  <>
    <Hero />
    {/* <MeetSolana /> */}
    <Stats />
    <Institutions />
    <LatestNews />
    <HowWeBuilt />
    <Community />
    <ReadyToCreate />
  </>
);

const App = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
