import { getSession } from 'next-auth/client';
export default function Dashboard() {
  return <div>Welcome to Pel</div>
}
export async function getServerSideProps(context) {

  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
