import { JwtPayload } from "./jwt-payload.type";

export interface RefreshTokenPayload extends JwtPayload {
  type: "refresh";
}
