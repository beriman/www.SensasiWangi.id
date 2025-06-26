import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";

interface Filters {
  authorId?: string;
  startDate?: number;
  endDate?: number;
  tags?: string[];
}

interface AdvancedSearchDialogProps {
  onSearch: (filters: Filters) => void;
  onSave?: (name: string, filters: Filters) => void;
}

export default function AdvancedSearchDialog({ onSearch, onSave }: AdvancedSearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [authorId, setAuthorId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tags, setTags] = useState("");
  const [saveQuery, setSaveQuery] = useState(false);
  const [queryName, setQueryName] = useState("");

  const handleSubmit = () => {
    const filters: Filters = {
      authorId: authorId.trim() || undefined,
      startDate: startDate ? new Date(startDate).getTime() : undefined,
      endDate: endDate ? new Date(endDate).getTime() : undefined,
      tags: tags
        ? tags.split(",").map((t) => t.trim()).filter((t) => t)
        : undefined,
    };
    onSearch(filters);
    if (saveQuery && onSave) {
      onSave(queryName || new Date().toLocaleString(), filters);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="neumorphic-button bg-transparent text-[#2d3748] font-semibold border-0 shadow-none">
          <Search className="h-4 w-4 mr-2" />
          Advanced Search
        </Button>
      </DialogTrigger>
      <DialogContent className="neumorphic-card border-0 shadow-none max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#2d3748]">Advanced Search</DialogTitle>
          <DialogDescription className="text-[#718096]">
            Filter topics by author, date range and tags.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Author ID"
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            className="neumorphic-input border-0"
          />
          <div className="flex gap-2">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="neumorphic-input border-0"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="neumorphic-input border-0"
            />
          </div>
          <Input
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="neumorphic-input border-0"
          />
          <div className="flex items-center gap-2">
            <Checkbox
              id="saveQuery"
              checked={saveQuery}
              onCheckedChange={(checked) => setSaveQuery(!!checked)}
            />
            <label htmlFor="saveQuery" className="text-sm text-[#2d3748]">
              Save this search
            </label>
          </div>
          {saveQuery && (
            <Input
              placeholder="Search name"
              value={queryName}
              onChange={(e) => setQueryName(e.target.value)}
              className="neumorphic-input border-0"
            />
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="neumorphic-button bg-transparent text-[#2d3748] font-semibold border-0 shadow-none"
          >
            Search
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
