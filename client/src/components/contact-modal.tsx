import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Listing } from "@shared/schema";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

type ContactForm = z.infer<typeof contactSchema>;

interface ContactModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ listing, isOpen, onClose }: ContactModalProps) {
  const { toast } = useToast();
  
  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: listing ? `I'm interested in the property: ${listing.title}` : "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      return apiRequest("POST", "/api/contact", {
        ...data,
        listingId: listing?.id,
      });
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "The seller will contact you soon.",
      });
      form.reset();
      onClose();
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactForm) => {
    contactMutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!listing) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md" data-testid="contact-modal">
        <DialogHeader>
          <DialogTitle data-testid="contact-modal-title">Contact Seller</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="Enter your name"
              data-testid="contact-name-input"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600 mt-1" data-testid="contact-name-error">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              placeholder="Enter your email"
              data-testid="contact-email-input"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600 mt-1" data-testid="contact-email-error">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              {...form.register("phone")}
              placeholder="Enter your phone number"
              data-testid="contact-phone-input"
            />
          </div>
          
          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              {...form.register("message")}
              rows={4}
              placeholder="I'm interested in this property..."
              className="resize-none"
              data-testid="contact-message-input"
            />
            {form.formState.errors.message && (
              <p className="text-sm text-red-600 mt-1" data-testid="contact-message-error">
                {form.formState.errors.message.message}
              </p>
            )}
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              data-testid="contact-cancel-button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={contactMutation.isPending}
              data-testid="contact-submit-button"
            >
              {contactMutation.isPending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
