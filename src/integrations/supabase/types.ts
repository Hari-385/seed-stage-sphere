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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      investment_decisions: {
        Row: {
          created_at: string
          feedback: string | null
          granted_amount: number | null
          id: string
          investor_id: string
          pitch_analysis_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          granted_amount?: number | null
          id?: string
          investor_id: string
          pitch_analysis_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          feedback?: string | null
          granted_amount?: number | null
          id?: string
          investor_id?: string
          pitch_analysis_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "investment_decisions_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_decisions_pitch_analysis_id_fkey"
            columns: ["pitch_analysis_id"]
            isOneToOne: false
            referencedRelation: "pitch_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      pitch_analyses: {
        Row: {
          analysis_status: string
          category: string | null
          competitive_advantage_score: number | null
          created_at: string
          file_name: string
          file_path: string
          financial_health_score: number | null
          financial_summary: string | null
          id: string
          investment_recommendation: string | null
          key_concerns: string[] | null
          key_strengths: string[] | null
          market_insights: string | null
          market_size_score: number | null
          overall_score: number | null
          pitch_description: string | null
          product_viability_score: number | null
          required_amount: string | null
          risk_factors: string[] | null
          startup_id: string
          team_analysis: string | null
          team_strength_score: number | null
          title: string | null
          updated_at: string
          uploaded_at: string
        }
        Insert: {
          analysis_status?: string
          category?: string | null
          competitive_advantage_score?: number | null
          created_at?: string
          file_name: string
          file_path: string
          financial_health_score?: number | null
          financial_summary?: string | null
          id?: string
          investment_recommendation?: string | null
          key_concerns?: string[] | null
          key_strengths?: string[] | null
          market_insights?: string | null
          market_size_score?: number | null
          overall_score?: number | null
          pitch_description?: string | null
          product_viability_score?: number | null
          required_amount?: string | null
          risk_factors?: string[] | null
          startup_id: string
          team_analysis?: string | null
          team_strength_score?: number | null
          title?: string | null
          updated_at?: string
          uploaded_at?: string
        }
        Update: {
          analysis_status?: string
          category?: string | null
          competitive_advantage_score?: number | null
          created_at?: string
          file_name?: string
          file_path?: string
          financial_health_score?: number | null
          financial_summary?: string | null
          id?: string
          investment_recommendation?: string | null
          key_concerns?: string[] | null
          key_strengths?: string[] | null
          market_insights?: string | null
          market_size_score?: number | null
          overall_score?: number | null
          pitch_description?: string | null
          product_viability_score?: number | null
          required_amount?: string | null
          risk_factors?: string[] | null
          startup_id?: string
          team_analysis?: string | null
          team_strength_score?: number | null
          title?: string | null
          updated_at?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pitch_analyses_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          investment_focus: string[] | null
          max_investment_amount: number | null
          min_investment_amount: number | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id: string
          investment_focus?: string[] | null
          max_investment_amount?: number | null
          min_investment_amount?: number | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          investment_focus?: string[] | null
          max_investment_amount?: number | null
          min_investment_amount?: number | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_startups: {
        Row: {
          created_at: string
          id: string
          startup_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          startup_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          startup_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_startups_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_startups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      startups: {
        Row: {
          created_at: string
          description: string
          domain: string
          funding: string
          id: string
          logo: string
          name: string
          stage: string
          tags: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          domain: string
          funding: string
          id?: string
          logo?: string
          name: string
          stage: string
          tags?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          domain?: string
          funding?: string
          id?: string
          logo?: string
          name?: string
          stage?: string
          tags?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "startups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role:
        | {
            Args: {
              _role: Database["public"]["Enums"]["app_role"]
              _user_id: string
            }
            Returns: boolean
          }
        | { Args: { _role: string; _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "founder" | "investor"
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
      app_role: ["founder", "investor"],
    },
  },
} as const
