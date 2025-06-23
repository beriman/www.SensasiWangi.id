import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, Heart, Star, Sparkles } from "lucide-react";

interface PerfumeNote {
  id: string;
  name: string;
  family: string;
  intensity: number;
  description: string;
  color: string;
  combinations: string[];
}

interface NoteFamily {
  name: string;
  color: string;
  notes: PerfumeNote[];
  description: string;
}

const PERFUME_FAMILIES: NoteFamily[] = [
  {
    name: "Citrus",
    color: "#FFE135",
    description: "Segar dan menyegarkan dengan aroma jeruk",
    notes: [
      {
        id: "1",
        name: "Bergamot",
        family: "Citrus",
        intensity: 7,
        description: "Aroma jeruk yang elegan dengan sentuhan floral",
        color: "#FFE135",
        combinations: ["Lavender", "Vanilla", "Cedar"],
      },
      {
        id: "2",
        name: "Lemon",
        family: "Citrus",
        intensity: 9,
        description: "Aroma lemon yang tajam dan menyegarkan",
        color: "#FFED4E",
        combinations: ["Mint", "Ginger", "Basil"],
      },
      {
        id: "3",
        name: "Orange",
        family: "Citrus",
        intensity: 6,
        description: "Aroma jeruk manis yang hangat",
        color: "#FF8C42",
        combinations: ["Cinnamon", "Clove", "Amber"],
      },
    ],
  },
  {
    name: "Floral",
    color: "#FF69B4",
    description: "Aroma bunga yang romantis dan feminin",
    notes: [
      {
        id: "4",
        name: "Rose",
        family: "Floral",
        intensity: 8,
        description: "Aroma mawar klasik yang mewah",
        color: "#FF1493",
        combinations: ["Oud", "Vanilla", "Patchouli"],
      },
      {
        id: "5",
        name: "Jasmine",
        family: "Floral",
        intensity: 9,
        description: "Aroma melati yang intens dan sensual",
        color: "#FFB6C1",
        combinations: ["Sandalwood", "Amber", "Musk"],
      },
      {
        id: "6",
        name: "Lavender",
        family: "Floral",
        intensity: 5,
        description: "Aroma lavender yang menenangkan",
        color: "#E6E6FA",
        combinations: ["Bergamot", "Cedar", "Vanilla"],
      },
    ],
  },
  {
    name: "Woody",
    color: "#8B4513",
    description: "Aroma kayu yang hangat dan maskulin",
    notes: [
      {
        id: "7",
        name: "Sandalwood",
        family: "Woody",
        intensity: 6,
        description: "Aroma kayu cendana yang creamy",
        color: "#DEB887",
        combinations: ["Rose", "Jasmine", "Vanilla"],
      },
      {
        id: "8",
        name: "Cedar",
        family: "Woody",
        intensity: 7,
        description: "Aroma kayu cedar yang kering dan bersih",
        color: "#A0522D",
        combinations: ["Bergamot", "Lavender", "Vetiver"],
      },
      {
        id: "9",
        name: "Oud",
        family: "Woody",
        intensity: 10,
        description: "Aroma kayu oud yang mewah dan kompleks",
        color: "#654321",
        combinations: ["Rose", "Saffron", "Amber"],
      },
    ],
  },
  {
    name: "Oriental",
    color: "#DAA520",
    description: "Aroma eksotis dengan rempah dan resin",
    notes: [
      {
        id: "10",
        name: "Vanilla",
        family: "Oriental",
        intensity: 8,
        description: "Aroma vanilla yang manis dan hangat",
        color: "#F5DEB3",
        combinations: ["Bergamot", "Rose", "Sandalwood"],
      },
      {
        id: "11",
        name: "Amber",
        family: "Oriental",
        intensity: 7,
        description: "Aroma amber yang resinous dan hangat",
        color: "#FFBF00",
        combinations: ["Orange", "Jasmine", "Oud"],
      },
      {
        id: "12",
        name: "Patchouli",
        family: "Oriental",
        intensity: 9,
        description: "Aroma patchouli yang earthy dan intens",
        color: "#8B4513",
        combinations: ["Rose", "Vanilla", "White Musk"],
      },
    ],
  },
];

