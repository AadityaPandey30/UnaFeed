"use client";
import { useState, useEffect } from "react";

const EventsCarousel = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Dummy data
    const dummyEvents = [
      {
        id: 1,
        title: "Tech Fest 2025",
        content: "Workshops, hackathons, and guest speakers.",
        author: "Student Union",
        location: "Main Auditorium",
        startAt: new Date("2025-09-15T10:00:00"),
        endAt: new Date("2025-09-15T18:00:00"),
        rsvpCounts: { going: 120, interested: 80, not_going: 15 },
        capacity: 300,
      },
      {
        id: 2,
        title: "Music Night",
        content: "Live performances from campus bands.",
        author: "Cultural Committee",
        location: "Open Grounds",
        startAt: new Date("2025-09-20T19:00:00"),
        endAt: new Date("2025-09-20T22:30:00"),
        rsvpCounts: { going: 95, interested: 120, not_going: 10 },
        capacity: 250,
      },
    ];

    setEvents(dummyEvents);
  }, []);

  // Handle RSVP clicks
  const handleRSVP = (eventId, type) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId
          ? {
              ...event,
              rsvpCounts: {
                ...event.rsvpCounts,
                [type]: event.rsvpCounts[type] + 1,
              },
            }
          : event
      )
    );
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Upcoming Events</h2>

      {events.length === 0 ? (
        <p className="text-gray-500">No events posted yet.</p>
      ) : (
        <div className="flex overflow-x-auto space-x-4 pb-3 scrollbar-hide">
          {events.map((event) => (
            <div
              key={event.id}
              className="min-w-[220px] bg-white border rounded-lg shadow p-3 flex-shrink-0"
            >
              <h3 className="font-bold text-blue-700">{event.title}</h3>

              <p className="text-gray-600 text-sm mt-1">{event.content}</p>

              <p className="text-xs text-gray-500 mt-2">📍 {event.location}</p>

              {event.startAt && event.endAt && (
                <p className="text-xs text-gray-500">
                  🗓 {event.startAt.toLocaleDateString()}{" "}
                  {event.startAt.toLocaleTimeString([], { timeStyle: "short" })}{" "}
                  - {event.endAt.toLocaleTimeString([], { timeStyle: "short" })}
                </p>
              )}

              {/* RSVP Section */}
              {event.rsvpCounts && (
                <div className="text-xs text-gray-600 mt-3 space-y-2">
                  <div>
                    ✅ Going: {event.rsvpCounts.going}{" "}
                    <button
                      onClick={() => handleRSVP(event.id, "going")}
                      className="ml-2 px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded"
                    >
                      I'm Going
                    </button>
                  </div>

                  <div>
                    ⭐ Interested: {event.rsvpCounts.interested}{" "}
                    <button
                      onClick={() => handleRSVP(event.id, "interested")}
                      className="ml-2 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded"
                    >
                      I'm Interested
                    </button>
                  </div>

                  <div>
                    ❌ Not Going: {event.rsvpCounts.not_going}{" "}
                    <button
                      onClick={() => handleRSVP(event.id, "not_going")}
                      className="ml-2 px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded"
                    >
                      Not Going
                    </button>
                  </div>
                </div>
              )}

              {event.capacity && (
                <p className="text-xs text-gray-500 mt-2">
                  Capacity: {event.capacity}
                </p>
              )}

              <p className="text-xs text-gray-400 mt-1">
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
