import 'dotenv/config';
import { db, pool } from './index';
import { tickets } from './schema';
import { sql } from 'drizzle-orm';
import * as QRCode from 'qrcode';

async function generateTestTickets() {
  console.log('Generating test tickets for QR scanning...');

  const testTickets = [
    {
      userId: 1,
      code: 'CIRCUIT-VIP-2026',
      gate: 'Gate 1 (VIP)',
      zoneName: 'Paddock Club',
      seatRow: 'A',
      seatNumber: '12',
      isActive: true,
      createdAt: new Date(),
    },
    {
      userId: 1,
      code: 'CIRCUIT-G-2026',
      gate: 'Gate 3',
      zoneName: 'Grandstand G',
      seatRow: '15',
      seatNumber: '42',
      isActive: true,
      createdAt: new Date(),
    },
    {
      userId: 1,
      code: 'CIRCUIT-PLATINUM-2026',
      gate: 'Gate 0',
      zoneName: 'Platinum Lounge',
      seatRow: '1',
      seatNumber: '1',
      isActive: true,
      createdAt: new Date(),
    },
    {
      userId: 1,
      code: 'CIRCUIT-EXTRA-VIP',
      email: 'tester_circuitvip2026@example.com',
      gate: 'Gate 1 (VIP)',
      zoneName: 'Paddock Club (Extra)',
      seatRow: 'B',
      seatNumber: '24',
      isActive: true,
      createdAt: new Date(),
    },
  ];

    for (const ticket of (testTickets as any[])) {
      // Create JSON Payload
      const payload = JSON.stringify({
        code: ticket.code,
        email: ticket.email || `tester_${ticket.code.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`
      });

      // Insert ticket into DB if it doesn't exist
      await db.insert(tickets).values({
        userId: ticket.userId,
        code: ticket.code,
        gate: ticket.gate,
        zoneName: ticket.zoneName,
        seatRow: ticket.seatRow,
        seatNumber: ticket.seatNumber,
        isActive: ticket.isActive,
        createdAt: ticket.createdAt,
      }).onConflictDoNothing();
      
      console.log(`\n================================`);
      console.log(`🎟️  ${ticket.zoneName} - ${ticket.code}`);
      console.log(`Payload: ${payload}`);
      console.log(`================================`);
      
      // Generate QR in terminal
      QRCode.toString(payload, { type: 'terminal', small: true }, function (err, url) {
        console.log(url);
      });
    }

  console.log(`\n✅ Test tickets generated successfully! Scan these with your Expo app.`);
  await pool.end();
}

generateTestTickets().catch((err) => {
  console.error('Failed to generate test tickets:', err);
  process.exit(1);
});
