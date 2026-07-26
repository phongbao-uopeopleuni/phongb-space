import { BootScreen } from './components/BootScreen';
import { CustomCursor } from './components/CustomCursor';
import { Nav } from './components/Nav';
import { ScrollProgress } from './components/ScrollProgress';
import { StructuredData } from './components/StructuredData';
import { Contact } from './components/sections/Contact';
import { Deliverables } from './components/sections/Deliverables';
import { Faq } from './components/sections/Faq';
import { Footer } from './components/sections/Footer';
import { Hero } from './components/sections/Hero';
import { Process } from './components/sections/Process';
import { Services } from './components/sections/Services';
import { Works } from './components/sections/Works';
import { useI18n } from './i18n';

export function App() {
  const { t } = useI18n();

  return (
    <>
      <StructuredData />
      <BootScreen />
      <CustomCursor />
      <ScrollProgress />

      <a href="#main" className="skip-link">
        {t.nav.skipToContent}
      </a>

      <Nav />

      {/* Thu tu section theo cach khach ra quyet dinh: xem san pham that truoc,
          gia va quy trinh sau, roi moi den form lien he */}
      <main id="main">
        <Hero />
        <Works />
        <Services />
        <Process />
        <Deliverables />
        <Faq />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
