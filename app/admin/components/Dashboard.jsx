"use client";
import Header from "@/app/admin/components/Header";
import MiniSummary from "@/app/admin/components/dashboard-components/MiniSummary";
import TopSellingProducts from "@/app/admin/components/dashboard-components/TopSellingProducts";
import Stats from "@/app/admin/components/dashboard-components/Stats";
import MonthlySalesChart from "@/app/admin/components/dashboard-components/MonthlySalesChart";
import OrdersChart from "@/app/admin/components/dashboard-components/OrdersChart";
import TopProductsChart from "@/app/admin/components/dashboard-components/TopProductsChart";

const Dashboard = () => {
  return (
    <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
      <div className="flex-1 md:p-6">
        <Header />
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mb-4">Check the sales and value.</p>
        <Stats />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
          <MonthlySalesChart />
          <OrdersChart />
          <TopProductsChart />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 py-4">
          <TopSellingProducts />
          <div><MiniSummary /></div>
        </div>
      </div>
    </main>
  );
};
export default Dashboard;