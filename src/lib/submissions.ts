import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { FormSubmission } from "@/lib/database.types";

export const submissionSchema = z
  .object({
    form: z.string().min(1),
    email: z.string().email(),
    language: z.string().optional(),
    level: z.string().optional(),
    goal: z.string().optional(),
    location: z.string().optional(),
  })
  .passthrough();

export type SubmissionInput = z.infer<typeof submissionSchema>;

export async function saveSubmission(
  input: SubmissionInput
): Promise<FormSubmission> {
  const supabase = createServiceRoleClient();

  const { form, email, ...data } = input;

  const { data: created, error } = await supabase
    .from("form_submissions")
    .insert({
      form_type: form,
      email,
      data,
      source: "landing_page",
    })
    .select("*")
    .single();

  if (error || !created) {
    throw error ?? new Error("Failed to save submission");
  }

  return created as FormSubmission;
}

export async function getSubmissions(
  limit: number = 50
): Promise<FormSubmission[]> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("form_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error("Error fetching form submissions:", error);
    return [];
  }

  return data as FormSubmission[];
}
