import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DESIGN_TYPES = [
  "Logo Design",
  "Social Media Post Design",
  "Banner Design",
  "YouTube Thumbnail Design",
  "Live Webinar/Seminar Banner",
  "Print Banner Design",
  "Print Flyer Design",
  "Business Card Design",
  "ID Card Design",
  "Icon Design",
  "Web Banner Design",
  "Web Image Design",
];

const DIMENSIONS = [
  "1920 x 1080",
  "3.375 x 2.125 Inch",
  "1080 x 1080",
  "9 x 4 Feet",
  "5 x 3 Feet",
  "3.5 x 2 Inch",
  "Other",
];

const schema = z.object({
  request_name: z.string().trim().min(1, "Request name is required").max(150),
  design_type: z.string().min(1, "Please choose a design type"),
  dimension: z.string().min(1, "Please choose a dimension"),
  custom_width: z.string().trim().max(30).optional(),
  custom_height: z.string().trim().max(30).optional(),
  reference_link: z.string().trim().url("Enter a valid URL").max(500),
  design_content: z.string().trim().min(1, "Design content is required").max(2000),
  email: z.string().trim().email("Invalid email").max(255),
});

const DesignRequestForm = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [requestName, setRequestName] = useState("");
  const [designType, setDesignType] = useState("");
  const [dimension, setDimension] = useState("");
  const [customW, setCustomW] = useState("");
  const [customH, setCustomH] = useState("");
  const [referenceLink, setReferenceLink] = useState("");
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [designContent, setDesignContent] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [email, setEmail] = useState("");

  const isOther = dimension === "Other";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const parsed = schema.safeParse({
        request_name: requestName,
        design_type: designType,
        dimension,
        custom_width: customW,
        custom_height: customH,
        reference_link: referenceLink,
        design_content: designContent,
        email,
      });
      if (!parsed.success) {
        toast({
          title: "Please check the form",
          description: parsed.error.issues[0].message,
          variant: "destructive",
        });
        return;
      }
      if (!deadline) {
        toast({
          title: "Deadline required",
          description: "Please pick a deadline date.",
          variant: "destructive",
        });
        return;
      }
      if (isOther && (!customW.trim() || !customH.trim())) {
        toast({
          title: "Dimensions required",
          description: "Enter width and height for the custom dimension.",
          variant: "destructive",
        });
        return;
      }
      if (referenceFile && referenceFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Reference image must be under 10MB.",
          variant: "destructive",
        });
        return;
      }

      let referenceImageUrl: string | null = null;
      if (referenceFile) {
        const ext = referenceFile.name.split(".").pop() ?? "bin";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("design-references")
          .upload(path, referenceFile, { upsert: false });
        if (upErr) throw upErr;
        referenceImageUrl = path;
      }

      const d = parsed.data;
      const { error } = await supabase.from("design_requests").insert({
        request_name: d.request_name,
        design_type: d.design_type,
        dimension: d.dimension,
        custom_width: isOther ? customW : null,
        custom_height: isOther ? customH : null,
        reference_link: d.reference_link,
        reference_image_url: referenceImageUrl,
        design_content: d.design_content,
        deadline: format(deadline, "yyyy-MM-dd"),
        email: d.email,
      });
      if (error) throw error;

      toast({
        title: "Task created!",
        description: "We received your design request and will get on it.",
      });
      setRequestName("");
      setDesignType("");
      setDimension("");
      setCustomW("");
      setCustomH("");
      setReferenceLink("");
      setReferenceFile(null);
      setDesignContent("");
      setDeadline(undefined);
      setEmail("");
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xl text-left"
    >
      <div className="space-y-5">
        <div>
          <Label htmlFor="request_name">Request Name *</Label>
          <Input
            id="request_name"
            placeholder="Happy New Year Banner/Custom Logo Design"
            value={requestName}
            onChange={(e) => setRequestName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="design_type">Design Type *</Label>
          <Select value={designType} onValueChange={setDesignType}>
            <SelectTrigger id="design_type">
              <SelectValue placeholder="Social Media Banner" />
            </SelectTrigger>
            <SelectContent>
              {DESIGN_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Dimension *</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {DIMENSIONS.map((d) => {
              const active = dimension === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDimension(d)}
                  className={cn(
                    "px-4 py-2 rounded-full border text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-primary border-border hover:border-primary",
                  )}
                >
                  {d}
                </button>
              );
            })}
          </div>
          {isOther && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="custom_width">Width</Label>
                <Input
                  id="custom_width"
                  placeholder="e.g. 800"
                  value={customW}
                  onChange={(e) => setCustomW(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="custom_height">Height</Label>
                <Input
                  id="custom_height"
                  placeholder="e.g. 600"
                  value={customH}
                  onChange={(e) => setCustomH(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="reference_link">Reference Link (If any) *</Label>
          <Input
            id="reference_link"
            type="url"
            placeholder="https://dribbble.com/design/jlbher26H"
            value={referenceLink}
            onChange={(e) => setReferenceLink(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="reference_image">Reference Image (If any)</Label>
          <label
            htmlFor="reference_image"
            className="mt-1 flex items-center gap-3 border border-dashed border-border rounded-lg px-4 py-3 cursor-pointer hover:border-primary transition-colors bg-background"
          >
            <Upload size={18} className="text-primary" />
            <span className="text-sm text-muted-foreground truncate">
              {referenceFile ? referenceFile.name : "Choose a file"}
            </span>
            <input
              id="reference_image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setReferenceFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <div>
          <Label htmlFor="design_content">Design Content *</Label>
          <Textarea
            id="design_content"
            rows={5}
            placeholder="Write design description & content here"
            value={designContent}
            onChange={(e) => setDesignContent(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Deadline *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal mt-1",
                  !deadline && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {deadline
                  ? format(deadline, "PPP")
                  : "Select a date by when you need it"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={deadline}
                onSelect={setDeadline}
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full font-semibold text-base py-6"
        >
          {submitting ? "Creating..." : "Create Task Now!"}
        </Button>
      </div>
    </form>
  );
};

export default DesignRequestForm;
