import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SocialAuthActions() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      <Button type="button" variant="outline" className="h-11 rounded-xl">
        <span className="text-base font-semibold">G</span>
      </Button>
      <Button type="button" variant="outline" className="h-11 rounded-xl">
        <Github className="h-4 w-4" />
      </Button>
    </div>
  );
}
