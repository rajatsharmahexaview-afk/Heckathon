from decimal import Decimal

# Fixed FX rate as per T024
FX_USD_TO_INR = Decimal("83.5")

def convert_usd_to_inr(usd_amount: Decimal) -> Decimal:
    return usd_amount * FX_USD_TO_INR

def convert_inr_to_usd(inr_amount: Decimal) -> Decimal:
    return inr_amount / FX_USD_TO_INR
