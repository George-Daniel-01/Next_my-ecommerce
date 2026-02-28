"use client";
import { useSelector } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const TopProductsChart = () => {
  const { topSellingProducts } = useSelector((state) => state.admin);
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      const product = payload[0].payload;
      return <div className="bg-white p-2 rounded shadow border text-sm"><p className="font-semibold">{product.name}</p><p>Sold: {product.total_sold}</p></div>;
    }
    return null;
  };
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="font-semibold mb-2">Top Selling Products</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart layout="vertical" data={topSellingProducts?.slice(0, 3)} barSize={50}>
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="total_sold" radius={[4, 4, 4, 4]} isAnimationActive={false}>
            {topSellingProducts?.slice(0, 3).map((_, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? "#3b82f6" : index === 1 ? "#10b981" : "#f59e0b"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default TopProductsChart;