import { notFound } from "next/navigation";
import { trainingModules } from "@/components/onboarding/demo-data";
import { ModulePlayer } from "@/components/onboarding/ModulePlayer";

export function generateStaticParams() {
  return trainingModules.map((m) => ({ module: m.slug }));
}

export default async function TrainingModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: slug } = await params;
  const index = trainingModules.findIndex((m) => m.slug === slug);
  if (index === -1) notFound();
  return <ModulePlayer index={index} />;
}
