from decimal import Decimal
import pytest
from app.shared.utils import convert_usd_to_inr, convert_inr_to_usd
from app.shared.simulation.service import SimulationService
from app.shared.gifts.schemas import RiskProfile

def test_fx_conversion():
    usd = Decimal("100")
    inr = convert_usd_to_inr(usd)
    assert inr == Decimal("8350.0")
    
    back_to_usd = convert_inr_to_usd(inr)
    assert back_to_usd == usd

@pytest.mark.asyncio
async def test_growth_projection():
    initial = Decimal("1000")
    # Balanced is 9% CAGR
    projection = await SimulationService.get_growth_projection(initial, RiskProfile.Balanced, years=1)
    
    assert len(projection) == 2 # Year 0 and Year 1
    assert projection[0]["value"] == initial
    # Year 1: 1000 * 1.09 = 1090
    assert projection[1]["value"] == Decimal("1090.00")

def test_calculate_cagr():
    initial = Decimal("1000")
    final = Decimal("1210") # (1.1)^2 * 1000
    cagr = SimulationService.calculate_cagr(initial, final, 2)
    assert round(cagr, 2) == Decimal("0.10")
