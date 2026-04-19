import { useState } from "react";
import { z } from "zod";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(5, "Phone is required").max(30),
  brand_name: z.string().trim().min(1, "Brand name is required").max(150),
  brand_website: z
    .string()
    .trim()
    .max(255)
    .url("Invalid URL")
    .optional()
    .or(z.literal("")),
  social_facebook: z.string().trim().max(255).optional().or(z.literal("")),
  social_instagram: z.string().trim().max(255).optional().or(z.literal("")),
  social_other: z.string().trim().max(255).optional().or(z.literal("")),
  video_quantity: z.number().int().min(0).max(99),
  static_quantity: z.number().int().min(0).max(99),
  frequency: z.enum(["daily", "monthly", "quarterly", "yearly"]),
});

type Counter = { value: number; setValue: (n: number) => void; label: string };

const QtyStepper = ({ value, setValue, label }: Counter) => (
  <div>
    <Label className="text-primary font-semibold">{label}</Label>
    <div className="mt-2 inline-flex items-center gap-3 border border-border rounded-lg px-3 py-2 bg-background">
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        onClick={() => setValue(Math.max(0, value - 1))}
        className="w-8 h-8 rounded-md bg-secondary text-primary flex items-center justify-center hover:bg-secondary/70 transition-colors"
      >
        <Minus size={16} />
      </button>
      <span className="min-w-[2ch] text-center font-bold text-primary">
        {value}
      </span>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        onClick={() => setValue(Math.min(99, value + 1))}
        className="w-8 h-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
      >
        <Plus size={16} />
      </button>
    </div>
  </div>
);

const FreeTrialForm = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    brand_name: "",
    brand_website: "",
    social_facebook: "",
    social_instagram: "",
    social_other: "",
  });
  const [videoQty, setVideoQty] = useState(0);
  const [staticQty, setStaticQty] = useState(0);
  const [frequency, setFrequency] = useState<
    "daily" | "monthly" | "quarterly" | "yearly" | ""
  >("");

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const parsed = signupSchema.safeParse({
        ...form,
        video_quantity: videoQty,
        static_quantity: staticQty,
        frequency,
      });

      if (!parsed.success) {
        const first = parsed.error.issues[0];
        toast({
          title: "Please check the form",
          description: first.message,
          variant: "destructive",
        });
        return;
      }

      const d = parsed.data;
      const { error } = await supabase.from("free_trial_signups").insert({
        name: d.name,
        email: d.email,
        phone: d.phone,
        brand_name: d.brand_name,
        brand_website: d.brand_website || null,
        social_facebook: d.social_facebook || null,
        social_instagram: d.social_instagram || null,
        social_other: d.social_other || null,
        video_quantity: d.video_quantity,
        static_quantity: d.static_quantity,
        frequency: d.frequency,
      });

      if (error) throw error;

      toast({
        title: "Request submitted!",
        description: "We'll be in touch shortly to start your free trial.",
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        brand_name: "",
        brand_website: "",
        social_facebook: "",
        social_instagram: "",
        social_other: "",
      });
      setVideoQty(0);
      setStaticQty(0);
      setFrequency("");
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
      className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-lg text-left max-w-2xl mx-auto"
    >
      <h3 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">
        Start Your Free Trial
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input id="name" value={form.name} onChange={update("name")} required />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={update("email")}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={update("phone")}
            required
          />
        </div>
        <div>
          <Label htmlFor="brand_name">Brand Name *</Label>
          <Input
            id="brand_name"
            value={form.brand_name}
            onChange={update("brand_name")}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="brand_website">Brand Website (optional)</Label>
          <Input
            id="brand_website"
            type="url"
            placeholder="https://example.com"
            value={form.brand_website}
            onChange={update("brand_website")}
          />
        </div>
      </div>

      <div className="mt-6">
        <p className="text-primary font-semibold mb-3">
          Social Links (optional)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="social_facebook">Facebook</Label>
            <Input
              id="social_facebook"
              value={form.social_facebook}
              onChange={update("social_facebook")}
            />
          </div>
          <div>
            <Label htmlFor="social_instagram">Instagram</Label>
            <Input
              id="social_instagram"
              value={form.social_instagram}
              onChange={update("social_instagram")}
            />
          </div>
          <div>
            <Label htmlFor="social_other">Other</Label>
            <Input
              id="social_other"
              value={form.social_other}
              onChange={update("social_other")}
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-primary font-semibold mb-1">
          Future Service Plan After Free Trial
        </p>
        <p className="text-muted-foreground text-sm mb-4">
          Choose how many of each service you'd want and how often.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <QtyStepper
            label="Video Service"
            value={videoQty}
            setValue={setVideoQty}
          />
          <QtyStepper
            label="Static Service"
            value={staticQty}
            setValue={setStaticQty}
          />
        </div>

        <div className="mt-6">
          <Label htmlFor="frequency">Frequency *</Label>
          <Select
            value={frequency}
            onValueChange={(v) =>
              setFrequency(v as "daily" | "monthly" | "quarterly" | "yearly")
            }
          >
            <SelectTrigger id="frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="mt-8 w-full font-bold text-base py-6 rounded-lg"
      >
        {submitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};

export default FreeTrialForm;
