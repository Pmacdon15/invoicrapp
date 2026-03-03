'use client'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { Button } from '../ui/button'

interface SetPeriodButtonsProps {
	selectedPeriodPromise: Promise<'30days' | '6months' | '1year'>
}

export default function SetPeriodButtons({
	selectedPeriodPromise,
}: SetPeriodButtonsProps) {
	const router = useRouter()
	const selectedPeriod = use(selectedPeriodPromise)

	const handlePeriodChange = (period: '30days' | '6months' | '1year') => {
		router.push(`?period=${period}`)
	}
	return (
		<div className="flex flex-wrap gap-2">
			<Button
				className="text-xs sm:text-sm"
				onClick={() => handlePeriodChange('30days')}
				size="sm"
				variant={selectedPeriod === '30days' ? 'default' : 'outline'}
			>
				30 Days
			</Button>
			<Button
				className="text-xs sm:text-sm"
				onClick={() => handlePeriodChange('6months')}
				size="sm"
				variant={selectedPeriod === '6months' ? 'default' : 'outline'}
			>
				6 Months
			</Button>
			<Button
				className="text-xs sm:text-sm"
				onClick={() => handlePeriodChange('1year')}
				size="sm"
				variant={selectedPeriod === '1year' ? 'default' : 'outline'}
			>
				1 Year
			</Button>
		</div>
	)
}
