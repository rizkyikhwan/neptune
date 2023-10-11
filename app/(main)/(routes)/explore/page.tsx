"use client"

import { signOut, useSession } from "next-auth/react";

const Home = () => {
  const session = useSession()

  return (
    <div>
      <p>
        {session.data?.user.email}
      </p>
      <button onClick={() => signOut()}>logout</button>
    </div>
  )
}
export default Home