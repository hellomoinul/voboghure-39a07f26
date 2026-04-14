
-- Community types enum
CREATE TYPE public.community_type AS ENUM ('private', 'invite_only');

-- Community roles enum  
CREATE TYPE public.community_role AS ENUM ('member', 'community_admin');

-- Join request status enum
CREATE TYPE public.join_request_status AS ENUM ('pending', 'approved', 'rejected');

-- Communities table
CREATE TABLE public.communities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_bn TEXT,
  description TEXT NOT NULL,
  description_bn TEXT,
  tagline TEXT,
  logo TEXT DEFAULT '😎',
  cover_image TEXT,
  theme_color TEXT,
  type community_type NOT NULL DEFAULT 'private',
  code TEXT NOT NULL UNIQUE,
  member_count INTEGER NOT NULL DEFAULT 1,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Community members table
CREATE TABLE public.community_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role community_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(community_id, user_id)
);

-- Community join requests table
CREATE TABLE public.community_join_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status join_request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(community_id, user_id)
);

-- Enable RLS
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_join_requests ENABLE ROW LEVEL SECURITY;

-- Communities policies: anyone authenticated can read the listing
CREATE POLICY "Authenticated users can read communities"
  ON public.communities FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can create communities
CREATE POLICY "Authenticated users can create communities"
  ON public.communities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Creators can update their own communities
CREATE POLICY "Creators can update own communities"
  ON public.communities FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- Community members policies: members can read their own memberships
CREATE POLICY "Users can read own memberships"
  ON public.community_members FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Community admins can read all members of their communities
CREATE POLICY "Community admins can read community members"
  ON public.community_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members cm
      WHERE cm.community_id = community_members.community_id
        AND cm.user_id = auth.uid()
        AND cm.role = 'community_admin'
    )
  );

-- Authenticated users can insert their own membership (for creator auto-join)
CREATE POLICY "Users can insert own membership"
  ON public.community_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Join requests: users can read their own requests
CREATE POLICY "Users can read own join requests"
  ON public.community_join_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own join requests
CREATE POLICY "Users can create own join requests"
  ON public.community_join_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Community admins can read join requests for their communities
CREATE POLICY "Community admins can read community join requests"
  ON public.community_join_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members cm
      WHERE cm.community_id = community_join_requests.community_id
        AND cm.user_id = auth.uid()
        AND cm.role = 'community_admin'
    )
  );
