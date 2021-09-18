import { getSession } from "next-auth/client";
export default function Page() {
  // const [session, loading] = useSession();
  // const router = useRouter();
  // useEffect(() => {
  //   if (!session) {
  //     router.push('/auth/signin')
  //   } else {
  //     router.push('/Dashboard')
  //   }
  // }, [session])
  return null;
}
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/Dashboard",
        permanent: false,
      },
    };
  }
}
