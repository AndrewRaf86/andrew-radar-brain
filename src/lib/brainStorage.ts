import { getSupabaseServerClient } from "@/lib/supabaseServer";

export function saveConversationMock(input: object): void {
  console.log("brain_conversation_mock", input);
}

export async function saveConversationSupabaseReady(input: object): Promise<void> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return;
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("brain_conversations").insert(input);
  if (error) {
    console.warn("brain_conversations insert skipped", error.message);
  }
}
