import { Cell, Pie, PieChart } from "recharts"

interface PieChartProps {
  data: {name: string, value: number}[];
  colors: string[];
}

export default function PieChartTotals({data, colors}: PieChartProps) {
  return (
    <div className="flex items-center">
            <div>
              <PieChart width={200} height={200}>
                <Pie
                  data={data}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div>
              {data.map((expenses, index) => (
                <div key={index} className="flex">
                  <div
                    className="w-6 h-6"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></div>
                  <div>
                    {expenses.name} {expenses.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
  )
}