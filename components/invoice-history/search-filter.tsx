'use client'

import { Filter, Search, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select'

interface SearchFilterProps {
	searchTerm: string
	filterBy: string
}

export default function SearchFilter({
	searchTerm,
	filterBy,
}: SearchFilterProps) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	// Internal helper to update URL
	const updateUrl = (key: string, value: string) => {
		const params = new URLSearchParams(searchParams)

		if (value && value !== 'all') {
			params.set(key, value)
		} else {
			params.delete(key)
		}

		// Always push to the URL to trigger the Next.js server-side re-fetch
		router.push(`${pathname}?${params.toString()}`)
	}

	const clearFilters = () => {
		router.push(pathname)
	}

	return (
		<div className="flex flex-col sm:flex-row gap-4">
			<div className="relative flex-1">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
				<Input
					className="pl-10"
					defaultValue={searchTerm}
					// We use the prop directly
					onChange={(e) => updateUrl('search', e.target.value)}
					placeholder="Search invoices..."
				/>
			</div>

			<div className="flex gap-2 items-center">
				<Filter className="w-4 h-4 text-gray-500" />
				<Select
					defaultValue={filterBy}
					onValueChange={(value) => updateUrl('filter', value)}
				>
					<SelectTrigger className="w-48">
						<SelectValue placeholder="Filter by status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Invoices</SelectItem>
						<SelectItem value="draft">Draft</SelectItem>
						<SelectItem value="sent">Sent</SelectItem>
						<SelectItem value="paid">Paid</SelectItem>
						<SelectItem value="overdue">Overdue</SelectItem>
						<SelectItem value="cancelled">Cancelled</SelectItem>
					</SelectContent>
				</Select>

				{(filterBy !== 'all' || searchTerm) && (
					<Button
						className="h-8 w-8 p-0"
						onClick={clearFilters}
						size="sm"
						variant="ghost"
					>
						<X className="w-4 h-4" />
					</Button>
				)}
			</div>
		</div>
	)
}
