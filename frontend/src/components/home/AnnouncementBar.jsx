import { useEffect, useState } from "react";

const defaultAnnouncements = [
  "Prepaid Orders Get Priority Shipping",
  "FLAT 10% OFF ON PREPAID ORDERS",
  "COMPLIMENTARY SHIPPING ACROSS INDIA",
  "Free Shipping on Orders Above ₹1999",
];

function AnnouncementBar() {
  const [announcements, setAnnouncements] =
    useState(defaultAnnouncements);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  /*
    Load announcements saved by admin.
    If the API is unavailable, the default
    Sirraha announcements remain visible.
  */
  useEffect(() => {
    let cancelled = false;

    const loadAnnouncements = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/announcements/active"
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        const serverAnnouncements =
          Array.isArray(data)
            ? data
            : data.announcements || [];

        const texts = serverAnnouncements
          .map((announcement) =>
            typeof announcement === "string"
              ? announcement
              : announcement.text
          )
          .filter(Boolean);

        if (!cancelled && texts.length > 0) {
          setAnnouncements(texts);
          setCurrentIndex(0);
        }
      } catch (error) {
        /*
          Keep the default announcements if
          backend is unavailable.
        */
        console.error(
          "Announcement loading error:",
          error
        );
      }
    };

    loadAnnouncements();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
    Rotate announcement every 4 seconds.
  */
  useEffect(() => {
    if (announcements.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex(
        (previousIndex) =>
          (previousIndex + 1) %
          announcements.length
      );
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [announcements.length]);

  return (
    <div className="announcement-bar">
      <div className="announcement-inner">
        <span
          key={`${currentIndex}-${announcements[currentIndex]}`}
          className="announcement-text"
        >
          {announcements[currentIndex]}
        </span>
      </div>
    </div>
  );
}

export default AnnouncementBar;