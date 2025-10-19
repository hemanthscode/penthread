import * as dashboardService from './dashboard.service.js';

export async function adminSummary(req, res, next) {
  try {
    const data = await dashboardService.getAdminSummary();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function adminStats(req, res, next) {
  try {
    const data = await dashboardService.getAdminStats();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function authorSummary(req, res, next) {
  try {
    const data = await dashboardService.getAuthorSummary(req.user._id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function authorStats(req, res, next) {
  try {
    const data = await dashboardService.getAuthorStats(req.user._id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function userSummary(req, res, next) {
  try {
    const data = await dashboardService.getUserSummary(req.user._id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
