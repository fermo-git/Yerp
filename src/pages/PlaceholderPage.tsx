import { EmptyState } from "@/components/ui/EmptyState";

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="container-frontera py-20">
      <EmptyState
        title={title}
        description="Esta sección se construye en la siguiente iteración del proyecto."
      />
    </div>
  );
}
