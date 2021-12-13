import { getSession } from "next-auth/react";
import getUserJWT from '../../src/utils/backend/getUserJWT/getUserJWT';


export default async function handler(req, res) {
  const session = await getSession({ req });

  if( session ) {
    const signedAccessToken = await getUserJWT(session.user.email);
  
    res.status(200).json({ accessToken: signedAccessToken })
  } else {
    res.status(401).json({ error: 'Unauthenticated request!' })
  }
}
