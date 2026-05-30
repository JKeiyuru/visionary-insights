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
      matches: {
        Row: {
          away_score: number | null
          away_team: string
          created_at: string
          home_score: number | null
          home_team: string
          id: string
          kickoff_at: string
          league: string | null
          sport: string
          status: string
        }
        Insert: {
          away_score?: number | null
          away_team: string
          created_at?: string
          home_score?: number | null
          home_team: string
          id?: string
          kickoff_at: string
          league?: string | null
          sport: string
          status?: string
        }
        Update: {
          away_score?: number | null
          away_team?: string
          created_at?: string
          home_score?: number | null
          home_team?: string
          id?: string
          kickoff_at?: string
          league?: string | null
          sport?: string
          status?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_kes: number
          created_at: string
          id: string
          phone: string | null
          plan: string
          provider: string
          reference: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_kes: number
          created_at?: string
          id?: string
          phone?: string | null
          plan: string
          provider: string
          reference?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_kes?: number
          created_at?: string
          id?: string
          phone?: string | null
          plan?: string
          provider?: string
          reference?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          active: boolean
          amount_kes: number
          featured: boolean
          features: Json
          id: string
          name: string
          period: string
          price_label: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          amount_kes?: number
          featured?: boolean
          features?: Json
          id?: string
          name: string
          period: string
          price_label: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          amount_kes?: number
          featured?: boolean
          features?: Json
          id?: string
          name?: string
          period?: string
          price_label?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      predictions: {
        Row: {
          away_win_prob: number
          confidence: number
          created_at: string
          draw_prob: number
          home_win_prob: number
          id: string
          match_id: string
          predicted_outcome: string
          premium: boolean
          reasoning: string | null
        }
        Insert: {
          away_win_prob: number
          confidence: number
          created_at?: string
          draw_prob: number
          home_win_prob: number
          id?: string
          match_id: string
          predicted_outcome: string
          premium?: boolean
          reasoning?: string | null
        }
        Update: {
          away_win_prob?: number
          confidence?: number
          created_at?: string
          draw_prob?: number
          home_win_prob?: number
          id?: string
          match_id?: string
          predicted_outcome?: string
          premium?: boolean
          reasoning?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "predictions_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accuracy: number
          avatar_url: string | null
          correct_count: number
          country_code: string | null
          created_at: string
          display_name: string | null
          forecasts_count: number
          id: string
          is_banned: boolean
          is_suspended: boolean
          phone: string | null
          phone_verified: boolean
          subscription_expires_at: string | null
          subscription_plan: string
          tier: string
          updated_at: string
          username: string | null
        }
        Insert: {
          accuracy?: number
          avatar_url?: string | null
          correct_count?: number
          country_code?: string | null
          created_at?: string
          display_name?: string | null
          forecasts_count?: number
          id: string
          is_banned?: boolean
          is_suspended?: boolean
          phone?: string | null
          phone_verified?: boolean
          subscription_expires_at?: string | null
          subscription_plan?: string
          tier?: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          accuracy?: number
          avatar_url?: string | null
          correct_count?: number
          country_code?: string | null
          created_at?: string
          display_name?: string | null
          forecasts_count?: number
          id?: string
          is_banned?: boolean
          is_suspended?: boolean
          phone?: string | null
          phone_verified?: boolean
          subscription_expires_at?: string | null
          subscription_plan?: string
          tier?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      site_content: {
        Row: {
          body: string
          id: string
          key: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          body: string
          id?: string
          key: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          body?: string
          id?: string
          key?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      user_forecasts: {
        Row: {
          confidence: number | null
          correct: boolean | null
          created_at: string
          id: string
          match_id: string
          predicted_outcome: string
          user_id: string
        }
        Insert: {
          confidence?: number | null
          correct?: boolean | null
          created_at?: string
          id?: string
          match_id: string
          predicted_outcome: string
          user_id: string
        }
        Update: {
          confidence?: number | null
          correct?: boolean | null
          created_at?: string
          id?: string
          match_id?: string
          predicted_outcome?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_forecasts_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "super_admin"
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
      app_role: ["admin", "moderator", "user", "super_admin"],
    },
  },
} as const
