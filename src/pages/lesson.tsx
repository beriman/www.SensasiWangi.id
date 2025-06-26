import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import LessonPlayer from "@/components/lesson-player";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

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
  const savedNote = useQuery(
    api.courses.getNote,
    id ? { lessonId: id as any } : "skip"
  );
  const saveNote = useMutation(api.courses.saveNote);
  const submit = useMutation(api.courses.submitQuiz);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (savedNote && savedNote.note !== undefined) {
      setNote(savedNote.note);
    }
  }, [savedNote]);

  const handleSubmit = async () => {
    if (!id) return;
    const result = await submit({ lessonId: id as any, answers });
    setScore(result);
  };

  const handleSaveNote = async () => {
    if (!id) return;
    try {
      await saveNote({ lessonId: id as any, note });
      alert("Catatan disimpan");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan catatan");
    }
  };

  if (lesson === undefined || questions === undefined) return <div>Loading...</div>;
  if (lesson === null) return <div>Lesson not found</div>;

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex gap-6">
          <div className="flex-1 space-y-6">
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
          </div>
          <aside className="w-80 space-y-4">
            <h2 className="text-lg font-semibold">Catatan</h2>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="neumorphic-input border-0 min-h-[200px] resize-none"
              placeholder="Tulis catatan..."
            />
            <Button onClick={handleSaveNote}>Simpan</Button>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
