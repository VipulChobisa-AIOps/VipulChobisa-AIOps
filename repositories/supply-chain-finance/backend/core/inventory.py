import math

def calculate_eoq(demand: float, ordering_cost: float, holding_cost_per_unit: float) -> float:
    """
    Economic Order Quantity (EOQ) formula.
    """
    if holding_cost_per_unit <= 0:
        return 0.0
    return math.sqrt((2 * demand * ordering_cost) / holding_cost_per_unit)

def calculate_safety_stock(lead_time_days: float, demand_std_dev: float, service_factor: float = 1.65) -> float:
    """
    Calculates safety stock buffer to prevent stockouts.
    Z-score for 95% is ~1.65.
    """
    return service_factor * (demand_std_dev * math.sqrt(lead_time_days))

def calculate_reorder_point(daily_demand: float, lead_time_days: float, safety_stock: float) -> float:
    """
    Calculates the inventory level at which a new order should be placed.
    """
    return (daily_demand * lead_time_days) + safety_stock
