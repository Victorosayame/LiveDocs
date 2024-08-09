import { liveblocks } from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";




export async function POST(request: Request) {
  //2.0: we will fetch our users,we will make liveblocks work with clerk
  const clerkUser = await currentUser();

  //2.1 if they is no clerk user,redirect to sign in
  if(!clerkUser) redirect("/sign-in");

  //we will destructure the properties directly from the clerk user and pass it to the user
  const { id, firstName, lastName, emailAddresses, imageUrl } = clerkUser;

  //2.2 form the user in a way liveblocks accepts it
  // Get the current user from your database
  const user = {
    id: id,
    info: {
      id,
      name: `${firstName} ${lastName}`,
      email: emailAddresses[0].emailAddress,
      avatar: imageUrl,
      //create a special color for each user, this function will be created by chatGBT
      color: getUserColor(id),
    }
  }

  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser(
    {
      // identify them by using their email
      userId: user.info.email,
      groupIds: [],
    },
    { userInfo: user.info },
  );

  return new Response(body, { status });
}