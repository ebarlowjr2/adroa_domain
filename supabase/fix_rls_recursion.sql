-- Fix: infinite recursion in organization_members RLS policy
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/dobimlodgszkjmcoyamj/sql/new

-- Step 1: Create a SECURITY DEFINER function that bypasses RLS
-- This prevents infinite recursion when policies reference organization_members
CREATE OR REPLACE FUNCTION get_user_org_ids(uid uuid)
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT org_id FROM organization_members WHERE user_id = uid;
$$;

-- Step 2: Drop all existing policies that reference organization_members
DROP POLICY IF EXISTS "Users can view their organization" ON organizations;
DROP POLICY IF EXISTS "Owners can update their organization" ON organizations;
DROP POLICY IF EXISTS "Members can view org members" ON organization_members;
DROP POLICY IF EXISTS "Org members can view employees" ON employees;
DROP POLICY IF EXISTS "Org admins can insert employees" ON employees;
DROP POLICY IF EXISTS "Org admins can update employees" ON employees;
DROP POLICY IF EXISTS "Org members can view assignments" ON training_assignments;
DROP POLICY IF EXISTS "Org admins can create assignments" ON training_assignments;
DROP POLICY IF EXISTS "Org admins can update assignments" ON training_assignments;
DROP POLICY IF EXISTS "Org members can view readiness events" ON readiness_events;

-- Step 3: Recreate policies using the SECURITY DEFINER function
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (
    id IN (SELECT get_user_org_ids(auth.uid()))
  );

CREATE POLICY "Owners can update their organization" ON organizations
  FOR UPDATE USING (
    id IN (SELECT get_user_org_ids(auth.uid()))
  );

CREATE POLICY "Members can view org members" ON organization_members
  FOR SELECT USING (
    org_id IN (SELECT get_user_org_ids(auth.uid()))
  );

CREATE POLICY "Org members can view employees" ON employees
  FOR SELECT USING (
    org_id IN (SELECT get_user_org_ids(auth.uid()))
  );

CREATE POLICY "Org admins can insert employees" ON employees
  FOR INSERT WITH CHECK (
    org_id IN (SELECT get_user_org_ids(auth.uid()))
  );

CREATE POLICY "Org admins can update employees" ON employees
  FOR UPDATE USING (
    org_id IN (SELECT get_user_org_ids(auth.uid()))
  );

CREATE POLICY "Org members can view assignments" ON training_assignments
  FOR SELECT USING (
    org_id IN (SELECT get_user_org_ids(auth.uid()))
  );

CREATE POLICY "Org admins can create assignments" ON training_assignments
  FOR INSERT WITH CHECK (
    org_id IN (SELECT get_user_org_ids(auth.uid()))
  );

CREATE POLICY "Org admins can update assignments" ON training_assignments
  FOR UPDATE USING (
    org_id IN (SELECT get_user_org_ids(auth.uid()))
  );

CREATE POLICY "Org members can view readiness events" ON readiness_events
  FOR SELECT USING (
    org_id IN (SELECT get_user_org_ids(auth.uid()))
  );
