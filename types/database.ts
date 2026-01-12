export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            hotels: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    primary_color: string
                    logo: string | null
                    address: string | null
                    phone: string | null
                    email: string | null
                    description: string | null
                    welcome_message: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    primary_color?: string
                    logo?: string | null
                    address?: string | null
                    phone?: string | null
                    email?: string | null
                    description?: string | null
                    welcome_message?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    primary_color?: string
                    logo?: string | null
                    address?: string | null
                    phone?: string | null
                    email?: string | null
                    description?: string | null
                    welcome_message?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            links: {
                Row: {
                    id: string
                    hotel_id: string
                    title: string
                    url: string
                    description: string | null
                    icon: string | null
                    category: string
                    order_index: number
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    hotel_id: string
                    title: string
                    url: string
                    description?: string | null
                    icon?: string | null
                    category: string
                    order_index: number
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    hotel_id?: string
                    title?: string
                    url?: string
                    description?: string | null
                    icon?: string | null
                    category?: string
                    order_index?: number
                    is_active?: boolean
                    created_at?: string
                }
            }
        }
    }
}
