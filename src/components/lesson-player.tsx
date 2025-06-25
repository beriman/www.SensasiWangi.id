import { useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface LessonPlayerProps {
  lessonId: Id<"lessons">;
}

export default function LessonPlayer({ lessonId }: LessonPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lesson = useQuery(api.courses.getLesson, { lessonId });
  const userProgress = useQuery(api.progress.getProgress, { lessonId });
  const save = useMutation(api.progress.saveProgress);

  useEffect(() => {
    if (!lesson || !userProgress || !videoRef.current) return;
    const vid = videoRef.current;
    const setTime = () => {
      vid.currentTime = (userProgress.progress / 100) * vid.duration;
    };
    if (vid.readyState >= 2) setTime();
    else vid.onloadedmetadata = setTime;
  }, [lesson, userProgress]);

  if (lesson === undefined) return <div>Loading...</div>;
  if (lesson === null) return <div>Lesson not found</div>;

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const vid = videoRef.current;
    const progressValue = (vid.currentTime / vid.duration) * 100;
    save({ lessonId, progress: progressValue, completed: progressValue >= 100 });
  };

  return (
    <div className="w-full">
      <video
        ref={videoRef}
        controls
        src={lesson.videoUrl}
        className="w-full rounded-lg"
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
}
