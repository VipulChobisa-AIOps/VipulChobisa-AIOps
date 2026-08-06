import numpy as np
import pandas as pd

def calculate_portfolio_metrics(returns: pd.DataFrame, weights: np.ndarray, risk_free_rate: float = 0.02):
    """
    Calculates the expected return, volatility, and Sharpe ratio of a portfolio.
    """
    mean_returns = returns.mean() * 252
    cov_matrix = returns.cov() * 252
    
    port_return = np.sum(mean_returns * weights)
    port_volatility = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
    sharpe_ratio = (port_return - risk_free_rate) / port_volatility if port_volatility > 0 else 0
    
    return port_return, port_volatility, sharpe_ratio

def optimize_portfolio(returns: pd.DataFrame, num_portfolios: int = 1000):
    """
    Simulates portfolios to find the max Sharpe ratio allocation.
    Returns (Optimal Return, Optimal Volatility, Optimal Sharpe, Optimal Weights).
    """
    num_assets = len(returns.columns)
    results = np.zeros((3, num_portfolios))
    weights_record = []
    
    mean_daily_returns = returns.mean()
    cov_matrix = returns.cov()
    
    for i in range(num_portfolios):
        weights = np.random.random(num_assets)
        weights /= np.sum(weights)
        weights_record.append(weights)
        
        p_ret = np.sum(mean_daily_returns * weights) * 252
        p_std = np.sqrt(np.dot(weights.T, np.dot(cov_matrix * 252, weights)))
        
        sharpe = (p_ret - 0.02) / p_std
        results[0, i] = p_ret
        results[1, i] = p_std
        results[2, i] = sharpe
        
    max_sharpe_idx = np.argmax(results[2])
    optimal_weights = weights_record[max_sharpe_idx]
    
    return results[0, max_sharpe_idx], results[1, max_sharpe_idx], results[2, max_sharpe_idx], optimal_weights
