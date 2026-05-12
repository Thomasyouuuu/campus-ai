# Database Schema Draft

## profiles

- id uuid primary key
- user_id uuid references auth.users(id)
- username text unique
- display_name text
- avatar_url text
- bio text
- school text
- college text
- major text
- grade text
- visibility text default 'public'
- profile_completed boolean default false
- created_at timestamptz
- updated_at timestamptz

## tags

- id uuid primary key
- name text
- slug text unique
- type text
- is_system boolean default false
- created_by uuid references profiles(id) nullable
- usage_count int default 0
- created_at timestamptz

## user_tags

- id uuid primary key
- profile_id uuid references profiles(id)
- tag_id uuid references tags(id)
- is_public boolean default true
- show_on_profile boolean default true
- weight int default 1
- created_at timestamptz
- unique(profile_id, tag_id)

## courses

- id uuid primary key
- school text
- name text
- teacher text nullable
- normalized_name text
- created_at timestamptz

## schedules

- id uuid primary key
- profile_id uuid references profiles(id)
- course_id uuid references courses(id)
- course_name text
- teacher text nullable
- location text nullable
- weekday int
- start_time time
- end_time time
- start_week int nullable
- end_week int nullable
- week_type text default 'all'
- visibility text default 'private'
- show_on_profile boolean default false
- participate_in_matching boolean default true
- status text nullable
- reminder_minutes int nullable
- is_hidden boolean default false
- created_at timestamptz
- updated_at timestamptz

## profile_blocks

- id uuid primary key
- profile_id uuid references profiles(id)
- type text
- title text nullable
- content jsonb
- sort_order int
- visibility text default 'public'
- created_at timestamptz
- updated_at timestamptz

## friendships

- id uuid primary key
- requester_id uuid references profiles(id)
- addressee_id uuid references profiles(id)
- status text
- created_at timestamptz
- updated_at timestamptz
- unique(requester_id, addressee_id)

## blocks

- id uuid primary key
- blocker_id uuid references profiles(id)
- blocked_id uuid references profiles(id)
- reason text nullable
- created_at timestamptz
- unique(blocker_id, blocked_id)

## hidden_users

- id uuid primary key
- profile_id uuid references profiles(id)
- hidden_profile_id uuid references profiles(id)
- created_at timestamptz
- unique(profile_id, hidden_profile_id)

## recommendation_logs

- id uuid primary key
- profile_id uuid references profiles(id)
- recommended_profile_id uuid references profiles(id)
- score int
- reasons jsonb
- algorithm_version text default 'v1'
- created_at timestamptz

## ai_generations

- id uuid primary key
- profile_id uuid references profiles(id)
- target_profile_id uuid references profiles(id) nullable
- type text
- input jsonb
- output jsonb
- created_at timestamptz

