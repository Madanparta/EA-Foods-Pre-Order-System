import cron from 'node-cron';
import stockService from '../services/stockService.js';

export function scheduleStockUpdates() {
  cron.schedule('0 8 * * *', async () => {
    try {
      console.log('[CRON] Running 8AM stock update...');
      await stockService.performOpsStockUpdate('08:00');
      console.log('[CRON] 8AM stock update completed');
    } catch (err) {
      console.error('[CRON] 8AM stock update failed', err);
    }
  });

  // 6 PM update
  cron.schedule('0 18 * * *', async () => {
    try {
      console.log('[CRON] Running 6PM stock update...');
      await stockService.performOpsStockUpdate('18:00');
      console.log('[CRON] 6PM stock update completed');
    } catch (err) {
      console.error('[CRON] 6PM stock update failed', err);
    }
  });
}
