"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChartsSectionProps {
    categoryData: { name: string; value: number }[];
    projectionData: { name: string; value: number }[];
    currency: string;
}

const COLORS = ['#0fa968', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];

export function ChartsSection({ categoryData, projectionData, currency }: ChartsSectionProps) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Category Pie Chart */}
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col">
                <h3 className="text-lg font-semibold mb-6">Spend by Category</h3>
                <div className="h-[300px] w-full">
                    {categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => formatCurrency(value)}
                                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }}
                                    itemStyle={{ color: '#f4f4f5' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground italic">
                            No category data available
                        </div>
                    )}
                </div>
            </div>

            {/* Monthly Projection Bar Chart */}
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col">
                <h3 className="text-lg font-semibold mb-6">12-Month Projection</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={projectionData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(val) => `$${val}`}
                            />
                            <Tooltip
                                formatter={(value: number) => formatCurrency(value)}
                                cursor={{ fill: '#27272a', opacity: 0.2 }}
                                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }}
                                itemStyle={{ color: '#f4f4f5' }}
                            />
                            <Bar dataKey="value" fill="#0fa968" radius={[4, 4, 0, 0]} maxBarSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
