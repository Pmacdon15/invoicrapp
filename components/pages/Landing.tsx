'use client'

import { useEffect } from 'react'
import Features from '@/components/landing/Features'
import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import StructuredData from '@/components/StructuredData'
import { trackReferrerData } from '@/lib/referrer-utils'
import FinalCTA from '../landing/FinalCTA'
import Pricing from '../landing/Pricing'
import Testimonials from '../landing/Testimonials'

const Landing = () => {
	const companyLogos = [
		{ name: 'TechCorp', logo: '/abstract-tech-logo.png' },
		{ name: 'DesignStudio', logo: '/design-agency-logo.png' },
		{ name: 'StartupInc', logo: '/startup-logo.png' },
		{ name: 'ConsultingPro', logo: '/consulting-firm-logo.png' },
	]

	// Track referrer data on component mount
	useEffect(() => {
		trackReferrerData()
	}, [])

	return (
		<>
			<StructuredData />
			<div className="min-h-screen bg-gradient-to-r from-emerald-900 via-green-800 to-teal-800">
				<Header />
				<Hero companyLogos={companyLogos} />
				<div className="bg-background">
					<Features />
				</div>
				<Pricing />
				<Testimonials />
				<FinalCTA />
				<Footer />
			</div>
		</>
	)
}

export default Landing
