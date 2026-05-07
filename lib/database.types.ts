export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      households: {
        Row: {
          id: string;
          owner_id: string;
          type: string;
          member_count: number;
          child_count: number;
          withdrawal_rate: number;
          expected_annual_return: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          type: string;
          member_count: number;
          child_count: number;
          withdrawal_rate: number;
          expected_annual_return: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          type?: string;
          member_count?: number;
          child_count?: number;
          withdrawal_rate?: number;
          expected_annual_return?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      monthly_snapshots: {
        Row: {
          id: string;
          user_id: string;
          household_id: string | null;
          year_month: string;
          savings_rate: number;
          achievement_rate: number;
          fire_distance_months: number;
          target_year: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          household_id?: string | null;
          year_month: string;
          savings_rate: number;
          achievement_rate: number;
          fire_distance_months: number;
          target_year?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          household_id?: string | null;
          savings_rate?: number;
          achievement_rate?: number;
          fire_distance_months?: number;
          target_year?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      crews: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          type: 'family' | 'anonymous';
          fire_type: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          type: 'family' | 'anonymous';
          fire_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          type?: 'family' | 'anonymous';
          fire_type?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      crew_members: {
        Row: {
          crew_id: string;
          user_id: string;
          nickname: string;
          savings_rate: number;
          achievement_rate: number;
          target_year: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          crew_id: string;
          user_id: string;
          nickname: string;
          savings_rate: number;
          achievement_rate: number;
          target_year?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          nickname?: string;
          savings_rate?: number;
          achievement_rate?: number;
          target_year?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      crew_type: 'family' | 'anonymous';
    };
    CompositeTypes: Record<string, never>;
  };
};
