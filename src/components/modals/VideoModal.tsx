import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Video } from "lucide-react";

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  videoSrc: string;
}

export function VideoModal({ open, onClose, title, videoSrc }: VideoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-card border-border p-0 overflow-hidden">
        <DialogHeader className="p-4 bg-secondary/50 border-b border-border">
          <DialogTitle className="flex items-center gap-2 text-info">
            <Video className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full bg-black">
          <video 
            src={videoSrc} 
            controls 
            autoPlay 
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
}
