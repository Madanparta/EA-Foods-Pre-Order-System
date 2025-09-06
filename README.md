# Application
PORT=3000
NODE_ENV=development

# Database (for SQLite - using local file)
DATABASE_URL=./db/eafoods.sqlite

# App settings
ORDER_CUTOFF_HOUR=18           # 6 PM cut-off for next-day orders
MORNING_SLOT=08:00-11:00
AFTERNOON_SLOT=12:00-15:00
EVENING_SLOT=16:00-19:00

# Ops stock update times
STOCK_UPDATE_MORNING=08:00
STOCK_UPDATE_EVENING=18:00

# Timezone
TIMEZONE=Africa/Nairobi

# Seed Data
SEED_PRODUCT_COUNT=10
SEED_USER_COUNT=5

# Logging
LOG_LEVEL=debug