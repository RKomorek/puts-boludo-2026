/**
 * Tipos gerados manualmente na Fase 0.
 * Na Fase 1 serão substituídos/alinhados com o schema Supabase real.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type MatchStatus = "scheduled" | "live" | "finished" | "postponed";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          avatar_url?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          avatar_url?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      matches: {
        Row: {
          id: string;
          home_team: string;
          away_team: string;
          kickoff_at: string;
          home_score: number | null;
          away_score: number | null;
          status: MatchStatus;
          stage: string;
          external_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          home_team: string;
          away_team: string;
          kickoff_at: string;
          home_score?: number | null;
          away_score?: number | null;
          status?: MatchStatus;
          stage: string;
          external_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          home_team?: string;
          away_team?: string;
          kickoff_at?: string;
          home_score?: number | null;
          away_score?: number | null;
          status?: MatchStatus;
          stage?: string;
          external_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      predictions: {
        Row: {
          id: string;
          user_id: string;
          match_id: string;
          home_score: number;
          away_score: number;
          points: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          match_id: string;
          home_score: number;
          away_score: number;
          points?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          match_id?: string;
          home_score?: number;
          away_score?: number;
          points?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      settings: {
        Row: {
          id: string;
          exact_score_points: number;
          correct_winner_points: number;
          predictions_visible: "always" | "after_kickoff";
          invite_code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          exact_score_points?: number;
          correct_winner_points?: number;
          predictions_visible?: "always" | "after_kickoff";
          invite_code: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          exact_score_points?: number;
          correct_winner_points?: number;
          predictions_visible?: "always" | "after_kickoff";
          invite_code?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
