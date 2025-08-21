export async function listPosts() {
  // Simulate API response
  return [
    {
      id: 1,
      type: "lostfound",
      title: "Lost Wallet",
      content: "Black leather wallet lost near library.",
      author: "John",
    },
    {
      id: 2,
      type: "event",
      title: "Tech Fest",
      content: "Join us this weekend for the annual Tech Fest!",
      author: "Admin",
    },
    {
      id: 3,
      type: "lostfound",
      title: "Found Keys",
      content: "A set of car keys found near cafeteria.",
      author: "Alice",
    },
  ];
}
