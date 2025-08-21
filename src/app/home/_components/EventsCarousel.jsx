"use client";
import { useState, useEffect } from "react";

const EventsCarousel = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Dummy data for now
    const dummyEvents = [
      {
        id: 1,
        title: "Tech Fest 2025",
        content: "Join us for workshops, hackathons, and guest speakers.",
        author: "Student Union",
      },
      {
        id: 2,
        title: "Music Night",
        content: "An evening of live performances from campus bands.",
        author: "Cultural Committee",
      },
      {
        id: 3,
        title: "Sports Meet",
        content: "Annual inter-departmental sports competition.",
        author: "Sports Council",
      },
      {
        id: 4,
        title: "Art Exhibition",
        content: "Display of creative works by university artists.",
        author: "Arts Club",
      },
    ];

    setEvents(dummyEvents);
  }, []);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Upcoming Events</h2>

      {events.length === 0 ? (
        <p className="text-gray-500">No events posted yet.</p>
      ) : (
        <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
          {events.map((event) => (
            <div
              key={event.id}
              className="min-w-[250px] bg-white border rounded-xl shadow-sm p-4 flex-shrink-0"
            >
              <h3 className="font-bold text-blue-700">
                {event.title || "Untitled Event"}
              </h3>
              <p className="text-gray-700 mt-1 line-clamp-3">{event.content}</p>
              <p className="text-xs text-gray-500 mt-2">
                Hosted by {event.author}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default EventsCarousel;
