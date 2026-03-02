import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger, errorHandler } from '@app/core';
import { db, users, tickets, eq, and } from '@app/db';

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
  const { email, password, fullName, ticket_code } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: {
        code: 'INVALID_INPUT',
        message: 'Email and password are required',
        status: 400,
      },
    });
  }

  try {
    // Check if user exists
    const existingResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const existingUser = existingResult[0];

    if (existingUser) {
      // If the user was auto-created via Fast Ticket Sync, they will have 'auto_generated_pass'
      if (existingUser.passwordHash === 'auto_generated_pass') {
        const updatedUser = await db
          .update(users)
          .set({
             passwordHash: password, // In a real app, use bcrypt here
             fullName: fullName || existingUser.fullName,
             // Keep their existing ticket status, or set true if they are linking a new one now
             hasTicket: ticket_code ? true : existingUser.hasTicket
          })
          .where(eq(users.id, existingUser.id))
          .returning();
          
        const user = updatedUser[0];

        if (ticket_code) {
          await db.update(tickets).set({ userId: user.id }).where(eq(tickets.code, ticket_code));
        }

        return res.status(200).json({
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            hasTicket: user.hasTicket,
          },
          token: `mock_jwt_token_for_${user.id}`,
        });
      }

      // Standard user already exists error
      return res.status(400).json({
        error: {
          code: 'USER_EXISTS',
          message: 'User already exists',
          user_friendly_message: 'Aquest correu ja està registrat.',
          status: 400,
        },
      });
    }

    let hasTicket = false;
    // Link ticket if provided
    if (ticket_code) {
      hasTicket = true;
    }

    // Create user (Mock hashing for demo)
    const newUser = await db
      .insert(users)
      .values({
        email,
        passwordHash: password, // In a real app, use bcrypt here
        fullName: fullName || email.split('@')[0],
        hasTicket,
      })
      .returning();

    if (ticket_code) {
      await db.update(tickets).set({ userId: newUser[0].id }).where(eq(tickets.code, ticket_code));
    }

    res.status(201).json({
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        fullName: newUser[0].fullName,
        hasTicket: newUser[0].hasTicket,
      },
      token: `mock_jwt_token_for_${newUser[0].id}`,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: String(error) });
  }
});

app.post('/auth/login', async (req: Request, res: Response) => {
  const { email, password, ticket_code } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: {
        code: 'INVALID_INPUT',
        message: 'Email and password are required',
        status: 400,
      },
    });
  }

  try {
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = userResult[0];

    if (!user || user.passwordHash !== password) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
          user_friendly_message: 'Correu o contrasenya incorrectes.',
          status: 401,
        },
      });
    }

    let hasTicket = user.hasTicket;

    // Link ticket if provided
    if (ticket_code) {
      await db.update(tickets).set({ userId: user.id }).where(eq(tickets.code, ticket_code));
      await db.update(users).set({ hasTicket: true }).where(eq(users.id, user.id));
      hasTicket = true;
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        hasTicket,
      },
      token: `mock_jwt_token_for_${user.id}`,
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: String(error) });
  }
});

app.post('/auth/ticket/claim', async (req: Request, res: Response) => {
  const { ticket_code } = req.body;
  const authHeader = req.headers.authorization;

  if (!ticket_code) {
    return res.status(400).json({
      error: {
        code: "MISSING_QR",
        message: "Ticket code is required",
        user_friendly_message: "Falta el codi QR del ticket.",
        status: 400
      }
    });
  }

  try {
    // Find the ticket
    const ticketResult = await db.select().from(tickets).where(eq(tickets.code, ticket_code)).limit(1);
    const ticket = ticketResult[0];

    if (!ticket) {
      return res.status(404).json({
        error: {
          code: "TICKET_NOT_FOUND",
          message: "Ticket not found",
          user_friendly_message: "Aquesta entrada no existeix.",
          status: 404
        }
      });
    }

    if (ticket.userId) {
      return res.status(400).json({
        error: {
          code: "TICKET_ALREADY_CLAIMED",
          message: "Ticket is already claimed by another user",
          user_friendly_message: "Aquesta entrada ja està associada a un usuari.",
          status: 400
        }
      });
    }

    if (!ticket.isActive) {
      return res.status(400).json({
        error: {
          code: "TICKET_INACTIVE",
          message: "Ticket is inactive",
          user_friendly_message: "Aquesta entrada no està activa.",
          status: 400
        }
      });
    }

    // User is logged in? We mock the auth header for now.
    // If authHeader is present, and starts with Bearer mock_jwt_token_for_
    if (authHeader && authHeader.startsWith('Bearer mock_jwt_token_for_')) {
      const userIdStr = authHeader.replace('Bearer mock_jwt_token_for_', '');
      const userId = parseInt(userIdStr, 10);

      // Claim ticket
      await db.update(tickets).set({ userId }).where(eq(tickets.code, ticket_code));
      await db.update(users).set({ hasTicket: true }).where(eq(users.id, userId));

      return res.json({
        success: true,
        message: "Ticket claimed successfully",
        ticket_info: ticket
      });
    } else {
      // User is not logged in / explicitly providing token
      return res.status(400).json({
        error: {
          code: "REQUIRES_ACCOUNT",
          message: "You must be logged in to claim this ticket",
          user_friendly_message: "Si us plau, inicia sessió o registra't per associar l'entrada.",
          status: 400
        }
      });
    }
  } catch (error) {
    console.error('Ticket Claim Error:', error);
    res.status(500).json({ error: String(error) });
  }
});

