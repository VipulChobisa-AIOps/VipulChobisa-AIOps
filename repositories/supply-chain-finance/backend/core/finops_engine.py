from typing import Dict
from .inventory import calculate_eoq, calculate_safety_stock, calculate_reorder_point

def analyze_working_capital(
    sku: str, 
    annual_demand: float, 
    unit_cost: float, 
    holding_rate: float, 
    ordering_cost: float,
    current_inventory_level: float,
    market_yield_rate: float = 0.08
) -> Dict:
    """
    Unifies inventory optimization with capital opportunity cost.
    Evaluates if current stock is tying up excessive capital that could be invested.
    """
    holding_cost_per_unit = unit_cost * holding_rate
    
    # 1. Supply Chain Optimization
    optimal_eoq = calculate_eoq(annual_demand, ordering_cost, holding_cost_per_unit)
    
    # 2. Capital Analysis
    current_capital_tied = current_inventory_level * unit_cost
    optimal_capital_tied = optimal_eoq * unit_cost
    
    excess_capital = max(0.0, current_capital_tied - optimal_capital_tied)
    
    # 3. Financial Opportunity Cost
    opportunity_yield = excess_capital * market_yield_rate
    
    return {
        "sku": sku,
        "optimal_order_quantity": round(optimal_eoq, 2),
        "current_capital_tied": round(current_capital_tied, 2),
        "optimal_capital_tied": round(optimal_capital_tied, 2),
        "excess_capital_identified": round(excess_capital, 2),
        "potential_annual_yield": round(opportunity_yield, 2),
        "recommendation": f"Reduce order size to {int(optimal_eoq)} units to free up ${excess_capital:,.2f} in working capital." if excess_capital > 0 else "Inventory levels are capital efficient."
    }
