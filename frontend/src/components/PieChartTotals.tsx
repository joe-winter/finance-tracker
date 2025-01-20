import { Cell, Pie, PieChart } from "recharts";

interface PieChartProps {
  data: { name: string; value: number }[];
  colors: string[];
  total: number;
}

export default function PieChartTotals({ data, colors, total }: PieChartProps) {
  return (
    <div className="flex items-center">
      <div className="p-2">
        <PieChart width={160} height={160}>
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
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded"
              style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <div className="flex justify-between w-44">
              <span className="font-medium">{expenses.name}</span>
              <span className="text-gray-600 justify-end">
                ${expenses.value.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
        <div className="pt-2 mt-2 border-t border-gray-200">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
