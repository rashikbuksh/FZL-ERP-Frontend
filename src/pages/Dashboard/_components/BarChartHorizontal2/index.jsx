'use client';

import { TrendingUp } from 'lucide-react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	XAxis,
	YAxis,
} from 'recharts';
import { useFetch } from '@/hooks';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
	not_approved: {
		label: 'Not approved',
		color: '#FF0000',
	},
	approved: {
		label: 'Approved',
		color: '#4185f4',
	},
	total: {
		label: 'Total',
		color: 'hsl(var(--foreground))',
	},
	label: {
		color: 'hsl(var(--background))',
	},
};

export function BarChartHorizontal2(props) {
	const { value: data } = useFetch(`/dashboard/work-in-hand`);
	const chartData = data?.map((item) => ({
		...item,
		total: item.approved + item.not_approved,
	}));
	return (
		<Card>
			<CardHeader>
				<CardTitle>Work in Hand</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<span className='live-indicator float-right'>
						(<span className='live-dot'></span>
						<span className='live-text'> Live</span>)
					</span>
					<BarChart
						accessibilityLayer
						data={chartData}
						layout='vertical'
						margin={{
							top: 5,
							right: 50,
							left: 5,
							bottom: 5,
						}}>
						<CartesianGrid horizontal={false} />
						<YAxis
							dataKey='item_name'
							type='category'
							tickLine={true}
							tickMargin={10}
							axisLine={true}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<XAxis dataKey='total' type='number' />
						<ChartLegend content={<ChartLegendContent />} />
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator='line' />}
						/>
						<Bar
							dataKey='approved'
							stackId='a'
							fill='var(--color-approved)'
							radius={[0, 0, 0, 0]}>
							<LabelList
								dataKey='approved'
								position='center'
								className='fill-[--color-label]'
								fontSize={12}
							/>
						</Bar>
						<Bar
							dataKey='not_approved'
							stackId='a'
							fill='var(--color-not_approved)'
							radius={[0, 4, 4, 0]}>
							<LabelList
								dataKey='not_approved'
								position='center'
								className='fill-[--color-label]'
								fontSize={12}
							/>
							<LabelList
								dataKey='total'
								position='right'
								offset={8}
								className='fill-[--color-total]'
								fontSize={12}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className='flex-col items-start gap-2 text-sm'></CardFooter>
		</Card>
	);
}
