import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import LessonPlayer from "@/components/lesson-player";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function LessonPage() {
  const { id } = useParams();
  const lesson = useQuery(
    api.courses.getLesson,
    id ? { lessonId: id as any } : "skip"
  );
  const questions = useQuery(
    api.courses.getQuizQuestions,
    id ? { lessonId: id as any } : "skip"
  );
  const submit = useMutation(api.courses.submitQuiz);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!id) return;
    const result = await submit({ lessonId: id as any, answers });
    setScore(result);
  };

  if (lesson === undefined || questions === undefined) return <div>Loading...</div>;
  if (lesson === null) return <div>Lesson not found</div>;

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-xl font-semibold">{lesson.title}</h1>
        <LessonPlayer lessonId={lesson._id} />
        {questions.length > 0 && (
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={q._id} className="space-y-2">
                <p>{q.question}</p>
                {q.options.map((opt: string, i: number) => (
                  <label key={i} className="block">
                    <input
                      type="radio"
                      name={`q${idx}`}
                      value={i}
                      checked={answers[idx] === i}
                      onChange={() => {
                        const copy = [...answers];
                        copy[idx] = i;
                        setAnswers(copy);
                      }}
                    />{" "}
                    {opt}
                  </label>
                ))}
              </div>
            ))}
            <Button onClick={handleSubmit}>Kirim</Button>
            {score !== null && <p>Skor: {score}</p>}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
