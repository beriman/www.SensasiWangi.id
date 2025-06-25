import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

export default function CourseDetail() {
  const { id } = useParams();
  const course = useQuery(
    api.courses.getCourse,
    id ? { courseId: id as any } : "skip"
  );
  const lessons = useQuery(
    api.courses.getLessons,
    id ? { courseId: id as any } : "skip"
  );
  const progress = useQuery(
    api.progress.getCourseProgress,
    id ? { courseId: id as any } : "skip"
  );
  const certificate = useQuery(
    api.certificates.getCertificate,
    id ? { courseId: id as any } : "skip"
  );
  const generate = useMutation(api.certificates.generateCertificate);

  if (course === undefined || lessons === undefined) return <div>Loading...</div>;
  if (course === null) return <div>Course not found</div>;

  const allCompleted =
    progress &&
    lessons?.every((l) => progress.find((p) => p.lessonId === l._id && p.completed));

  const handleGenerate = async () => {
    if (!id) return;
    await generate({ courseId: id as any });
  };

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-4">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <p className="text-gray-600">{course.description}</p>
        {course.discussionTopicId && (
          <Link
            to={`/forum?topic=${course.discussionTopicId}`}
            className="text-indigo-600 underline"
          >
            Diskusi Kursus
          </Link>
        )}
        <ul className="space-y-2">
          {lessons?.map((lesson) => (
            <li key={lesson._id}>
              <Link
                to={`/lesson/${lesson._id}`}
                className="text-indigo-600 underline"
              >
                {lesson.title}
              </Link>
            </li>
          ))}
        </ul>

        {allCompleted && (
          <div className="pt-4">
            {certificate ? (
              <a href={certificate.url} className="text-indigo-600 underline">
                Download Sertifikat
              </a>
            ) : (
              <Button onClick={handleGenerate}>Generate Sertifikat</Button>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
