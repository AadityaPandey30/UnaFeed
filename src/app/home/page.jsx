import HomeHeader from "../../components/Header";
import GetStarted from "./_components/GetStarted";
import EventsCarousel from "./_components/EventsCarousel";
import LostFoundSection from "./_components/LostFoundSection";
import AnnouncementSection from "./_components/AnnouncementSection";
import Footer from "../../components/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <HomeHeader />

      {/* Main Content */}
      <main className="flex-1 space-y-12 p-6 max-w-5xl mx-auto">
        <GetStarted />
        <EventsCarousel />
        <LostFoundSection />
        <AnnouncementSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
