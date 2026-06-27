"use client"
import Hero from '../Components/Hero'
import Marquee from '../Components/Marquee'
import ProduceJourney from '../Components/ProduceJourney'
import HarvestFields from '../Components/HarvestFields'
import FAQSection from '../Components/FAQSection'
import Footer from '../Components/Footer'

const page = () => {
  return (
    <main className=''>
      <Hero />
      <Marquee />
      <ProduceJourney />
      <HarvestFields />
      <FAQSection />
      <Footer />
    </main>
  )
}

export default page
