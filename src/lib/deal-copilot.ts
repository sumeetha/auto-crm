import { inventory, type Vehicle } from "@/lib/mock-data";

export function getUpsellOptions(
  currentVehicle: Vehicle,
  excludeId: string,
): Vehicle[] {
  return inventory
    .filter(
      (v) =>
        v.make === currentVehicle.make &&
        v.model === currentVehicle.model &&
        v.status === "available" &&
        v.id !== excludeId,
    )
    .sort((a, b) => a.msrp - b.msrp);
}

export function estimateMonthlyPayment(
  sellingPrice: number,
  tradeCredit: number,
  termMonths: number,
  apr: number = 5.9,
): number {
  const principal = Math.max(sellingPrice - tradeCredit, 0);
  const monthlyRate = apr / 100 / 12;
  if (monthlyRate === 0) return principal / termMonths;
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)
  );
}

export function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString()}`;
}

export function formatCurrencyCompact(value: number): string {
  if (value === 0) return "—";
  return `$${Math.round(value).toLocaleString()}`;
}
