import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, TrendingUp } from "lucide-react";

export function TrendingDiscussions() {
  const topics = useQuery(api.forum.getHotTopics, { limit: 5 });

  if (!topics || topics.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-[#1D1D1F] flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-orange-600" />
        Diskusi Trending
      </h2>
      <div className="space-y-4">
        {topics.map((topic) => (
          <Card key={topic._id} className="neumorphic-card border-0 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  {topic.category}
                </Badge>
                <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                  🔥 Hot
                </Badge>
              </div>
              <CardTitle className="text-lg font-semibold text-[#2d3748]">
                {topic.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-[#718096] line-clamp-2 mb-2">
                {topic.content.substring(0, 100)}...
              </p>
              <div className="flex items-center gap-4 text-xs text-[#86868B]">
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {topic.likes}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {topic.views}
                </span>
                <Link
                  to={`/forum?topic=${topic._id}`}
                  className="ml-auto neumorphic-button-sm bg-transparent text-[#2d3748] border-0 shadow-none"
                >
                  Lihat
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
