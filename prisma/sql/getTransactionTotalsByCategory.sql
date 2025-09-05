-- @param {String} $1:userId
-- @param {DateTime} $2:startDate
-- @param {DateTime} $3:endDate
WITH CategoryTotals AS (
  SELECT c.id as "categoryId",
    c.name,
    c.type,
    COALESCE(SUM(t.amount), 0) as total_amount,
    ROW_NUMBER() OVER (
      PARTITION BY c.type
      ORDER BY COALESCE(SUM(t.amount), 0) DESC
    ) as rank
  FROM "Category" c
    LEFT JOIN "Transaction" t ON c.id = t."categoryId"
  WHERE c."userId" = $1
    AND (
      t.id IS NULL
      OR (
        t."userId" = $1
        AND t.amount > 0
        AND t.date >= $2
        AND t.date <= $3
      )
    )
  GROUP BY c.id,
    c.name,
    c.type
),
GroupedCategories AS (
  SELECT type,
    CASE
      WHEN rank <= 5 THEN "categoryId"::TEXT
      ELSE NULL
    END as "categoryId",
    CASE
      WHEN rank <= 5 THEN name
      ELSE 'Other'
    END as name,
    total_amount
  FROM CategoryTotals
  WHERE total_amount > 0
)
SELECT type,
  "categoryId",
  name,
  COALESCE(SUM(total_amount), 0)::TEXT as sum
FROM GroupedCategories
GROUP BY type,
  "categoryId",
  name
ORDER BY type,
  CASE
    WHEN name = 'Other' THEN 1
    ELSE 0
  END;