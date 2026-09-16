import { SquareClient, SquareEnvironment } from "square";

let squareClient: SquareClient | null = null;

/**
 * Lazily initialized Square client. Returns null when SQUARE_ACCESS_TOKEN
 * is not configured so the app can run (donations UI visible, checkout
 * disabled) before an administrator adds real credentials.
 */
export function getSquareClient(): SquareClient | null {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) return null;
  if (!squareClient) {
    squareClient = new SquareClient({
      token,
      environment:
        process.env.SQUARE_ENVIRONMENT === "production"
          ? SquareEnvironment.Production
          : SquareEnvironment.Sandbox,
    });
  }
  return squareClient;
}

export function isSquareConfigured(): boolean {
  return Boolean(process.env.SQUARE_ACCESS_TOKEN && process.env.SQUARE_LOCATION_ID);
}

export function getSquareLocationId(): string {
  const locationId = process.env.SQUARE_LOCATION_ID;
  if (!locationId) throw new Error("SQUARE_LOCATION_ID is not configured");
  return locationId;
}