export default function PerfumeNoteExplorer() {
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<PerfumeNote | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hoveredNote, setHoveredNote] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const allNotes = PERFUME_FAMILIES.flatMap((family) => family.notes);

  const filteredNotes = allNotes.filter(
    (note) =>
      note.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.family.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleFavorite = (noteId: string) => {
    setFavorites((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [...prev, noteId],
    );
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return "bg-green-200";
    if (intensity <= 6) return "bg-yellow-200";
    if (intensity <= 8) return "bg-orange-200";
    return "bg-red-200";
  };

  useEffect(() => {
    if (!svgRef.current) return;
    const width = 600;
    const height = 400;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const nodes = allNotes.map((n) => ({ ...n }));
    const links: { source: string; target: string }[] = [];
    allNotes.forEach((n) => {
      n.combinations.forEach((c) => {
        const target = allNotes.find((t) => t.name === c);
        if (target) {
          links.push({ source: n.id, target: target.id });
        }
      });
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const simulation = d3
      .forceSimulation(nodes as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append('g')
      .attr('stroke', '#ccc')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line');

    const node = svg
      .append('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 8)
      .attr('fill', (d) => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .call(
        d3
          .drag<SVGCircleElement, any>()
          .on('start', (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      )
      .on('click', (_event, d) => {
        const note = allNotes.find((n) => n.id === d.id);
        if (note) setSelectedNote(note);
      });

    node.append('title').text((d) => d.name);

    simulation.on('tick', () => {
      link
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr('x1', (d: any) => d.source.x)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr('y1', (d: any) => d.source.y)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr('x2', (d: any) => d.target.x)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr('y2', (d: any) => d.target.y);

      node
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr('cx', (d: any) => d.x)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr('cy', (d: any) => d.y);
    });

    return () => {
      simulation.stop();
    };
  }, [allNotes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <Sparkles className="text-purple-600" />
            Perfume Note Explorer
            <Sparkles className="text-purple-600" />
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Jelajahi dunia aroma dengan visualisasi interaktif keluarga parfum
            dan kombinasi note yang menakjubkan
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-md mx-auto">
          <div className="absolute inset-0 bg-white rounded-2xl shadow-[inset_8px_8px_16px_#d1d5db,inset_-8px_-8px_16px_#ffffff]"></div>
          <div className="relative p-4">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Cari note atau keluarga aroma..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 border-0 bg-transparent focus:ring-0 shadow-none"
            />
          </div>
        </div>

        {/* Interactive Graph */}
        <div className="flex justify-center mb-8">
          <svg
            ref={svgRef}
            width={600}
            height={400}
            className="bg-white rounded-lg shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff]"
          />
        </div>

        {/* Family Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {PERFUME_FAMILIES.map((family) => (
            <Card
              key={family.name}
              className={`cursor-pointer transition-all duration-300 border-0 bg-white shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] hover:shadow-[inset_8px_8px_16px_#d1d5db,inset_-8px_-8px_16px_#ffffff] ${
                selectedFamily === family.name
                  ? "shadow-[inset_8px_8px_16px_#d1d5db,inset_-8px_-8px_16px_#ffffff]"
                  : ""
              }`}
              onClick={() =>
                setSelectedFamily(
                  selectedFamily === family.name ? null : family.name,
                )
              }
            >
              <div className="p-6 text-center">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 shadow-[4px_4px_8px_#d1d5db,-4px_-4px_8px_#ffffff]"
                  style={{ backgroundColor: family.color }}
                ></div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {family.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {family.description}
                </p>
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-gray-700"
                >
                  {family.notes.length} notes
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {(selectedFamily
            ? PERFUME_FAMILIES.find((f) => f.name === selectedFamily)?.notes ||
              []
            : searchTerm
              ? filteredNotes
              : allNotes
          ).map((note) => (
            <Card
              key={note.id}
              className={`cursor-pointer transition-all duration-300 border-0 bg-white shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] hover:shadow-[12px_12px_20px_#d1d5db,-12px_-12px_20px_#ffffff] hover:scale-105 ${
                selectedNote?.id === note.id
                  ? "shadow-[inset_8px_8px_16px_#d1d5db,inset_-8px_-8px_16px_#ffffff]"
                  : ""
              }`}
              onClick={() =>
                setSelectedNote(selectedNote?.id === note.id ? null : note)
              }
              onMouseEnter={() => setHoveredNote(note.id)}
              onMouseLeave={() => setHoveredNote(null)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div
                    className="w-12 h-12 rounded-full shadow-[4px_4px_8px_#d1d5db,-4px_-4px_8px_#ffffff]"
                    style={{ backgroundColor: note.color }}
                  ></div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(note.id);
                    }}
                    className={`p-2 rounded-full shadow-[4px_4px_8px_#d1d5db,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] ${
                      favorites.includes(note.id)
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${favorites.includes(note.id) ? "fill-current" : ""}`}
                    />
                  </Button>
                </div>

                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {note.name}
                </h3>
                <Badge
                  variant="outline"
                  className="mb-3 border-0 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff]"
                  style={{ color: note.color }}
                >
                  {note.family}
                </Badge>

                <p className="text-sm text-gray-600 mb-4">{note.description}</p>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-gray-500">Intensitas:</span>
                  <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < note.intensity
                            ? getIntensityColor(note.intensity)
                            : "bg-gray-200"
                        } shadow-[inset_2px_2px_4px_#d1d5db,inset_-2px_-2px_4px_#ffffff]`}
                      ></div>
                    ))}
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {note.intensity}/10
                  </span>
                </div>

                {hoveredNote === note.id && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff]">
                    <p className="text-xs text-gray-600 mb-2">
                      Kombinasi populer:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {note.combinations.map((combo, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-white shadow-[2px_2px_4px_#d1d5db,-2px_-2px_4px_#ffffff]"
                        >
                          {combo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Selected Note Detail */}
        {selectedNote && (
          <Card className="border-0 bg-white shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-20 h-20 rounded-full shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff]"
                    style={{ backgroundColor: selectedNote.color }}
                  ></div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                      {selectedNote.name}
                    </h2>
                    <Badge
                      variant="outline"
                      className="mt-2 border-0 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff]"
                      style={{ color: selectedNote.color }}
                    >
                      {selectedNote.family}
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-700 text-lg mb-6">
                  {selectedNote.description}
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Tingkat Intensitas
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < selectedNote.intensity
                                ? getIntensityColor(selectedNote.intensity)
                                : "bg-gray-200"
                            } shadow-[inset_2px_2px_4px_#d1d5db,inset_-2px_-2px_4px_#ffffff]`}
                          ></div>
                        ))}
                      </div>
                      <span className="font-bold text-lg text-gray-800">
                        {selectedNote.intensity}/10
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Kombinasi Terbaik
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {selectedNote.combinations.map((combo, index) => {
                    const comboNote = allNotes.find((n) => n.name === combo);
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff]"
                      >
                        {comboNote && (
                          <div
                            className="w-8 h-8 rounded-full shadow-[2px_2px_4px_#d1d5db,-2px_-2px_4px_#ffffff]"
                            style={{ backgroundColor: comboNote.color }}
                          ></div>
                        )}
                        <span className="font-medium text-gray-800">
                          {combo}
                        </span>
                        {comboNote && (
                          <Badge
                            variant="secondary"
                            className="ml-auto bg-white shadow-[2px_2px_4px_#d1d5db,-2px_-2px_4px_#ffffff]"
                          >
                            {comboNote.family}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 bg-white shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] p-6 text-center">
            <h3 className="font-bold text-2xl text-gray-800 mb-2">
              {allNotes.length}
            </h3>
            <p className="text-gray-600">Total Notes</p>
          </Card>
          <Card className="border-0 bg-white shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] p-6 text-center">
            <h3 className="font-bold text-2xl text-gray-800 mb-2">
              {PERFUME_FAMILIES.length}
            </h3>
            <p className="text-gray-600">Keluarga Aroma</p>
          </Card>
          <Card className="border-0 bg-white shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] p-6 text-center">
            <h3 className="font-bold text-2xl text-gray-800 mb-2">
              {favorites.length}
            </h3>
            <p className="text-gray-600">Favorit Anda</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
