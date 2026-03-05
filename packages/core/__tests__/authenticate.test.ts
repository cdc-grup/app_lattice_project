import { describe, it, expect, vi } from 'vitest';
import { authenticate } from '../index';
import { Request, Response } from 'express';

describe('authenticate middleware', () => {
  it('should call next() if valid bearer token is provided', () => {
    const mockReq = {
      headers: {
        authorization: 'Bearer mock_jwt_token_for_1',
      },
    } as unknown as Request;
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const mockNext = vi.fn();

    authenticate(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should return 401 if no authorization header is present', () => {
    const mockReq = {
      headers: {},
    } as unknown as Request;
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const mockNext = vi.fn();

    authenticate(mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Unauthorized access',
        status: 401,
      },
    });
  });

  it('should return 401 if authorization header is invalid', () => {
    const mockReq = {
      headers: {
        authorization: 'InvalidToken',
      },
    } as unknown as Request;
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const mockNext = vi.fn();

    authenticate(mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(401);
  });
});
