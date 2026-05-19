import { supabase } from "@/lib/supabase";

export function saveConversationMock(input: object): void {
  console.log("brain_conversation_mock", input);
}

export async function saveConversationSupabaseReady(input: object): Promise<void> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return;
  }

  if (!supabase) return;

  const { error } = await supabase.from("brain_conversations").insert(input);
  if (error) {
    console.warn("brain_conversations insert skipped", error.message);
  }
}
