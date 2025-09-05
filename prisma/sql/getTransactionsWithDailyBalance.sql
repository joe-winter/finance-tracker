-- @param {String} $1:userId
select t.id,
  t."date",
  c.type,
  c.name,
  t.amount,
  t.description,
  SUM(
    case
      when c.type = 'INCOME' then t.amount
      else - t.amount
    end
  ) over (
    order by t."date" range unbounded preceding
  ) as balance
from "Transaction" t
  inner join "Category" c on c.id = t."categoryId"
where t."userId" = $1
order by t."date" desc;