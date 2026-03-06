"use client"
import { createUserAction } from "./user";


export default function Home() {

  async function createUser() {
    const newUser = await createUserAction();

    console.log(newUser);
  }

  return (
    <div>
      <button onClick={createUser}>Create User</button>
    </div>
  )
}