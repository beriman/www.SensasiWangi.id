import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2 } from "lucide-react";
import { useState } from "react";

export default function Polling() {
  const [votes, setVotes] = useState<{ [key: string]: number }>({
    A: 0,
    B: 0,
    C: 0,
  });
  const [voted, setVoted] = useState<string | null>(null);

  const options = [
    { id: "A", label: "Pilihan A" },
    { id: "B", label: "Pilihan B" },
    { id: "C", label: "Pilihan C" },
  ];

  const handleVote = (optionId: string) => {
    if (!voted) {
      setVotes((prev) => ({ ...prev, [optionId]: prev[optionId] + 1 }));
      setVoted(optionId);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-xl mx-auto space-y-6">
            <div className="flex justify-center">
              <div className="neumorphic-card p-4 rounded-2xl">
                <BarChart2 className="w-12 h-12 text-[#0066CC]" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-center text-[#1D1D1F]">
              Polling &amp; Survei
            </h1>
            <p className="text-[#86868B] text-center">
              Fitur ini mempermudah anggota mengumpulkan pendapat atau
              preferensi dari komunitas. Pengguna cukup membuat pertanyaan singkat
              dengan pilihan jawaban, lalu anggota lain dapat memilih. Polling
              yang menarik dapat memicu diskusi lebih lanjut.
            </p>
            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F]">Contoh Polling</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[#86868B]">Parfum mana yang paling Anda sukai?</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {options.map((opt) => (
                    <Button
                      key={opt.id}
                      onClick={() => handleVote(opt.id)}
                      disabled={!!voted}
                      className="neumorphic-button-sm"
                    >
                      {opt.label} ({votes[opt.id]})
                    </Button>
                  ))}
                </div>
                {voted && (
                  <p className="text-sm text-[#1D1D1F] mt-2">
                    Anda memilih {options.find((o) => o.id === voted)?.label}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
