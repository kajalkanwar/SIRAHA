
import { useEffect, useState } from "react";
import { getActiveAnnouncements } from "../../constants/api.js";

function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadAnnouncements = async () => {
      try {
        const result = await getActiveAnnouncements();

        const messages = (Array.isArray(result) ? result : [])
          .map((item) =>
            typeof item === "string"
              ? item.trim()
              : String(item?.message || item?.text || "").trim()
          )
          .filter(Boolean);

        if (isMounted) {
          setAnnouncements(messages);
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error("Unable to load announcements:", error);

        if (isMounted) {
          setAnnouncements([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAnnouncements();

    const refreshId = window.setInterval(loadAnnouncements, 60000);

    return () => {
      isMounted = false;
      window.clearInterval(refreshId);
    };
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;

    const rotationId = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % announcements.length);
    }, 4000);

    return () => window.clearInterval(rotationId);
  }, [announcements.length]);

  if (loading || announcements.length === 0) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="
        relative z-[301]
        flex h-[34px] w-full
        items-center justify-center
        overflow-hidden
        bg-[#4B1F1B]
        px-3
        text-[#FFFFFF]
        sm:h-[39px]
      "
    >
      <p
        key={`${currentIndex}-${announcements[currentIndex]}`}
        className="
          announcement-rotating-text
          m-0 max-w-full truncate
          font-['Poppins']
          text-[9px] font-medium uppercase
          tracking-[1.2px]
          sm:text-[10px]
          sm:tracking-[1.8px]
        "
      >
        {announcements[currentIndex]}
      </p>
    </div>
  );
}

export default AnnouncementBar;
