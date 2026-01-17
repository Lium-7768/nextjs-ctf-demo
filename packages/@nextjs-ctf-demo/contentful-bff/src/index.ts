export { contentfulClient } from './client'
export type { Page, Section, Feature, Service, Testimonial, PricingPlan, FAQEntry, FAQ, NavigationItem, GlobalSettings } from './client'

export { getPageBySlug, getAllPages } from './services/page.service'
export { getNavigationItems, getGlobalSettings } from './services/navigation.service'
export { getSections } from './services/section.service'
export { getFeatures, getServices, getTestimonials, getPricingPlans, getFAQs } from './services/collection.service'

export { renderRichText } from './rich-text/renderer'
