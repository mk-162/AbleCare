"use client";

import { useTina } from "tinacms/dist/react";
import { BlockRenderer } from "./BlockRenderer";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface EditorialPageClientProps {
  query: string;
  variables: Record<string, any>;
  data: any;
}

export function EditorialPageClient({ query, variables, data: initialData }: EditorialPageClientProps) {
  const { data } = useTina({ query, variables, data: initialData });

  // Navigate the data object to find the first collection result
  const collectionKey = Object.keys(data).find(
    (k) => k !== "__typename" && data[k]
  );
  const page = collectionKey ? data[collectionKey] : null;
  const blocks = page?.blocks || [];

  return <BlockRenderer blocks={blocks} />;
}
