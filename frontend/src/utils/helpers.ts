export function getStartAndEndDate (year: number, month: number) {
  return {startDate: new Date(year, month, 1), endDate: new Date(year, month + 1, 1)}
}
