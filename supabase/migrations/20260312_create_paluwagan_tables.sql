-- Migration: Paluwagan (Rotating Savings Group) Tables
-- Derived from src/app/actions/paluwagan.ts

-- 1. Groups table
CREATE TABLE IF NOT EXISTS public.paluwagan_groups (
    id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    name         text        NOT NULL,
    organizer_id uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount       numeric     NOT NULL CHECK (amount > 0),
    cycle        text        NOT NULL CHECK (cycle IN ('weekly', 'biweekly', 'monthly')),
    winner_order text        NOT NULL DEFAULT 'rotating' CHECK (winner_order IN ('rotating', 'organizer')),
    total_cycles int         NOT NULL CHECK (total_cycles > 0),
    invite_code  text        NOT NULL UNIQUE,
    started_at   date        NOT NULL,
    status       text        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at   timestamptz NOT NULL DEFAULT now()
);

-- 2. Members table (one row per member per group)
CREATE TABLE IF NOT EXISTS public.paluwagan_members (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id    uuid        NOT NULL REFERENCES public.paluwagan_groups(id) ON DELETE CASCADE,
    user_id     uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    slot_number int         NOT NULL,
    joined_at   timestamptz NOT NULL DEFAULT now(),
    UNIQUE (group_id, user_id),
    UNIQUE (group_id, slot_number)
);

-- 3. Cycles table (one row per scheduled payout cycle)
CREATE TABLE IF NOT EXISTS public.paluwagan_cycles (
    id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id         uuid        NOT NULL REFERENCES public.paluwagan_groups(id) ON DELETE CASCADE,
    cycle_number     int         NOT NULL,
    winner_member_id uuid        REFERENCES public.paluwagan_members(id) ON DELETE SET NULL,
    due_date         date        NOT NULL,
    completed_at     timestamptz,
    pot_amount       numeric     NOT NULL,
    UNIQUE (group_id, cycle_number)
);

-- 4. Payments table (organizer marks each member as paid per cycle)
CREATE TABLE IF NOT EXISTS public.paluwagan_payments (
    id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_id     uuid        NOT NULL REFERENCES public.paluwagan_cycles(id) ON DELETE CASCADE,
    member_id    uuid        NOT NULL REFERENCES public.paluwagan_members(id) ON DELETE CASCADE,
    paid_at      timestamptz NOT NULL DEFAULT now(),
    confirmed_by uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
    UNIQUE (cycle_id, member_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS paluwagan_groups_organizer_idx   ON public.paluwagan_groups (organizer_id);
CREATE INDEX IF NOT EXISTS paluwagan_groups_status_idx      ON public.paluwagan_groups (status);
CREATE INDEX IF NOT EXISTS paluwagan_members_group_idx      ON public.paluwagan_members (group_id);
CREATE INDEX IF NOT EXISTS paluwagan_members_user_idx       ON public.paluwagan_members (user_id);
CREATE INDEX IF NOT EXISTS paluwagan_cycles_group_idx       ON public.paluwagan_cycles (group_id);
CREATE INDEX IF NOT EXISTS paluwagan_cycles_completed_idx   ON public.paluwagan_cycles (completed_at);
CREATE INDEX IF NOT EXISTS paluwagan_payments_cycle_idx     ON public.paluwagan_payments (cycle_id);
CREATE INDEX IF NOT EXISTS paluwagan_payments_member_idx    ON public.paluwagan_payments (member_id);

-- ─── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE public.paluwagan_groups   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paluwagan_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paluwagan_cycles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paluwagan_payments ENABLE ROW LEVEL SECURITY;

-- paluwagan_groups: members of the group or organizer can view; public cannot browse
CREATE POLICY "Members can view their groups"
    ON public.paluwagan_groups FOR SELECT
    USING (
        organizer_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.paluwagan_members
            WHERE group_id = paluwagan_groups.id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can create groups"
    ON public.paluwagan_groups FOR INSERT
    WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizer can update group"
    ON public.paluwagan_groups FOR UPDATE
    USING (auth.uid() = organizer_id);

-- paluwagan_members: visible to group members and organizer
CREATE POLICY "Group members can view members"
    ON public.paluwagan_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.paluwagan_groups g
            WHERE g.id = paluwagan_members.group_id
            AND (g.organizer_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM public.paluwagan_members m2
                    WHERE m2.group_id = g.id AND m2.user_id = auth.uid()
                ))
        )
    );

CREATE POLICY "Authenticated users can join groups"
    ON public.paluwagan_members FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members can leave (delete own row)"
    ON public.paluwagan_members FOR DELETE
    USING (auth.uid() = user_id);

-- paluwagan_cycles: visible to group members
CREATE POLICY "Group members can view cycles"
    ON public.paluwagan_cycles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.paluwagan_members
            WHERE group_id = paluwagan_cycles.group_id AND user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.paluwagan_groups
            WHERE id = paluwagan_cycles.group_id AND organizer_id = auth.uid()
        )
    );

CREATE POLICY "Organizer can update cycles"
    ON public.paluwagan_cycles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.paluwagan_groups
            WHERE id = paluwagan_cycles.group_id AND organizer_id = auth.uid()
        )
    );

-- paluwagan_payments: visible to group members
CREATE POLICY "Group members can view payments"
    ON public.paluwagan_payments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.paluwagan_cycles c
            JOIN public.paluwagan_members m ON m.group_id = c.group_id
            WHERE c.id = paluwagan_payments.cycle_id AND m.user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.paluwagan_cycles c
            JOIN public.paluwagan_groups g ON g.id = c.group_id
            WHERE c.id = paluwagan_payments.cycle_id AND g.organizer_id = auth.uid()
        )
    );

CREATE POLICY "Organizer can upsert payments"
    ON public.paluwagan_payments FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.paluwagan_cycles c
            JOIN public.paluwagan_groups g ON g.id = c.group_id
            WHERE c.id = cycle_id AND g.organizer_id = auth.uid()
        )
    );

CREATE POLICY "Organizer can delete payments"
    ON public.paluwagan_payments FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.paluwagan_cycles c
            JOIN public.paluwagan_groups g ON g.id = c.group_id
            WHERE c.id = paluwagan_payments.cycle_id AND g.organizer_id = auth.uid()
        )
    );
