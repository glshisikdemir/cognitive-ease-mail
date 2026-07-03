export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agent_runs: {
        Row: {
          agent: Database["public"]["Enums"]["task_agent"]
          created_at: string
          error: string | null
          id: string
          output: Json | null
          status: string
          task_id: string
          user_id: string
        }
        Insert: {
          agent: Database["public"]["Enums"]["task_agent"]
          created_at?: string
          error?: string | null
          id?: string
          output?: Json | null
          status?: string
          task_id: string
          user_id: string
        }
        Update: {
          agent?: Database["public"]["Enums"]["task_agent"]
          created_at?: string
          error?: string | null
          id?: string
          output?: Json | null
          status?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_runs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      decisions: {
        Row: {
          action_payload: Json
          alternatives: Json
          approval_reason: string | null
          approved_by: string | null
          business_impact: string | null
          category: Database["public"]["Enums"]["autonomy_category"]
          confidence: number | null
          created_at: string
          do_nothing_outcome: string | null
          evidence: Json
          executed_at: string | null
          expires_at: string | null
          financial_impact: string | null
          id: string
          initiated_by: string | null
          level: Database["public"]["Enums"]["autonomy_level"]
          outcome: string | null
          proposed_by: string
          reasoning: string | null
          recommendation: string
          risk: Database["public"]["Enums"]["risk_level"]
          status: Database["public"]["Enums"]["decision_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_payload?: Json
          alternatives?: Json
          approval_reason?: string | null
          approved_by?: string | null
          business_impact?: string | null
          category: Database["public"]["Enums"]["autonomy_category"]
          confidence?: number | null
          created_at?: string
          do_nothing_outcome?: string | null
          evidence?: Json
          executed_at?: string | null
          expires_at?: string | null
          financial_impact?: string | null
          id?: string
          initiated_by?: string | null
          level: Database["public"]["Enums"]["autonomy_level"]
          outcome?: string | null
          proposed_by?: string
          reasoning?: string | null
          recommendation: string
          risk?: Database["public"]["Enums"]["risk_level"]
          status?: Database["public"]["Enums"]["decision_status"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_payload?: Json
          alternatives?: Json
          approval_reason?: string | null
          approved_by?: string | null
          business_impact?: string | null
          category?: Database["public"]["Enums"]["autonomy_category"]
          confidence?: number | null
          created_at?: string
          do_nothing_outcome?: string | null
          evidence?: Json
          executed_at?: string | null
          expires_at?: string | null
          financial_impact?: string | null
          id?: string
          initiated_by?: string | null
          level?: Database["public"]["Enums"]["autonomy_level"]
          outcome?: string | null
          proposed_by?: string
          reasoning?: string | null
          recommendation?: string
          risk?: Database["public"]["Enums"]["risk_level"]
          status?: Database["public"]["Enums"]["decision_status"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      objectives: {
        Row: {
          created_at: string
          id: string
          language: Database["public"]["Enums"]["objective_lang"]
          source: Database["public"]["Enums"]["objective_source"]
          status: Database["public"]["Enums"]["objective_status"]
          summary: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language?: Database["public"]["Enums"]["objective_lang"]
          source?: Database["public"]["Enums"]["objective_source"]
          status?: Database["public"]["Enums"]["objective_status"]
          summary?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: Database["public"]["Enums"]["objective_lang"]
          source?: Database["public"]["Enums"]["objective_source"]
          status?: Database["public"]["Enums"]["objective_status"]
          summary?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      permission_settings: {
        Row: {
          category: Database["public"]["Enums"]["autonomy_category"]
          created_at: string
          id: string
          level: Database["public"]["Enums"]["autonomy_level"]
          updated_at: string
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["autonomy_category"]
          created_at?: string
          id?: string
          level?: Database["public"]["Enums"]["autonomy_level"]
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["autonomy_category"]
          created_at?: string
          id?: string
          level?: Database["public"]["Enums"]["autonomy_level"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          agent: Database["public"]["Enums"]["task_agent"]
          created_at: string
          decision_id: string | null
          depends_on: Json
          description: string | null
          id: string
          objective_id: string
          order_index: number
          payload: Json
          requires_approval: boolean
          result: Json | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          type: Database["public"]["Enums"]["task_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          agent?: Database["public"]["Enums"]["task_agent"]
          created_at?: string
          decision_id?: string | null
          depends_on?: Json
          description?: string | null
          id?: string
          objective_id: string
          order_index?: number
          payload?: Json
          requires_approval?: boolean
          result?: Json | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          type?: Database["public"]["Enums"]["task_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          agent?: Database["public"]["Enums"]["task_agent"]
          created_at?: string
          decision_id?: string | null
          depends_on?: Json
          description?: string | null
          id?: string
          objective_id?: string
          order_index?: number
          payload?: Json
          requires_approval?: boolean
          result?: Json | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          type?: Database["public"]["Enums"]["task_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "objectives"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist_signups: {
        Row: {
          company: string | null
          confirmation_sent_at: string | null
          created_at: string
          email: string
          id: string
          ip_hash: string | null
          language: Database["public"]["Enums"]["waitlist_lang"]
          name: string | null
          notes: string | null
          onboarding_status: Database["public"]["Enums"]["waitlist_onboarding_status"]
          role: string | null
          source: string
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          company?: string | null
          confirmation_sent_at?: string | null
          created_at?: string
          email: string
          id?: string
          ip_hash?: string | null
          language?: Database["public"]["Enums"]["waitlist_lang"]
          name?: string | null
          notes?: string | null
          onboarding_status?: Database["public"]["Enums"]["waitlist_onboarding_status"]
          role?: string | null
          source?: string
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          company?: string | null
          confirmation_sent_at?: string | null
          created_at?: string
          email?: string
          id?: string
          ip_hash?: string | null
          language?: Database["public"]["Enums"]["waitlist_lang"]
          name?: string | null
          notes?: string | null
          onboarding_status?: Database["public"]["Enums"]["waitlist_onboarding_status"]
          role?: string | null
          source?: string
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      autonomy_category:
        | "marketing"
        | "sales"
        | "finance"
        | "legal"
        | "calendar"
        | "email_followup"
        | "pricing"
        | "contracts"
        | "data"
      autonomy_level:
        | "level1_autonomous"
        | "level2_silent"
        | "level3_approval"
        | "level4_strategic"
      decision_status:
        | "pending"
        | "approved"
        | "rejected"
        | "executed"
        | "undone"
        | "expired"
      objective_lang: "en" | "tr"
      objective_source: "voice" | "text"
      objective_status:
        | "planning"
        | "active"
        | "paused"
        | "completed"
        | "archived"
      risk_level: "low" | "medium" | "high" | "critical"
      task_agent:
        | "research"
        | "sales"
        | "email"
        | "crm"
        | "calendar"
        | "analytics"
        | "knowledge"
        | "decision"
        | "planner"
      task_status:
        | "pending"
        | "ready"
        | "running"
        | "blocked"
        | "awaiting_approval"
        | "done"
        | "failed"
        | "skipped"
      task_type:
        | "research"
        | "find"
        | "enrich"
        | "score"
        | "segment"
        | "message"
        | "approve"
        | "send"
        | "track"
        | "learn"
        | "other"
      waitlist_lang: "en" | "tr"
      waitlist_onboarding_status:
        | "pending"
        | "invited"
        | "onboarded"
        | "declined"
        | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      autonomy_category: [
        "marketing",
        "sales",
        "finance",
        "legal",
        "calendar",
        "email_followup",
        "pricing",
        "contracts",
        "data",
      ],
      autonomy_level: [
        "level1_autonomous",
        "level2_silent",
        "level3_approval",
        "level4_strategic",
      ],
      decision_status: [
        "pending",
        "approved",
        "rejected",
        "executed",
        "undone",
        "expired",
      ],
      objective_lang: ["en", "tr"],
      objective_source: ["voice", "text"],
      objective_status: [
        "planning",
        "active",
        "paused",
        "completed",
        "archived",
      ],
      risk_level: ["low", "medium", "high", "critical"],
      task_agent: [
        "research",
        "sales",
        "email",
        "crm",
        "calendar",
        "analytics",
        "knowledge",
        "decision",
        "planner",
      ],
      task_status: [
        "pending",
        "ready",
        "running",
        "blocked",
        "awaiting_approval",
        "done",
        "failed",
        "skipped",
      ],
      task_type: [
        "research",
        "find",
        "enrich",
        "score",
        "segment",
        "message",
        "approve",
        "send",
        "track",
        "learn",
        "other",
      ],
      waitlist_lang: ["en", "tr"],
      waitlist_onboarding_status: [
        "pending",
        "invited",
        "onboarded",
        "declined",
        "archived",
      ],
    },
  },
} as const
