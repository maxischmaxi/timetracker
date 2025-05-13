import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();

export async function verifyGoogleToken(req: Request): Promise<boolean> {
  const token = req.headers.get("Authorization")?.split("Bearer ")[1];
  if (!token) {
    return false;
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        "804599044684-kn624h4lruc2kjdfcds7qbt1ce8ckv46.apps.googleusercontent.com",
    });
    const user = ticket.getPayload();
    if (user) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}
