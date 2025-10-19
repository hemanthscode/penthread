export function successResponse(res, data, message = '') {
  return res.json({ success: true, message, data });
}

export function errorResponse(res, message = 'Error occurred', statusCode = 500) {
  return res.status(statusCode).json({ success: false, message });
}
