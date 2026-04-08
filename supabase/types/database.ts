// Generated types placeholder (T017).
// In a real setup this file should be generated via Supabase CLI (types gen).

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          sensory_level: 'beginner' | 'advanced' | 'expert';
          following_roaster_ids: string[];
          created_at: string;
          updated_at: string;
        };
      };
      roasters: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          country: string | null;
          city: string | null;
          description: string | null;
          website: string | null;
          logo_url: string | null;
          verification_status: 'pending' | 'verified' | 'revoked';
          created_at: string;
          updated_at: string;
        };
      };
      coffees: {
        Row: {
          id: string;
          roaster_id: string;
          origin_id: string | null;
          name: string;
          variety: string | null;
          processing_method:
            | 'washed'
            | 'natural'
            | 'honey'
            | 'anaerobic'
            | 'wet-hulled'
            | 'other'
            | null;
          producer_notes: string | null;
          status: 'draft' | 'active' | 'archived';
          cover_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      roast_batches: {
        Row: {
          id: string;
          coffee_id: string;
          roast_date: string;
          lot_number: string;
          status: 'active' | 'archived';
          brewing_notes: string | null;
          roaster_story: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      qr_codes: {
        Row: {
          id: string;
          batch_id: string;
          hash: string;
          qr_url: string;
          svg_storage_path: string;
          png_storage_path: string;
          generated_at: string;
        };
      };
      brew_methods: {
        Row: {
          id: string;
          name: string;
          sort_order: number;
        };
      };
      flavor_notes: {
        Row: {
          id: string;
          name: string;
          label: string;
          category: string;
          sort_order: number;
        };
      };
      coffee_logs: {
        Row: {
          id: string;
          user_id: string;
          batch_id: string;
          rating: number;
          brew_method_id: string | null;
          brew_time_seconds: number | null;
          free_text_notes: string | null;
          logged_at: string;
          created_at: string;
          updated_at: string;
        };
      };
      tasting_notes: {
        Row: {
          id: string;
          coffee_log_id: string;
          flavor_note_id: string;
          created_at: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          coffee_log_id: string;
          body: string;
          created_at: string;
          updated_at: string;
        };
      };
      review_votes: {
        Row: {
          id: string;
          review_id: string;
          user_id: string;
          value: number;
          created_at: string;
        };
      };
      coffee_stats: {
        Row: {
          batch_id: string;
          total_count: number;
          avg_rating: number;
          rating_distribution: Record<string, number>;
          top_flavor_notes: string[];
          created_at: string;
          updated_at: string;
        };
      };
      origins: {
        Row: {
          id: string;
          country: string;
          region: string | null;
          farm: string | null;
          altitude_min: number | null;
          altitude_max: number | null;
          producer: string | null;
          created_at: string;
        };
      };
    };
  };
};

