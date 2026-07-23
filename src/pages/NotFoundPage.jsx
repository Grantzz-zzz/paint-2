import { PageHero, PageLayout, ClosingCTA } from '../components/PageLayout'
import { asset } from '../utils/assets'

const image=asset('client/projects/exterior/exterior-07.webp')

export default function NotFoundPage() {
  return <PageLayout title="Page Not Found" description="The requested Superior Plus Painting page could not be found." image={image}>
    <PageHero eyebrow="404 error" title="That page has" accent="moved on." intro="The page may be unpublished, may have a new address, or may never have existed. Let’s get you back to the painting information you need." image={image} tone="maroon"/>
    <ClosingCTA title="Let’s find the right way forward." text="Explore our services or tell us about your property and we’ll point you in the right direction."/>
  </PageLayout>
}