app.post('/auth/ticket-sync', async (req: Request, res: Response) => {
  const { qr_code_data, device_id } = req.body;

  console.log(`[Auth] Ticket Sync Request: QR=${qr_code_data}, Device=${device_id}`);

  // 1. Validate Input
  if (!qr_code_data) {
    return res.status(400).json({
      error: {
        code: 'MISSING_QR',
        message: 'QR code data is required',
        user_friendly_message: 'Falta el codi QR.',
        status: 400,
      },
    });
  }

  try {
    // 2. Parse QR payload expecting JSON: { "code": "CIRCUIT25", "email": "user@example.com" }
    // If it's a simple string like CIRCUIT25, we fallback to a mock email for demo purposes
    let ticketCode = qr_code_data;
    let email = `guest_${Math.random().toString(36).substring(7)}@example.com`;

    try {
      const parsedData = JSON.parse(qr_code_data);
      if (parsedData.code && parsedData.email) {
        ticketCode = parsedData.code;
        email = parsedData.email;
      }
    } catch (e) {
      // Not a JSON string, assume it's just the code. We will use the generated guest email.
      console.log(`[Auth] QR is not JSON, treating as raw code. Generated email: ${email}`);
    }

    if (ticketCode === 'INVALID_TICKET') {
      return res.status(400).json({
        error: {
          code: 'TICKET_INVALID',
          message: 'The QR code implies a generic entry, please select zone manually.',
          user_friendly_message: 'Entrada no vàlida o caducada.',
          status: 400,
        },
      });
    }

    // 3. Find or Create User
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    let user = userResult[0];

    if (!user) {
      // Auto-create user
      const insertedUser = await db
        .insert(users)
        .values({
          email,
          passwordHash: 'auto_generated_pass', // Not used for QR sync
          fullName: email.split('@')[0],
          hasTicket: true,
        })
        .returning();
      user = insertedUser[0];
    } else {
      // Update existing user
      await db.update(users).set({ hasTicket: true }).where(eq(users.id, user.id));
      user.hasTicket = true; // Update local object for response
    }

    // 4. Link ticket
    
    // Check if ticket exists in DB (mock creation if it doesn't exist for demo purposes)
    const existingTicket = await db.select().from(tickets).where(eq(tickets.code, ticketCode)).limit(1);
    let ticketInfo;

    if (existingTicket.length > 0) {
       await db.update(tickets).set({ userId: user.id }).where(eq(tickets.code, ticketCode));
       ticketInfo = existingTicket[0];
    } else {
       // Mock ticket for demo
       ticketInfo = {
        gate: 'Porta 3',
        zoneName: 'Tribuna G',  // aligning with schema
        seatRow: '12',
        seatNumber: '4',
        seatLocation: [2.2645, 41.5701], // Mock geom array
      };
    }

    // 5. Return Full Session Response
    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        hasTicket: user.hasTicket,
      },
      token: `mock_jwt_token_for_${user.id}`,
      ticket_info: ticketInfo,
      requires_setup: user.passwordHash === 'auto_generated_pass',
    });
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: String(error),
        status: 500,
      },
    });
  }
});

app.patch('/auth/me', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer mock_jwt_token_for_')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userIdStr = authHeader.replace('Bearer mock_jwt_token_for_', '');
  const userId = parseInt(userIdStr, 10);
  const { avoidStairs, avoidCrowds, avoidSlopes, avoidGrandstands, fullName } = req.body;

  try {
    const updatedUser = await db
      .update(users)
      .set({
        avoidStairs: avoidStairs !== undefined ? avoidStairs : undefined,
        avoidCrowds: avoidCrowds !== undefined ? avoidCrowds : undefined,
        avoidSlopes: avoidSlopes !== undefined ? avoidSlopes : undefined,
        avoidGrandstands: avoidGrandstands !== undefined ? avoidGrandstands : undefined,
        fullName: fullName || undefined,
      })
      .where(eq(users.id, userId))
      .returning();

    const { passwordHash, ...safeUser } = updatedUser[0];
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.get('/auth/me', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer mock_jwt_token_for_')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userIdStr = authHeader.replace('Bearer mock_jwt_token_for_', '');
  const userId = parseInt(userIdStr, 10);

  try {
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    if (userResult.length > 0) {
      const { passwordHash, ...safeUser } = userResult[0];
      res.json(safeUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`[Auth Service] running on port ${PORT}`);
});
