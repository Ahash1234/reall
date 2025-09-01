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
import { useTranslation } from "react-i18next";

const contactSchema = z.object({
  name: z.string().min(1, "requiredField"),
  email: z.string().email("invalidEmail"),
  phone: z.string().optional(),
  message: z.string().min(1, "requiredField"),
});

type ContactForm = z.infer<typeof contactSchema>;

interface ContactModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ listing, isOpen, onClose }: ContactModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: listing ? `${t("message")}: ${listing.title}` : "",
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
        title: t("contactSent"),
        description: t("sellerWillContact"),
      });
      form.reset();
      onClose();
    },
    onError: () => {
      toast({
        title: t("contactError"),
        description: t("tryAgainLater"),
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
          <DialogTitle data-testid="contact-modal-title">{t("contactSeller")}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">{t("name")} *</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder={t("name")}
              data-testid="contact-name-input"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600 mt-1" data-testid="contact-name-error">
                {t(form.formState.errors.name.message as keyof typeof t)}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="email">{t("email")} *</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              placeholder={t("email")}
              data-testid="contact-email-input"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600 mt-1" data-testid="contact-email-error">
                {t(form.formState.errors.email.message as keyof typeof t)}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="phone">{t("phone")}</Label>
            <Input
              id="phone"
              type="tel"
              {...form.register("phone")}
              placeholder={t("phone")}
              data-testid="contact-phone-input"
            />
          </div>
          
          <div>
            <Label htmlFor="message">{t("message")} *</Label>
            <Textarea
              id="message"
              {...form.register("message")}
              rows={4}
              placeholder={t("message")}
              className="resize-none"
              data-testid="contact-message-input"
            />
            {form.formState.errors.message && (
              <p className="text-sm text-red-600 mt-1" data-testid="contact-message-error">
                {t(form.formState.errors.message.message as keyof typeof t)}
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
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={contactMutation.isPending}
              data-testid="contact-submit-button"
            >
              {contactMutation.isPending ? t("sending") : t("sendMessage")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
