
-- Security definer function to check if a user is admin of a community
CREATE OR REPLACE FUNCTION public.is_community_admin(_user_id uuid, _community_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.community_members
    WHERE user_id = _user_id
      AND community_id = _community_id
      AND role = 'community_admin'::community_role
  );
$$;

-- Admins can update join requests (approve/reject)
CREATE POLICY "Admins can update join requests"
ON public.community_join_requests
FOR UPDATE
TO authenticated
USING (public.is_community_admin(auth.uid(), community_id))
WITH CHECK (public.is_community_admin(auth.uid(), community_id));

-- Admins can delete members from their community
CREATE POLICY "Admins can delete community members"
ON public.community_members
FOR DELETE
TO authenticated
USING (public.is_community_admin(auth.uid(), community_id));

-- Admins can update member roles
CREATE POLICY "Admins can update community members"
ON public.community_members
FOR UPDATE
TO authenticated
USING (public.is_community_admin(auth.uid(), community_id))
WITH CHECK (public.is_community_admin(auth.uid(), community_id));

-- Admins can add members (for approving join requests)
CREATE POLICY "Admins can insert community members"
ON public.community_members
FOR INSERT
TO authenticated
WITH CHECK (public.is_community_admin(auth.uid(), community_id));
