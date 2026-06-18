-- Expenses table for internal business accounting
CREATE TABLE public.expenses (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  category      TEXT        NOT NULL DEFAULT 'autre',
  description   TEXT        NOT NULL,
  amount        INTEGER     NOT NULL,
  expense_date  DATE        NOT NULL DEFAULT CURRENT_DATE,
  supplier      TEXT,
  notes         TEXT,
  created_by    UUID        REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can access (admin gate is on the frontend)
CREATE POLICY "Authenticated users full access to expenses" ON public.expenses
  FOR ALL
  USING  (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE TRIGGER set_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_expenses_date     ON public.expenses (expense_date DESC);
CREATE INDEX idx_expenses_category ON public.expenses (category);
