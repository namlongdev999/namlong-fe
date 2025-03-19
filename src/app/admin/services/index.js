
import RestAPI from "../../../service";
import Cookies from "js-cookie";

export async function createToken(token) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  Cookies.set("token", token, {
    expires: expiresAt,
    path: "/",
  });
}

export async function login(req) {
  try {
    const res = await RestAPI.post("/login", req);
    
    createToken(res?.data?.token)
  } catch (e) {
    return e;
  }
}
