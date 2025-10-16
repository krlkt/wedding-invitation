import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getParticipants } from '../action'
import DashboardClientPage from '../DashboardClientPage'
import { Locations } from '../../components/LocationComponent'

export default async function LocationDashboardPage({
  params,
}: {
  params: { location: Locations }
}) {
  const cookieStore = cookies()
  const loggedIn = cookieStore.get('loggedIn')

  if (!loggedIn || loggedIn.value !== 'true') {
    redirect('/login?redirect=/dashboard/' + params.location)
  }

  const data = await getParticipants(params.location)
  const plainData = JSON.parse(JSON.stringify(data))

  return <DashboardClientPage initialData={plainData} location={params.location} />
}
