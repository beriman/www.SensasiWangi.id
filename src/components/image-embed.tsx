import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Image as ImageIcon, X } from "lucide-react";

interface ImageEmbedProps {
  onImageAdd?: (url: string) => void;
  className?: string;
}

const ImageEmbed = ({ onImageAdd, className = "" }: ImageEmbedProps) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const handleAddImage = () => {
    if (!imageUrl.trim()) return;
    const url = imageUrl.trim();
    setImages((prev) => [...prev, url]);
    onImageAdd?.(url);
    setImageUrl("");
    setIsDialogOpen(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="neumorphic-button bg-transparent text-[#2d3748] font-semibold border-0 shadow-none">
            <ImageIcon className="h-4 w-4 mr-2" />
            Tambah Gambar
          </Button>
        </DialogTrigger>
        <DialogContent className="neumorphic-card border-0 shadow-none">
          <DialogHeader>
            <DialogTitle className="text-[#2d3748]">Embed Gambar</DialogTitle>
            <DialogDescription className="text-[#718096]">
              Masukkan URL gambar untuk menambahkannya ke postingan Anda.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="neumorphic-input border-0"
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddImage}
              className="neumorphic-button bg-transparent text-[#2d3748] font-semibold border-0 shadow-none"
            >
              Tambah Gambar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {images.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-[#2d3748]">Gambar Ditambahkan:</h4>
          {images.map((url, index) => (
            <Card key={index} className="neumorphic-card border-0 shadow-none">
              <CardContent className="p-4">
                <div className="flex justify-end mb-2">
                  <Button
                    onClick={() => removeImage(index)}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-[#718096] hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <img
                  src={url}
                  alt="Embedded image preview"
                  className="w-full rounded-lg"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageEmbed;
