from decimal import Decimal
from typing import List, Dict
from app.shared.gifts.schemas import RiskProfile

class SimulationService:
    # Industry-standard-ish mock CAGR for simulation
    _CAGR_MAP = {
        RiskProfile.Conservative: Decimal("0.06"),
        RiskProfile.Balanced: Decimal("0.09"),
        RiskProfile.Growth: Decimal("0.12")
    }

    @classmethod
    async def get_growth_projection(
        cls, 
        initial_corpus: Decimal, 
        risk_profile: RiskProfile, 
        years: int = 10
    ) -> List[Dict[str, any]]:
        """
        Generates a growth projection for the next N years.
        Returns a list of monthly data points for chart integration.
        """
        cagr = cls._CAGR_MAP.get(risk_profile, Decimal("0.09"))
        monthly_rate = (1 + cagr) ** (Decimal("1") / Decimal("12")) - 1
        
        projection = []
        current_value = initial_corpus
        
        # We'll return 12 data points (end of each year) or more? 
        # For a 10 year chart, let's return yearly points.
        for year in range(years + 1):
            projection.append({
                "year": year,
                "value": round(current_value, 2),
                "label": f"Year {year}"
            })
            current_value = current_value * (1 + cagr)
            
        return projection

    @classmethod
    def calculate_cagr(cls, initial: Decimal, final: Decimal, years: float) -> Decimal:
        if years == 0:
            return Decimal("0")
        return (final / initial) ** (Decimal("1") / Decimal(str(years))) - 1
