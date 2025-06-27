import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <main className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
        <h1 className="text-3xl font-bold">Page Not Found</h1>
        <p className="text-[#4a5568]">The page you are looking for does not exist.</p>
        <Link to="/" className="text-blue-600">
          Back to Home
        </Link>
      </main>
    </div>
  );
}
