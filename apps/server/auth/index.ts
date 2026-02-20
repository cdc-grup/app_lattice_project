import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger, errorHandler } from '@app/core';
import { db, users, eq } from '@app/db';

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

app.post('/auth/register', async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: {
        code: "INVALID_INPUT",
        message: "Email and password are required",
        status: 400
      }
    });
  }

  try {
    // Check if user exists
    const existingResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingResult.length > 0) {
      return res.status(400).json({
        error: {
          code: "USER_EXISTS",
          message: "User already exists",
          user_friendly_message: "Aquest correu ja està registrat.",
          status: 400
        }
      });
    }

    // Create user (Mock hashing for demo)
    const newUser = await db.insert(users).values({
      email,
      passwordHash: password, // In a real app, use bcrypt here
      fullName: fullName || email.split('@')[0],
    }).returning();

    res.status(201).json({
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        fullName: newUser[0].fullName
      },
      token: `mock_jwt_token_for_${newUser[0].id}`
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: String(error) });
  }
});

app.post('/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: {
        code: "INVALID_INPUT",
        message: "Email and password are required",
        status: 400
      }
    });
  }

  try {
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = userResult[0];

    if (!user || user.passwordHash !== password) {
       return res.status(401).json({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
          user_friendly_message: "Correu o contrasenya incorrectes.",
          status: 401
        }
      });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      },
      token: `mock_jwt_token_for_${user.id}`
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: String(error) });
  }
});

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
    const userResult = await db.select().from(users).where(eq(users.email, 'kore@example.com')).limit(1);
    
    let user = userResult[0];

    if (!user) {
       user = { id: 1, email: 'kore@example.com', fullName: 'Kore User (Mock)' } as any; 
    }

    // 4. Return Success Response
    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      },
      token: "mock_jwt_token_valid_for_demo",
      ticket_info: {
        gate: "Porta 3",
        zone: "Tribuna G",
        seat: "Fila 12, Seient 4",
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
