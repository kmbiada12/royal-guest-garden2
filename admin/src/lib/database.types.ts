export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      amenities: {
        Row: {
          id: string
          label: Json
          published: boolean
          sort_order: number
        }
        Insert: {
          id: string
          label: Json
          published?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          label?: Json
          published?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          diff: Json | null
          id: number
          record_id: string
          table_name: string
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          diff?: Json | null
          id?: never
          record_id?: string
          table_name: string
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          diff?: Json | null
          id?: never
          record_id?: string
          table_name?: string
        }
        Relationships: []
      }
      benefit_groups: {
        Row: {
          id: number
          published: boolean
          sort_order: number
          title: Json
        }
        Insert: {
          id?: never
          published?: boolean
          sort_order?: number
          title: Json
        }
        Update: {
          id?: never
          published?: boolean
          sort_order?: number
          title?: Json
        }
        Relationships: []
      }
      benefits: {
        Row: {
          group_id: number
          icon: string
          id: number
          published: boolean
          sort_order: number
          text: Json
          title: Json
        }
        Insert: {
          group_id: number
          icon: string
          id?: never
          published?: boolean
          sort_order?: number
          text: Json
          title: Json
        }
        Update: {
          group_id?: number
          icon?: string
          id?: never
          published?: boolean
          sort_order?: number
          text?: Json
          title?: Json
        }
        Relationships: [
          {
            foreignKeyName: "benefits_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "benefit_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_requests: {
        Row: {
          adults: number
          check_in: string
          check_out: string
          children: number
          created_at: string
          estimated_total: number
          guest_lang: string
          guest_name: string
          guest_phone: string
          id: string
          internal_notes: string | null
          message: string
          nightly_rate: number
          nights: number
          reference: string
          room_id: string | null
          room_snapshot: Json
          rooms: number
          special_requests: string | null
          status: string
          updated_at: string
        }
        Insert: {
          adults: number
          check_in: string
          check_out: string
          children?: number
          created_at?: string
          estimated_total: number
          guest_lang?: string
          guest_name: string
          guest_phone: string
          id?: string
          internal_notes?: string | null
          message: string
          nightly_rate: number
          nights: number
          reference: string
          room_id?: string | null
          room_snapshot: Json
          rooms?: number
          special_requests?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          adults?: number
          check_in?: string
          check_out?: string
          children?: number
          created_at?: string
          estimated_total?: number
          guest_lang?: string
          guest_name?: string
          guest_phone?: string
          id?: string
          internal_notes?: string | null
          message?: string
          nightly_rate?: number
          nights?: number
          reference?: string
          room_id?: string | null
          room_snapshot?: Json
          rooms?: number
          special_requests?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_requests_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      email_outbox: {
        Row: {
          attempts: number
          created_at: string
          id: string
          idempotency_key: string
          last_error: string | null
          payload: Json
          recipient: string
          reply_to: string | null
          resend_message_id: string | null
          sent_at: string | null
          status: string
          template: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          id?: string
          idempotency_key: string
          last_error?: string | null
          payload?: Json
          recipient: string
          reply_to?: string | null
          resend_message_id?: string | null
          sent_at?: string | null
          status?: string
          template: string
        }
        Update: {
          attempts?: number
          created_at?: string
          id?: string
          idempotency_key?: string
          last_error?: string | null
          payload?: Json
          recipient?: string
          reply_to?: string | null
          resend_message_id?: string | null
          sent_at?: string | null
          status?: string
          template?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          created_at: string
          email: string | null
          guest_lang: string
          id: string
          message: string
          name: string
          phone: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          guest_lang?: string
          id?: string
          message: string
          name: string
          phone: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          guest_lang?: string
          id?: string
          message?: string
          name?: string
          phone?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          caption: Json
          id: number
          image: string
          published: boolean
          sort_order: number
        }
        Insert: {
          caption: Json
          id?: never
          image: string
          published?: boolean
          sort_order?: number
        }
        Update: {
          caption?: Json
          id?: never
          image?: string
          published?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      guest_experiences: {
        Row: {
          audience: Json
          icon: string
          id: number
          published: boolean
          sort_order: number
          text: Json
        }
        Insert: {
          audience: Json
          icon: string
          id?: never
          published?: boolean
          sort_order?: number
          text: Json
        }
        Update: {
          audience?: Json
          icon?: string
          id?: never
          published?: boolean
          sort_order?: number
          text?: Json
        }
        Relationships: []
      }
      hotel_values: {
        Row: {
          id: number
          published: boolean
          sort_order: number
          text: Json
          title: Json
        }
        Insert: {
          id?: never
          published?: boolean
          sort_order?: number
          text: Json
          title: Json
        }
        Update: {
          id?: never
          published?: boolean
          sort_order?: number
          text?: Json
          title?: Json
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          guest_lang: string
          id: string
          name: string
          phone: string
          question: string | null
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          guest_lang?: string
          id?: string
          name: string
          phone: string
          question?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          guest_lang?: string
          id?: string
          name?: string
          phone?: string
          question?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          count: number
          key: string
          window_start: string
        }
        Insert: {
          count?: number
          key: string
          window_start?: string
        }
        Update: {
          count?: number
          key?: string
          window_start?: string
        }
        Relationships: []
      }
      reference_counters: {
        Row: {
          last_value: number
          year: number
        }
        Insert: {
          last_value?: number
          year: number
        }
        Update: {
          last_value?: number
          year?: number
        }
        Relationships: []
      }
      room_categories: {
        Row: {
          id: string
          label: Json
          published: boolean
          sort_order: number
        }
        Insert: {
          id: string
          label: Json
          published?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          label?: Json
          published?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      rooms: {
        Row: {
          amenity_ids: string[]
          beds: Json
          breakfast_included: boolean
          breakfast_note: Json
          cancellation: Json
          capacity: number
          category_id: string
          description: Json
          featured: boolean
          floor: Json
          id: string
          images: string[]
          name: string
          price: number
          published: boolean
          ref: string
          short: Json
          size: number
          sort_order: number
          tax_included: boolean
          tax_note: Json
          view: Json
        }
        Insert: {
          amenity_ids?: string[]
          beds: Json
          breakfast_included?: boolean
          breakfast_note: Json
          cancellation: Json
          capacity: number
          category_id: string
          description: Json
          featured?: boolean
          floor: Json
          id: string
          images: string[]
          name: string
          price: number
          published?: boolean
          ref: string
          short: Json
          size: number
          sort_order?: number
          tax_included?: boolean
          tax_note: Json
          view: Json
        }
        Update: {
          amenity_ids?: string[]
          beds?: Json
          breakfast_included?: boolean
          breakfast_note?: Json
          cancellation?: Json
          capacity?: number
          category_id?: string
          description?: Json
          featured?: boolean
          floor?: Json
          id?: string
          images?: string[]
          name?: string
          price?: number
          published?: boolean
          ref?: string
          short?: Json
          size?: number
          sort_order?: number
          tax_included?: boolean
          tax_note?: Json
          view?: Json
        }
        Relationships: [
          {
            foreignKeyName: "rooms_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "room_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          details: Json
          hours: Json
          icon: string
          id: string
          image: string
          inquiry: string
          pricing: Json
          published: boolean
          short: Json
          sort_order: number
          title: Json
        }
        Insert: {
          details?: Json
          hours: Json
          icon: string
          id: string
          image: string
          inquiry: string
          pricing: Json
          published?: boolean
          short: Json
          sort_order?: number
          title: Json
        }
        Update: {
          details?: Json
          hours?: Json
          icon?: string
          id?: string
          image?: string
          inquiry?: string
          pricing?: Json
          published?: boolean
          short?: Json
          sort_order?: number
          title?: Json
        }
        Relationships: []
      }
      settings: {
        Row: {
          booking: Json
          currency: Json
          demo: Json
          hero_images: Json
          hotel: Json
          id: number
          updated_at: string
          whatsapp: Json
        }
        Insert: {
          booking: Json
          currency: Json
          demo: Json
          hero_images: Json
          hotel: Json
          id?: number
          updated_at?: string
          whatsapp: Json
        }
        Update: {
          booking?: Json
          currency?: Json
          demo?: Json
          hero_images?: Json
          hotel?: Json
          id?: number
          updated_at?: string
          whatsapp?: Json
        }
        Relationships: []
      }
      staff: {
        Row: {
          created_at: string
          invited_by: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          invited_by?: string | null
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          invited_by?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["user_id"]
          },
        ]
      }
      team_members: {
        Row: {
          bio: Json
          id: number
          image: string
          name: Json
          published: boolean
          role: Json
          sort_order: number
        }
        Insert: {
          bio: Json
          id?: never
          image: string
          name: Json
          published?: boolean
          role: Json
          sort_order?: number
        }
        Update: {
          bio?: Json
          id?: never
          image?: string
          name?: Json
          published?: boolean
          role?: Json
          sort_order?: number
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author: Json
          id: number
          meta: Json
          published: boolean
          quote: Json
          rating: number
          sort_order: number
        }
        Insert: {
          author: Json
          id?: never
          meta: Json
          published?: boolean
          quote: Json
          rating: number
          sort_order?: number
        }
        Update: {
          author?: Json
          id?: never
          meta?: Json
          published?: boolean
          quote?: Json
          rating?: number
          sort_order?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      are_safe_image_values: { Args: { v: Json }; Returns: boolean }
      are_safe_images: { Args: { list: string[] }; Returns: boolean }
      current_staff_role: { Args: never; Returns: string }
      get_site: { Args: never; Returns: Json }
      is_admin: { Args: never; Returns: boolean }
      is_editor: { Args: never; Returns: boolean }
      is_i18n_list: { Args: { v: Json }; Returns: boolean }
      is_i18n_text: { Args: { v: Json }; Returns: boolean }
      is_safe_https_url: { Args: { u: string }; Returns: boolean }
      is_safe_image: { Args: { u: string }; Returns: boolean }
      is_valid_pricing: { Args: { v: Json }; Returns: boolean }
      mfa_satisfied: { Args: never; Returns: boolean }
      purge_audit_log: { Args: { retention?: string }; Returns: number }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
