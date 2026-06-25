import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await axios.get(
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCEUR"
    );

    return NextResponse.json({
      price: response.data.price,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Fehler beim Laden",
    });
  }
}