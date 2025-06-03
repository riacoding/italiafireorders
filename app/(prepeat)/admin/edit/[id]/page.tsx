import EditPage from './EditPage'

export default async function EditMenuPage({ params }: { params: { id: string } }) {
  const { id } = await params

  return <EditPage id={id} />
}
