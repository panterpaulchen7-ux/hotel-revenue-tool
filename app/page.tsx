"use client";

import { useEffect, useState } from "react";
export default function Home() {
  const hotels = require("../public/competitors.json");
const [myPrice, setMyPrice] = useState(121);
const [occupancy, setOccupancy] = useState(72);
const [sortMode, setSortMode] = useState("price");

const [bitcoinPrice, setBitcoinPrice] = useState(0);

useEffect(() => {
  fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCEUR")
    .then((response) => response.json())
    .then((data) => {
      setBitcoinPrice(Number(data.price));
    });
}, []);
const myHotel = {
  name: "Hotel Goldene Krone",
  price: myPrice,
  rating: 8.4,
  genius: false,
};

const sortedHotels = [...hotels].sort((a, b) => {
  if (sortMode === "price") {
    return b.price - a.price;
  }

  if (sortMode === "rating") {
    return b.rating - a.rating;
  }

  if (sortMode === "score") {
    const scoreA =
      a.rating * 2 +
      (a.genius ? 1 : 0) +
      occupancy / 20 -
      a.price / 50;

    const scoreB =
      b.rating * 2 +
      (b.genius ? 1 : 0) +
      occupancy / 20 -
      b.price / 50;

    return scoreB - scoreA;
  }

  return 0;
});
const hotelsWithScore = sortedHotels.map((hotel) => {
  const score =
    hotel.rating * 2 +
    (hotel.genius ? 1 : 0) +
    occupancy / 20 -
    hotel.price / 50;
let competitionLevel = "";

if (score > 19) {
  competitionLevel = "Premium";
} else if (score > 18) {
  competitionLevel = "Stark";
} else if (score > 17) {
  competitionLevel = "Normal";
} else {
  competitionLevel = "Schwach";
}
  return {
    ...hotel,
    score: score.toFixed(2),
    competitionLevel,
  };
});

const averagePrice =
  hotels.reduce((sum, h) => sum + h.price, 0) / hotels.length;

let priceStatus = "";

if (myPrice < averagePrice - 20) {
  priceStatus = "Zu günstig";
} else if (myPrice > averagePrice + 20) {
  priceStatus = "Premium";
} else {
  priceStatus = "Marktgerecht";
}
const cheaperHotels = hotels.filter(
  (hotel) => hotel.price < myHotel.price
).length;

const moreExpensiveHotels = hotels.filter(
  (hotel) => hotel.price > myHotel.price
).length;

const topRatedHotel = hotels.reduce((best, hotel) =>
  hotel.rating > best.rating ? hotel : best
);
const strongestCompetitor = hotelsWithScore.reduce((best, hotel) =>
  Number(hotel.score) > Number(best.score) ? hotel : best
);
let recommendation = "";
let suggestedPrice = myHotel.price;

if (occupancy > 80) {
  suggestedPrice = myHotel.price + 15;
} else if (occupancy > 60) {
  suggestedPrice = myHotel.price + 8;
} else if (occupancy < 40) {
  suggestedPrice = myHotel.price - 10;
}
let marketPosition = "";
let marketWarning = "";
if (myHotel.price < averagePrice - 20) {
  marketPosition = "Unter Marktpreis";
} else if (myHotel.price > averagePrice + 20) {
  marketPosition = "Premium Position";
} else {
  marketPosition = "Im Marktdurchschnitt";
}
if (occupancy > 80 && myHotel.price < averagePrice) {
  recommendation = "Preis deutlich erhöhen";
} else if (occupancy > 60 && myHotel.price < averagePrice) {
  recommendation = "Preis leicht erhöhen";
} else if (occupancy < 40 && myHotel.price > averagePrice) {
  recommendation = "Preis prüfen oder senken";
} else {
  recommendation = "Preis aktuell passend";
}
if (Number(strongestCompetitor.score) - Number(myHotel.rating * 2) > 2) {
  marketWarning = "⚠ Konkurrenz aktuell deutlich stärker";
} else if (occupancy > 80 && myHotel.price < averagePrice) {
  marketWarning = "💰 Hohe Nachfrage - Preispotenzial vorhanden";
} else if (myHotel.price > averagePrice + 30) {
  marketWarning = "⚠ Preis eventuell zu hoch";
} else {
  marketWarning = "✅ Marktposition aktuell stabil";
}
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        Hotel Revenue Dashboard
      </h1>
<p className="mb-4 text-lg">
<p className="mb-4 text-blue-600 font-bold">
  Bitcoin Live Preis: {bitcoinPrice.toFixed(2)} €
</p>
  <div className="mb-4">
  <label className="mr-2 font-semibold">
    Mein Preis:
  </label>

  <input
    type="number"
    value={myPrice}
    onChange={(e) =>
      setMyPrice(Number(e.target.value))
    }
    className="border p-2 rounded w-32"
  />
</div>
<div className="mt-4">
  <label className="mr-2 font-semibold">
    Belegung %:
  </label>

  <input
    type="number"
    value={occupancy}
    onChange={(e) =>
      setOccupancy(Number(e.target.value))
    }
    className="border p-2 rounded w-32"
  />
</div>
  Durchschnittspreis: {averagePrice.toFixed(2)} €
</p>

<p className="mb-6 text-xl font-semibold">
  Empfehlung für dein Hotel: {recommendation}
</p>
<p className="text-lg mt-2">
  Marktstatus: <strong>{marketPosition}</strong>
</p>
<p
  className={
    priceStatus === "Zu günstig"
      ? "text-red-600 font-bold mt-2"
      : priceStatus === "Premium"
      ? "text-green-600 font-bold mt-2"
      : "text-yellow-600 font-bold mt-2"
  }
>
  Preisstatus: {priceStatus}
</p>
<p
  className={`text-lg font-bold mt-2 ${
    marketWarning.includes("⚠")
      ? "text-red-600"
      : marketWarning.includes("💰")
      ? "text-green-600"
      : "text-blue-600"
  }`}
>
  {marketWarning}
</p>
<div className="mb-4 flex gap-2">
  <button
    onClick={() => setSortMode("price")}
    className="border px-3 py-1 rounded"
  >
    Nach Preis
  </button>

  <button
    onClick={() => setSortMode("rating")}
    className="border px-3 py-1 rounded"
  >
    Nach Bewertung
  </button>

  <button
    onClick={() => setSortMode("score")}
    className="border px-3 py-1 rounded"
  >
    Nach Score
  </button>
</div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-3 text-left">Hotel</th>
            <th className="border p-3">Bewertung</th>
            <th className="border p-3">Preis</th>
            <th className="border p-3">Bewertungswert</th>
            <th className="border p-3">Genius</th>
            <th className="border p-3">Differenz</th>
            <th className="border p-3">Score</th>
            <th className="border p-3">Konkurrenz</th>
          </tr>
        </thead>

        <tbody>
          {hotelsWithScore.map((hotel, index) => (
           <tr
  key={index}
  className={
    hotel.name === "Hotel Goldene Krone"
  ? priceStatus === "Zu günstig"
    ? "bg-red-100 font-bold"
    : priceStatus === "Premium"
    ? "bg-green-100 font-bold"
    : "bg-yellow-100 font-bold"
      : hotel.name === topRatedHotel.name
      ? "bg-blue-100"
      : ""
  }
>
              <td className="border p-3">{hotel.name}</td>
              <td className="border p-3 text-center">
                {hotel.rating}
              </td>
              <td
  className={`border p-3 text-center font-bold ${
    hotel.price > myHotel.price
      ? "text-green-600"
      : "text-red-600"
  }`}
>
  {hotel.price} €
</td>
<td className="border p-3 text-center font-bold">
  {hotel.rating * 2}
</td>
              <td className="border p-3 text-center">
                {hotel.genius ? "Ja" : "Nein"}
              </td>
             <td
  className={
    hotel.price > myHotel.price
      ? "border p-3 text-center text-green-600 font-bold"
      : hotel.price < myHotel.price
      ? "border p-3 text-center text-red-600 font-bold"
      : "border p-3 text-center"
  }
>
  {hotel.price - myHotel.price} €
</td>

<td className="border p-3 text-center font-bold text-black">
  {hotel.score}
</td>
<td
  className={`border p-3 text-center font-bold ${
    hotel.competitionLevel === "Premium"
      ? "text-red-600"
      : hotel.competitionLevel === "Stark"
      ? "text-orange-500"
      : hotel.competitionLevel === "Normal"
      ? "text-yellow-600"
      : "text-green-600"
  }`}
>
  {hotel.competitionLevel}
</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 p-4 border rounded">
  <div className="mt-6 p-4 border rounded">
  <h2 className="text-2xl font-bold mb-2">
    Marktanalyse
  </h2>

  <p>
    Günstigere Hotels:
    {" "}
    <strong>{cheaperHotels}</strong>
  </p>

  <p>
    Teurere Hotels:
    {" "}
    <strong>{moreExpensiveHotels}</strong>
  </p>

  <p>
    Bestbewertetes Hotel:
    {" "}
    <strong>{topRatedHotel.name}</strong>
    {" "}
    ({topRatedHotel.rating})
  </p>
  <p>
  Stärkster Wettbewerber:{" "}
  <strong>{strongestCompetitor.name}</strong>
  {" "}({strongestCompetitor.score})
  {" "}– {strongestCompetitor.competitionLevel}
</p>
</div>
  <h2 className="text-2xl font-bold mb-2">
    Preisempfehlung
  </h2>

<p className="text-xl font-semibold mt-2">
  Empfohlener Zielpreis: {suggestedPrice} €
</p>

  <p
    className={
      recommendation === "Preis erhöhen"
        ? "text-green-600 font-bold"
        : "text-red-600 font-bold"
    }
  >
    {recommendation}
  </p>

  <p className="mt-2">
    Durchschnittspreis Konkurrenz:
    {" "}
    {averagePrice.toFixed(2)} €
  </p>
</div>
    </main>
  );
}