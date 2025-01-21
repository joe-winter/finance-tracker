import { getStartAndEndDate } from "@/utils/helpers"


describe("get start and end date", () => {
  it("returns dates given a year and month", () => {
    const {startDate, endDate} = getStartAndEndDate(2025, 0)
    
    expect(startDate).toEqual(new Date(2025, 0, 1))
    expect(endDate).toEqual(new Date(2025, 1, 1))
  })
  it("returns dates given for a different year and month", () => {
    const {startDate, endDate} = getStartAndEndDate(2024, 11)
    
    expect(startDate).toEqual(new Date(2024, 11, 1))
    expect(endDate).toEqual(new Date(2025, 0, 1))
  })
})