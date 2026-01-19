import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface KnowledgeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText?: string;
  comingSoon?: boolean;
  disabled?: boolean;
  to?: string;
}

const KnowledgeCard = ({
  icon,
  title,
  description,
  linkText,
  comingSoon = false,
  disabled = false,
  to,
}: KnowledgeCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!disabled && to) {
      navigate(to);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group relative rounded-xl border border-border bg-card p-6 transition-all duration-300",
        !disabled && "cursor-pointer hover:border-primary/40 hover:bg-card-hover card-glow",
        disabled && "opacity-60 cursor-not-allowed"
      )}
    >
      {/* Icon */}
      <div className={cn(
        "mb-4 flex h-12 w-12 items-center justify-center rounded-lg",
        !disabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
      )}>
        {icon}
      </div>

      {/* Title with arrow */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className={cn(
          "text-lg font-semibold",
          !disabled ? "text-primary" : "text-muted-foreground"
        )}>
          {title}
        </h3>
        <ChevronRight className={cn(
          "h-5 w-5 transition-transform duration-300",
          !disabled ? "text-muted-foreground group-hover:translate-x-1 group-hover:text-primary" : "text-muted-foreground/50"
        )} />
      </div>

      {/* Description */}
      <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Link or Coming Soon */}
      {comingSoon ? (
        <span className="text-sm font-medium text-warning">Coming soon</span>
      ) : linkText ? (
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
          <span className="mr-1">📘</span>
          {linkText}
        </span>
      ) : null}
    </div>
  );
};

export default KnowledgeCard;
