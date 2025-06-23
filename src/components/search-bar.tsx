import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";

export function SearchBar() {
  const [term, setTerm] = useState("");
  const results = useQuery(api.search.crossSearch, term ? { term } : "skip");

  return (
    <div className="relative w-full max-w-xs">
      <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search..."
        className="pl-8 neumorphic-input border-0"
      />
      {results && term && (
        <div className="absolute mt-1 w-full neumorphic-card border-0 max-h-60 overflow-y-auto z-50">
          {results.topics.length === 0 && results.products.length === 0 && (
            <div className="p-2 text-sm text-gray-500">No results</div>
          )}
          {results.topics.map((t: any) => (
            <Link
              key={t._id}
              to={`/forum`}
              className="block px-2 py-1 hover:bg-[#F5F5F7] text-sm"
            >
              {t.title}
            </Link>
          ))}
          {results.products.map((p: any) => (
            <Link
              key={p._id}
              to={`/marketplace/product/${p._id}`}
              className="block px-2 py-1 hover:bg-[#F5F5F7] text-sm"
            >
              {p.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
