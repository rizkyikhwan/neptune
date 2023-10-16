interface ServerIdPageProps {
  params: {
    serverId: string
  }
}

const ServerIdPage = ({ params }: ServerIdPageProps) => {
  return (
    <div>ServerIdPage {params.serverId}</div>
  )
}
export default ServerIdPage