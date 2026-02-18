import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger, errorHandler } from '@app/core';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(logger);

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'auth_service_ok', timestamp: new Date() });
});

// --- ROUTES ---
// --- ROUTES ---
import { db, users, eq } from '@app/db';

app.post('/auth/ticket-sync', async (req: Request, res: Response) => {
  const { qr_code_data, device_id } = req.body;

  console.log(`[Auth] Ticket Sync Request: QR=${qr_code_data}, Device=${device_id}`);

  // 1. Validate Input (Mock Logic)
  if (!qr_code_data) {
    return res.status(400).json({
      error: {
        code: "MISSING_QR",
        message: "QR code data is required",
        user_friendly_message: "Falta el codi QR.",
        status: 400
      }
    });
  }

  // 2. Mock Validation Logic
  // In a real scenario, we would validate against a 3rd party ticketing API
  if (qr_code_data === 'INVALID_TICKET') {
    return res.status(400).json({
      error: {
        code: "TICKET_INVALID",
        message: "The QR code implies a generic entry, please select zone manually.",
        user_friendly_message: "Entrada no vàlida o caducada.",
        status: 400
      }
    });
  }

  try {
    // 3. Find or Create User (Mock: returning the seed user)
    // We assume the QR code is linked to 'kore@example.com' for this demo
    const userResult = await db.select().from(users).where(eq(users.email, 'kore@example.com')).limit(1);
    
    let user = userResult[0];

    if (!user) {
       // Fallback mock if seed didn't run or email changed
       user = { id: 'u-mock-123', email: 'kore@example.com', fullName: 'Kore User (Mock)' } as any; 
    }

    // 4. Return Success Response
    res.json({
      user_id: user.id,
      token: "mock_jwt_token_valid_for_demo",
      ticket_info: {
        gate: "Porta 3",
        zone: "Tribuna G",
        seat: "Fila 12, Seient 4",
        // Coordinates for Grandstand G from our seed
        seat_coordinates: [2.2645, 41.5701] 
      }
    });

  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ 
      error: {
        code: "INTERNAL_ERROR",
        message: String(error),
        status: 500
      }
    });
  }
});

app.get('/users/me', async (req: Request, res: Response) => {
  // Mock Auth: Expect "Authorization: Bearer <user_id>" or just assume 'kore@example.com' if testing
  const authHeader = req.headers.authorization;
  // In a real app we 'd verify JWT. Here we just take the token as if it were the ID or ignore it for the seed user.
  
  try {
     const userResult = await db.select().from(users).where(eq(users.email, 'kore@example.com')).limit(1);
     if (userResult.length > 0) {
        const { passwordHash, ...safeUser } = userResult[0];
        res.json(safeUser);
     } else {
        res.status(404).json({ error: "User not found" });
     }
  } catch (error) {
     res.status(500).json({ error: String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`[Auth Service] running on port ${PORT}`);
});
