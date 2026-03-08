import { prismaClient } from "@repo/db/client";


export default async function Home() {
  const user = await prismaClient.user.findFirst();

  return (
    <div style={{backgroundColor: "lightcyan"}}>
      User id:  {user?.id}
      <br/>
      User name: {user?.username}
      <br/>
      User passworrd: {user?.password}


      Production Page User id:  {user?.id}
      <br/>
      Production Page User name: {user?.username}
      <br/>
      Production Page User passworrd: {user?.password}
    </div>
  )
}
