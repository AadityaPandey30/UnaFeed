"use client";
import { useRouter } from "next/navigation";

function GetStarted() {
  const router = useRouter();

  return (
    <div className="text-center">
      <button
        onClick={() => router.push("/create")}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Get Started
      </button>
    </div>
  );
}

export default GetStarted;
