import { Card, CardContent } from '../ui/card'

export default function AnalyticsFallback() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
					Analytics Dashboard
				</h1>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{[1, 2, 3, 4].map((i) => (
					<Card className="animate-pulse" key={i}>
						<CardContent className="p-6">
							<div className="h-4 bg-gray-200 rounded mb-2"></div>
							<div className="h-8 bg-gray-200 rounded"></div>
						</CardContent>
					</Card>
				))}
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{[1, 2].map((i) => (
					<Card className="animate-pulse" key={i}>
						<CardContent className="p-6">
							<div className="h-8 bg-gray-200 rounded mb-4"></div>
							<div className="h-20 bg-gray-200 rounded"></div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
}
